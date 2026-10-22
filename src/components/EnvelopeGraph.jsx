import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { controls } from '../mininova';
import { useSetControl } from './useSetControl';

// Schematic of an envelope, drawn from its current values. Segment widths follow the
// parameter values (0-127), not real time: the synth's time curves are non-linear.

const WIDTH = 320;
const HEIGHT = 120;
const PAD = { left: 10, right: 10, top: 12, bottom: 22 };
const TOP = PAD.top;
const BOTTOM = HEIGHT - PAD.bottom;
const SEGMENT = { delay: 40, attack: 62, decay: 62, sustain: 58, release: 62 };
const KEY_OFF = 127;

const clamp = (value, [min, max]) => Math.min(Math.max(Math.round(value), min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const levelY = level => lerp(BOTTOM, TOP, level / 127);

// Quadratic curve from a to b; slope 0 is a straight line, 127 moves fastest at first
const curve = ([ax, ay], [bx, by], [fx, fy], slope) => {
  const t = slope / 127;
  const cx = lerp((ax + bx) / 2, fx, t);
  const cy = lerp((ay + by) / 2, fy, t);
  return `Q${cx} ${cy} ${bx} ${by}`;
};

function EnvelopeGraph({ number, emit }) {
  const setControl = useSetControl(emit);
  const svgRef = useRef(null);
  const id = param => `env-${number}-${param}`;
  const hasDelay = !!controls[id('delay')];

  const values = useSelector(state => ({
    delay: hasDelay ? state.patch[id('delay')] ?? 0 : 0,
    attack: state.patch[id('attack')] ?? 0,
    decay: state.patch[id('decay')] ?? 0,
    sustain: state.patch[id('sustain')] ?? 0,
    release: state.patch[id('release')] ?? 0,
    sustainRate: state.patch[id('sustain-rate')] ?? 0,
    sustainTime: state.patch[id('sustain-time')] ?? KEY_OFF,
    attackSlope: state.patch[id('attack-slope')] ?? 0,
    decaySlope: state.patch[id('decay-slope')] ?? 0,
  }), (a, b) => Object.keys(a).every(key => a[key] === b[key]));

  const set = (param, value) => {
    const control = controls[id(param)];
    const next = clamp(value, control.range);
    if (next === values[param]) {
      return;
    }
    setControl(id(param), next);
  };

  // Points of the envelope
  const x0 = PAD.left;
  const xStart = x0 + (hasDelay ? (values.delay / 127) * SEGMENT.delay : 0);
  const xPeak = xStart + (values.attack / 127) * SEGMENT.attack;
  const xDecayEnd = xPeak + (values.decay / 127) * SEGMENT.decay;
  const timedSustain = values.sustainTime < KEY_OFF;
  const xSustainEnd = xDecayEnd + (timedSustain ? (values.sustainTime / 127) * SEGMENT.sustain : SEGMENT.sustain);
  const xReleaseEnd = xSustainEnd + (values.release / 127) * SEGMENT.release;

  const ySustain = levelY(values.sustain);
  // Sustain Rate makes the level rise or fall while the key is held
  const ySustainEnd = Math.min(Math.max(ySustain - (values.sustainRate / 64) * (BOTTOM - TOP) * 0.5, TOP), BOTTOM);

  const path = [
    `M${x0} ${BOTTOM}`,
    `L${xStart} ${BOTTOM}`,
    curve([xStart, BOTTOM], [xPeak, TOP], [xStart, TOP], values.attackSlope),
    curve([xPeak, TOP], [xDecayEnd, ySustain], [xPeak, ySustain], values.decaySlope),
    `L${xSustainEnd} ${ySustainEnd}`,
    curve([xSustainEnd, ySustainEnd], [xReleaseEnd, BOTTOM], [xSustainEnd, BOTTOM], values.decaySlope),
  ].join(' ');

  // Dragging: convert the pointer position to SVG coordinates
  const toSvg = event => {
    const point = new DOMPoint(event.clientX, event.clientY);
    return point.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  const handles = [
    hasDelay && {
      key: 'delay', x: xStart, y: BOTTOM, label: 'Delay',
      drag: ({ x }) => set('delay', ((x - x0) / SEGMENT.delay) * 127),
      keys: { ArrowLeft: ['delay', -1], ArrowRight: ['delay', 1] },
    },
    {
      key: 'attack', x: xPeak, y: TOP, label: 'Attack',
      drag: ({ x }) => set('attack', ((x - xStart) / SEGMENT.attack) * 127),
      keys: { ArrowLeft: ['attack', -1], ArrowRight: ['attack', 1] },
    },
    {
      key: 'decay', x: xDecayEnd, y: ySustain, label: 'Decay and Sustain',
      drag: ({ x, y }) => {
        set('decay', ((x - xPeak) / SEGMENT.decay) * 127);
        set('sustain', ((BOTTOM - y) / (BOTTOM - TOP)) * 127);
      },
      keys: { ArrowLeft: ['decay', -1], ArrowRight: ['decay', 1], ArrowUp: ['sustain', 1], ArrowDown: ['sustain', -1] },
    },
    {
      key: 'release', x: xReleaseEnd, y: BOTTOM, label: 'Release',
      drag: ({ x }) => set('release', ((x - xSustainEnd) / SEGMENT.release) * 127),
      keys: { ArrowLeft: ['release', -1], ArrowRight: ['release', 1] },
    },
  ].filter(Boolean);

  const onPointerDown = event => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
  };

  const onPointerMove = handle => event => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      handle.drag(toSvg(event));
    }
  };

  // Arrow keys nudge the values; Shift moves by 10
  const onKeyDown = handle => event => {
    const action = handle.keys[event.key];
    if (!action) {
      return;
    }
    event.preventDefault();
    const [param, step] = action;
    set(param, values[param] + step * (event.shiftKey ? 10 : 1));
  };

  const labels = [
    hasDelay && ['DLY', x0, xStart],
    ['A', xStart, xPeak],
    ['D', xPeak, xDecayEnd],
    ['S', xDecayEnd, xSustainEnd],
    ['R', xSustainEnd, xReleaseEnd],
  ].filter(Boolean)
    // Skip labels of segments too narrow to hold them
    .filter(([, from, to]) => to - from >= 12);

  return (
    <figure className="envelope-graph">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="group"
        aria-label={`Envelope ${number} shape. Drag the points, or focus one and use the arrow keys.`}
      >
        <defs>
          <linearGradient id={`env-fill-${number}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="envelope-fill-top" />
            <stop offset="1" className="envelope-fill-bottom" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map(level => (
          <line key={level} className="envelope-grid" x1={PAD.left} x2={WIDTH - PAD.right} y1={levelY(level * 127)} y2={levelY(level * 127)} />
        ))}
        <line className="envelope-axis" x1={PAD.left} x2={WIDTH - PAD.right} y1={BOTTOM} y2={BOTTOM} />
        <line className="envelope-key-off" x1={xSustainEnd} x2={xSustainEnd} y1={TOP} y2={BOTTOM} />
        <text className="envelope-key-off-label" x={xSustainEnd + 3} y={TOP + 8}>{timedSustain ? 'timed' : 'key off'}</text>

        <path className="envelope-area" d={`${path} L${xReleaseEnd} ${BOTTOM} Z`} fill={`url(#env-fill-${number})`} />
        <path className="envelope-line" d={path} />

        {labels.map(([label, from, to]) => (
          <text key={label} className="envelope-label" x={(from + to) / 2} y={HEIGHT - 6} textAnchor="middle">{label}</text>
        ))}

        {handles.map(handle => (
          <circle
            key={handle.key}
            className="envelope-handle"
            cx={handle.x}
            cy={handle.y}
            r="6"
            tabIndex="0"
            role="slider"
            aria-label={`Envelope ${number} ${handle.label}`}
            aria-valuemin={0}
            aria-valuemax={127}
            aria-valuenow={values[handle.key]}
            aria-valuetext={handle.key === 'decay'
              ? `Decay ${values.decay}, Sustain ${values.sustain}`
              : `${values[handle.key]}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove(handle)}
            onKeyDown={onKeyDown(handle)}
          />
        ))}
      </svg>
      <figcaption>Drag the points · shape only, not to time scale</figcaption>
    </figure>
  );
}

export default EnvelopeGraph;

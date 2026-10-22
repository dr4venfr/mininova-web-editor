import React from 'react';
import { guideLink } from '../help';

// Signal path of the MiniNova, after the "Simplified block diagram" of the User Guide (p. 13).
// Each block opens the tab holding its settings.

const sources = ['Osc 1', 'Osc 2', 'Osc 3', 'Noise', 'Ring mod 1×3', 'Ring mod 2×3'];
const slots = ['FX 1', 'FX 2', 'FX 3', 'FX 4', 'FX 5'];

function Block({ x, y, width, height, label, sublabel, tab, activeTab, onSelect, group }) {
  const select = () => onSelect(tab);
  const onKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select();
    }
  };

  return (
    <g
      className={`flow-block${group ? ' flow-group' : ''}${tab === activeTab ? ' flow-active' : ''}`}
      role={group ? undefined : 'button'}
      tabIndex={group ? undefined : 0}
      aria-hidden={group || undefined}
      aria-label={group ? undefined : `${label}${sublabel ? ` (${sublabel})` : ''}: open settings`}
      onClick={select}
      onKeyDown={onKeyDown}
    >
      <rect x={x} y={y} width={width} height={height} rx="5" />
      {!group && (
        <text x={x + width / 2} y={y + height / 2 + (sublabel ? -3 : 4)} textAnchor="middle">{label}</text>
      )}
      {sublabel && (
        <text className="flow-sublabel" x={x + width / 2} y={y + height / 2 + 11} textAnchor="middle">{sublabel}</text>
      )}
    </g>
  );
}

const Arrow = ({ d, dashed }) => (
  <path className={`flow-arrow${dashed ? ' flow-arrow-mod' : ''}`} d={d} markerEnd={dashed ? 'url(#flow-head-mod)' : 'url(#flow-head)'} />
);

function SignalFlow({ activeTab, onSelect }) {
  const block = { activeTab, onSelect };

  return (
    <details className="signal-flow" open>
      <summary>
        Signal flow
        <span>Click a block to open its settings · <a href={guideLink(13)} target="_blank" rel="noreferrer">User guide p. 13</a></span>
      </summary>
      <div className="signal-flow-scroll">
        <svg viewBox="0 0 960 345" role="group" aria-label="MiniNova signal flow">
          <defs>
            <marker id="flow-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" className="flow-head" />
            </marker>
            <marker id="flow-head-mod" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" className="flow-head-mod" />
            </marker>
          </defs>

          {/* Modulation lane */}
          <Block x={10} y={14} width={100} height={28} label="LFO 1–3" tab="lfos" {...block} />
          <Block x={10} y={50} width={100} height={28} label="Env 3–6" tab="envelopes" {...block} />
          <Block x={150} y={30} width={130} height={32} label="Mod Matrix" sublabel="20 slots" tab="mod-matrix" {...block} />
          <Arrow d="M110 28H128Q140 28 140 40V46H148" dashed />
          <Arrow d="M110 64H128Q140 64 140 52V46H148" dashed />
          <Arrow d="M215 62V104" dashed />
          <text className="flow-note" x="222" y="88">modulates almost any parameter</text>
          <Block x={415} y={30} width={130} height={32} label="Env 2" sublabel="filter" tab="envelopes" {...block} />
          <Block x={580} y={30} width={120} height={32} label="Env 1" sublabel="amp" tab="envelopes" {...block} />
          <Arrow d="M480 62V146" dashed />
          <Arrow d="M640 62V187" dashed />

          {/* Notes in */}
          <Block x={10} y={170} width={100} height={60} label="Keys" sublabel="Arp → Chord" tab="arp" {...block} />
          <Arrow d="M110 200H148" />

          {/* Sources and mixer */}
          <Block x={150} y={106} width={130} height={196} label="" tab="oscillators" group {...block} />
          {sources.map((label, i) => (
            <Block key={label} x={160} y={114 + i * 30} width={110} height={24} label={label} tab="oscillators" {...block} />
          ))}
          {sources.map((label, i) => (
            <Arrow key={label} d={`M270 ${126 + i * 30}H298`} />
          ))}
          <Block x={300} y={106} width={60} height={196} label="Mixer" tab="oscillators" {...block} />

          {/* Filters */}
          <Arrow d="M360 204H388" />
          <Block x={390} y={148} width={180} height={112} label="" tab="filters" group {...block} />
          <Block x={400} y={160} width={70} height={36} label="Drive" tab="filters" {...block} />
          <Block x={485} y={160} width={75} height={36} label="Filter 1" tab="filters" {...block} />
          <Block x={400} y={212} width={70} height={36} label="Drive" tab="filters" {...block} />
          <Block x={485} y={212} width={75} height={36} label="Filter 2" tab="filters" {...block} />
          <Arrow d="M470 178H483" />
          <Arrow d="M470 230H483" />

          {/* Amp, effects, output */}
          <Arrow d="M570 204H598" />
          <Block x={600} y={189} width={80} height={30} label="Amp" tab="envelopes" {...block} />
          <Arrow d="M680 204H718" />
          <Block x={720} y={106} width={110} height={196} label="" tab="effects" group {...block} />
          {slots.map((label, i) => (
            <Block key={label} x={735} y={116 + i * 36} width={80} height={28} label={label} tab="effects" {...block} />
          ))}
          <Arrow d="M830 204H868" />
          <text className="flow-out" x="874" y="209">OUT</text>

          {/* Mic input */}
          <Block x={390} y={300} width={290} height={34} label="Mic in → Vocoder · VocalTune" tab="vocoder" {...block} />
          <Arrow d="M680 317H775V304" />
        </svg>
      </div>
    </details>
  );
}

export default SignalFlow;

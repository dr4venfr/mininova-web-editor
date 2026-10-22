import React from 'react';
import LockToggle from './LockToggle';
import { ControlLabel } from './ControlHelp';

const inRange = (value, range) => (value >= range[0] && value <= range[1]);

const percent = (value, [min, max]) => max > min ? ((value - min) / (max - min)) * 100 : 0;

function InputRange({ id, control, help, helpOpen, locked, onChange, onLockOff, onLockOn, onToggleHelp, readonly, value }) {
  const current = value ?? control.range[0];

  const onInputChange = event => {
    const value = Number(event.target.value);

    if (!inRange(value, control.range)) {
      return;
    }

    onChange(value);
  };

  // Double-click restores the initial value, like a knob's default position
  const onReset = () => {
    if (!readonly) {
      onChange(control.init);
    }
  };

  // Fill the track from zero, so bipolar values (e.g. -64..63) grow from the center
  const zero = Math.min(Math.max(percent(0, control.range), 0), 100);
  const position = percent(current, control.range);
  const fill = {
    '--fill-from': `${Math.min(zero, position)}%`,
    '--fill-to': `${Math.max(zero, position)}%`,
  };

  return (
    <div className="control">
      <ControlLabel id={id} control={control} help={help} helpOpen={helpOpen} onToggleHelp={onToggleHelp} />
      <input
        type="range"
        className="control-slider"
        aria-label={control.label}
        title="Double-click to reset"
        min={control.range[0]}
        max={control.range[1]}
        onChange={onInputChange}
        onDoubleClick={onReset}
        value={current}
        disabled={readonly}
        style={fill}
      />
      <input
        id={id}
        className="control-input control-number"
        aria-label={control.label}
        type="number"
        min={control.range[0]}
        max={control.range[1]}
        onChange={onInputChange}
        value={current}
        readOnly={readonly}
      />
      <LockToggle label={control.label} locked={locked} onLockOff={onLockOff} onLockOn={onLockOn} />
    </div>
  );
}

export default InputRange;

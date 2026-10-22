import React from 'react';
import LockToggle from './LockToggle';
import { ControlLabel } from './ControlHelp';

function InputEnum({ id, control, help, helpOpen, locked, onChange, onLockOff, onLockOn, onToggleHelp, value }) {
  const select = value => {
    if (!Array.from(control.enum.keys()).includes(value)) {
      return;
    }

    onChange(value);
  };

  // Two-option controls (Off/On, Single/Multi...) are switched with one click
  const isToggle = control.enum.length === 2;

  return (
    <div className="control">
      <ControlLabel id={id} control={control} help={help} helpOpen={helpOpen} onToggleHelp={onToggleHelp} />
      {isToggle ? (
        <div className="control-toggle" role="group" aria-labelledby={`${id}-label`}>
          {control.enum.map((label, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={value === index}
              onClick={() => select(index)}
            >{label}</button>
          ))}
        </div>
      ) : (
        <select id={id} aria-label={control.label} onChange={event => select(Number(event.target.value))} value={value} className="control-input control-select">
          {control.enum.map((label, value) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      )}
      <LockToggle label={control.label} locked={locked} onLockOff={onLockOff} onLockOn={onLockOn} />
    </div>
  );
}

export default InputEnum;

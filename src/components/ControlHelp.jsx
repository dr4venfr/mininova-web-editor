import React from 'react';
import { guideLink } from '../help';

// The control's name: a button that toggles its help when help exists
export function ControlLabel({ id, control, help, helpOpen, onToggleHelp }) {
  if (!help) {
    return <span id={`${id}-label`} className="control-label" title={control.label}>{control.label}</span>;
  }

  return (
    <button
      type="button"
      id={`${id}-label`}
      className="control-label control-label-help"
      title={`${control.label}: click for help`}
      aria-expanded={helpOpen}
      aria-controls={`${id}-help`}
      onClick={onToggleHelp}
    >{control.label}</button>
  );
}

const describeValues = control => {
  if (control.enum) {
    const initial = control.enum[control.init];
    return `${control.enum.length} options${initial !== undefined ? ` · Default: ${initial}` : ''}`;
  }
  if (control.range && control.range.length === 2) {
    return `Range: ${control.range[0]} to ${control.range[1]} · Default: ${control.init}`;
  }
  return null;
};

export function ControlHelp({ id, control, help, onClose }) {
  const values = describeValues(control);

  return (
    <div className="control-help" id={`${id}-help`} role="note" aria-labelledby={`${id}-label`}>
      <button type="button" className="control-help-close" aria-label="Close help" onClick={onClose}>×</button>
      {help.context && <p className="control-help-context">{help.context}</p>}
      <p>{help.text}</p>
      <p className="control-help-meta">
        {values && <span>{values}</span>}
        <a href={guideLink(help.page)} target="_blank" rel="noreferrer">User guide p. {help.page}</a>
      </p>
    </div>
  );
}

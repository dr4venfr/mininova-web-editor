import React from 'react';
import Control from './Control';
import { controls } from '../mininova';

// A titled card of controls
function ControlGroup({ title, ids, emit, children }) {
  return (
    <div>
      <h4>{title}</h4>
      {ids.map(id => (
        <Control
          key={id}
          id={id}
          control={controls[id]}
          emit={emit}
        />
      ))}
      {children}
    </div>
  );
}

export default ControlGroup;

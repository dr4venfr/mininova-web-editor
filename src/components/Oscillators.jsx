import React from 'react';
import Oscillator from './Oscillator';
import ControlGroup from './ControlGroup';

function Oscillators({ emit }) {
  return (
    <div className="rows">
      {[1, 2, 3].map(i => (
        <Oscillator
          key={i}
          emit={emit}
          number={i}
        />
      ))}
      <ControlGroup
        title="Common Oscillator parameters"
        ids={['osc-vibrato-depth', 'osc-vibrato-speed', 'osc-drift', 'osc-phase', 'osc-fixed-note']}
        emit={emit}
      />
      <ControlGroup
        title="Mixer"
        ids={['osc-1-level', 'osc-2-level', 'osc-3-level', 'ring-mod-level-1-3', 'ring-mod-level-2-3', 'noise-level', 'noise-type', 'pre-fx-level', 'post-fx-level']}
        emit={emit}
      />
    </div>
  );
}

export default Oscillators;

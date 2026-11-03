import React from 'react';
import ControlGroup from './ControlGroup';

function Voice({ emit }) {
  return (
    <div className="rows">
      <ControlGroup
        title="Voice"
        ids={['voice-polyphony-mode', 'voice-unison', 'voice-unison-detune', 'voice-keyboard-octave']}
        emit={emit}
      />
      <ControlGroup
        title="Portamento"
        ids={['voice-portamento-rate', 'voice-portamento-mode', 'voice-pre-glide']}
        emit={emit}
      />
      <ControlGroup
        title="Patch"
        ids={['patch-category', 'patch-genre']}
        emit={emit}
      />
    </div>
  );
}

export default Voice;

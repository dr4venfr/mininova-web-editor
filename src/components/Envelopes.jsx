import React from 'react';
import Envelope from './Envelope';
import ControlGroup from './ControlGroup';

function Envelopes({ emit }) {
  return (
    <div>
      <div className="rows">
        {[1,2,3,4,5,6].map(i => (
          <Envelope
            key={i}
            emit={emit}
            number={i}
          />
        ))}
        <ControlGroup title="Common" ids={['env-track-centre']} emit={emit} />
      </div>
    </div>
  );
}

export default Envelopes;

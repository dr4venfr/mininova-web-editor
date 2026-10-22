import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useSetControl } from './useSetControl';

const steps = [1, 2, 3, 4, 5, 6, 7, 8];

// The 8 arp steps shown as the synth's pads in ARPEGGIATE mode: a lit pad plays a note
function ArpSteps({ emit }) {
  const setControl = useSetControl(emit);
  const values = useSelector(state => steps.map(step => state.patch[`arp-step-${step}`]), shallowEqual);
  const length = useSelector(state => state.patch['arp-length']);
  const pattern = useSelector(state => state.patch['arp-pattern']);
  const editable = pattern === 0;

  return (
    <div className={`arp-steps${editable ? '' : ' arp-steps-inactive'}`}>
      <div className="arp-steps-header">
        <span>Steps</span>
        <span>{length} of 8 played</span>
      </div>
      <div className="arp-pads" role="group" aria-label="Arp steps">
        {steps.map((step, index) => {
          const on = values[index] === 1;
          const unused = step > length;
          return (
            <button
              key={step}
              type="button"
              className={`arp-pad${unused ? ' arp-pad-unused' : ''}`}
              aria-pressed={on}
              aria-label={`Step ${step}${unused ? ' (beyond length)' : ''}`}
              title={`Step ${step}: ${on ? 'note' : 'rest'}${unused ? ', beyond the pattern length' : ''}`}
              onClick={() => setControl(`arp-step-${step}`, on ? 0 : 1)}
            >
              <span className="arp-pad-number">{step}</span>
            </button>
          );
        })}
      </div>
      {!editable && (
        <p className="arp-steps-note">Steps and Length only apply when Pattern is set to "Ptn Edit".</p>
      )}
    </div>
  );
}

export default ArpSteps;

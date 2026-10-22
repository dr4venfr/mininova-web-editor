import React from 'react';
import Effect from './fx/Effect';
import ControlGroup from './ControlGroup';

function Effects({ emit }) {
  return (
    <>
      <div className="rows">
        <ControlGroup
          title="FX"
          ids={['fx-routing', 'fx-feedback', 'fx-1-level', 'fx-2-level', 'fx-3-level', 'fx-4-level', 'fx-5-level', 'fx-1-select', 'fx-2-select', 'fx-3-select', 'fx-4-select', 'fx-5-select']}
          emit={emit}
        />
        <ControlGroup
          title="Pan"
          ids={['fx-pan-position', 'fx-pan-rate', 'fx-pan-sync', 'fx-pan-mod-depth']}
          emit={emit}
        />
      </div>
      <div className="rows">
        {[1,2,3,4,5].map(i => (
          <Effect key={`fix-details-${i}`} slot={i} id={`fx-details-${i}`} emit={emit}/>
        ))}
      </div>
    </>
  );
}

export default Effects;

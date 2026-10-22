import React from 'react';

function LockToggle({ label, locked, onLockOff, onLockOn }) {
  return (
    <button
      type="button"
      className="control-lock"
      aria-pressed={locked}
      aria-label={`${locked ? 'Unlock' : 'Lock'} ${label}`}
      title="Lock value (kept by Randomize and Reset defaults)"
      onClick={locked ? onLockOff : onLockOn}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d={locked ? 'M5 7V5a3 3 0 0 1 6 0v2' : 'M5 7V5a3 3 0 0 1 5.6-1.5'}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect x="3" y="7" width="10" height="7.5" rx="1.5" fill="currentColor" />
      </svg>
    </button>
  );
}

export default LockToggle;

import React from 'react';
import ControlGroup from './ControlGroup';
import ArpSteps from './ArpSteps';

const arp = [
  'arp-on',
  'arp-key-latch',
  'arp-octaves',
  'arp-rate-sync',
  'arp-gate',
  'arp-mode',
  'arp-pattern',
  'arp-swing',
  'arp-length',
]
 
const vocoder = [
'vocoder-level',
'vocoder-carier-level',
'vocoder-modulator-level',
'vocoder-resonance',
'vocoder-decay',
'vocoder-gate-threshold',
'vocoder-gate-release',
'vocoder-spectrum-level-1',
'vocoder-spectrum-level-2',
'vocoder-spectrum-level-3',
'vocoder-spectrum-level-4',
'vocoder-spectrum-level-5',
'vocoder-spectrum-level-6',
'vocoder-spectrum-level-7',
'vocoder-spectrum-level-8',
'vocoder-spectrum-level-9',
'vocoder-spectrum-level-10',
'vocoder-spectrum-level-11',
'vocoder-spectrum-level-12',
'vocoder-spectrum-level-13',
'vocoder-spectrum-level-14',
'vocoder-spectrum-level-15',
'vocoder-spectrum-level-16',
'vocoder-spectrum-level-17',
'vocoder-spectrum-level-18',
'vocoder-spectrum-level-19',
'vocoder-spectrum-level-20',
'vocoder-spectrum-level-21',
'vocoder-spectrum-level-22',
'vocoder-spectrum-level-23',
'vocoder-spectrum-level-24',
'vocoder-spectrum-level-25',
'vocoder-spectrum-level-26',
'vocoder-spectrum-level-27',
'vocoder-spectrum-level-28',
'vocoder-spectrum-level-29',
'vocoder-spectrum-level-30',
'vocoder-spectrum-level-31',
'vocoder-spectrum-level-32',
'vocoder-spectrum-resample',
];

const chorder = [    
'chorder-transpose',
'chorder-on',
'chorder-count',
'chorder-key-2',
'chorder-key-3',
'chorder-key-4',
'chorder-key-5',
'chorder-key-6',
'chorder-key-7',
'chorder-key-8',
'chorder-key-9',
'chorder-key-10',
];

const vocaltune = [
'vocal-tune-shift',
'vocal-tune-bend',
'vocal-tune-mode',
'vocal-tune-insert',
'vocal-tune-scale-type',
'vocal-tune-scale-key',
'vocal-tune-correction-time',
'vocal-tune-level',
'vocal-tune-vibrato',
'vocal-tune-vibrato-mod-wheel',
'vocal-tune-vibrato-rate',
];

export function Arp({ emit }) {
  return (
    <ControlGroup title="Arp" ids={arp} emit={emit}>
      <ArpSteps emit={emit} />
    </ControlGroup>
  );
}

export function Vocoder({ emit }) {
  return (
    <div className="rows">
      <ControlGroup title="Vocoder" ids={vocoder} emit={emit} />
      <ControlGroup title="Chorder" ids={chorder} emit={emit} />
      <ControlGroup title="Vocal Tune" ids={vocaltune} emit={emit} />
    </div>
  );
}

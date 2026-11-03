// Checks every control against Novation's "MiniNova Extended CC & NRPN Map" (v0002,
// public/docs/mininova-cc-nprn-chart.pdf), transcribed in mininova.chart.json.
import chart from './mininova.chart.json';
import { controlMessage, controls, findControl } from './mininova';
import { CommandType, getCommand } from './midi.command';
import { ungroup } from './midi';

// Where the chart is wrong, checked on a MiniNova (firmware of 2026-10)
const chartErrors = {
  // MSB 1 writes another part of the patch: these live in NRPN 0/123, where the editor sends them
  'lfo-1-fade-mode': { nrpn: [0, 123], raw: { from: 0, to: 3 } },
  'lfo-2-fade-mode': { nrpn: [0, 123], raw: { from: 4, to: 7 } },
  // The chart repeats LFO 2's values for LFO 3
  'lfo-3-fade-mode': { nrpn: [0, 123], raw: { from: 8, to: 11 } },
  'vocal-tune-mode': { nrpn: [0, 123], raw: { from: 16, to: 19 } },
  'vocal-tune-insert': { nrpn: [0, 123], raw: { from: 20, to: 22 } },
  // The synth stores and plays 1 to 8 octaves, not only 1 to 4
  'arp-octaves': { nrpn: [1, 62], raw: { from: 0, to: 7 } },
  // Steps are switched with 0 and 1, as the chart's remark says (not 0 and 127)
  ...Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map(n => [`arp-step-${n}`, { nrpn: [60, 31 + n], raw: [0, 1] }])),
  // The synth ignores values above 19 (8 beats), as the guide's Sync Values Table says
  'gator-rate-sync': { nrpn: [1, 49], raw: { from: 0, to: 19 } },
  // A command rather than a setting: the editor also sends 0
  'vocoder-spectrum-resample': { nrpn: [6, 32], raw: [0, 1] },
};

const expected = chart.map(entry => ({ ...entry, ...chartErrors[entry.id] }));

const valuesOf = control => {
  if (control.enum) {
    return control.enum.map((_, index) => index);
  }
  const [min, max] = control.range;
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
};

const rawValues = raw => (Array.isArray(raw) ? raw : valuesOf({ range: [raw.from, raw.to] }));

// Address and raw value of a message, with 14-bit NRPN values combined
const parse = message => {
  const bytes = Array.from(message);
  if (bytes.length === 3) {
    return { cc: bytes[1], raw: bytes[2] };
  }
  const raw = bytes.length > 9 ? (bytes[8] << 7) | bytes[11] : bytes[8];
  return { nrpn: [bytes[2], bytes[5]], raw };
};

test('every patch parameter of the chart has a control', () => {
  expect(expected.map(({ id }) => id).filter(id => !controls[id])).toEqual([]);
});

test.each(expected)('$id is sent as in the chart', ({ id, cc, nrpn, raw }) => {
  const control = controls[id];
  const messages = valuesOf(control).map(value => parse(controlMessage(control, value)));

  expect(new Set(messages.map(message => JSON.stringify(message.cc ?? message.nrpn)))).toEqual(new Set([JSON.stringify(cc ?? nrpn)]));
  expect(messages.map(message => message.raw).sort((a, b) => a - b)).toEqual(rawValues(raw).sort((a, b) => a - b));
});

test('every control is recognised when the synth sends it back', () => {
  const failures = [];
  for (const [id, control] of Object.entries(controls)) {
    if (!control.msg) {
      continue;
    }
    for (const value of valuesOf(control)) {
      let command = { type: CommandType.None, values: [] };
      for (const part of ungroup(controlMessage(control, value))) {
        command = getCommand(part, command);
      }
      const found = findControl(command);
      if (found?.id !== id || found.value !== value) {
        failures.push(`${id}=${value} read as ${found ? `${found.id}=${found.value}` : 'nothing'}`);
      }
    }
  }
  expect(failures).toEqual([]);
});

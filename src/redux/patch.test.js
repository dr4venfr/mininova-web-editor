import { controls } from '../mininova';
import { patchDumpReceived, reducer } from './patch';

const dumpWith = bytes => {
  const data = new Uint8Array(530);
  for (const [index, value] of Object.entries(bytes)) {
    data[index] = value;
  }
  return data;
};

test('it decodes filter FreqLink and ResLink from separate bits', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 88: 0b10 })));

  expect(state['filter-freqlink']).toEqual(0);
  expect(state['filter-reslink']).toEqual(1);
});

test('it decodes the LFO 3 fade mode from the upper bits', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 225: 3 << 4 })));

  expect(state['lfo-3-fade-mode']).toEqual(3);
});

test('it centres bipolar controls on 64', () => {
  const state = reducer(undefined, patchDumpReceived(new Uint8Array(530).fill(64)));
  const bipolar = Object.keys(controls).filter(id => controls[id].range?.[0] === -64 && id in state);

  expect(bipolar.length).toBeGreaterThan(50);
  expect(bipolar.filter(id => state[id] !== 0)).toEqual([]);
});

test('it decodes the vocoder gate threshold in dB', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 332: 56 })));

  expect(state['vocoder-gate-threshold']).toEqual(-40);
});

test('it decodes the arp length apart from step 1', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 325: 32 | (7 << 1) })));

  expect(state['arp-length']).toEqual(8);
  expect(state['arp-step-1']).toEqual(1);
});

// Byte positions below were checked by changing each parameter on a MiniNova and comparing dumps
test('it decodes filter 2 in the same layout as filter 1', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 100: 10, 101: 11, 102: 12, 103: 13, 104: 64 + 14 })));

  expect(state['filter-2-frequency']).toEqual(10);
  expect(state['filter-2-track']).toEqual(11);
  expect(state['filter-2-resonance']).toEqual(12);
  expect(state['filter-2-qnormalize']).toEqual(13);
  expect(state['filter-2-env2-to-freq']).toEqual(14);
});

test('it decodes the chorder transpose and switch', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 334: 64 + 3, 335: 1 })));

  expect(state['chorder-transpose']).toEqual(3);
  expect(state['chorder-on']).toEqual(1);
});

test('it decodes the voice settings', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 34: 0, 35: 50, 36: 64 - 5, 37: 1, 38: 126, 39: 3, 40: 77 })));

  expect(state['voice-polyphony-mode']).toEqual(0);
  expect(state['voice-portamento-rate']).toEqual(50);
  expect(state['voice-pre-glide']).toEqual(-5);
  expect(state['voice-portamento-mode']).toEqual(1);
  expect(state['voice-keyboard-octave']).toEqual(-2);
  expect(state['voice-unison']).toEqual(3);
  expect(state['voice-unison-detune']).toEqual(77);
});

test('it decodes the vocoder switches from separate bits', () => {
  const state = reducer(undefined, patchDumpReceived(dumpWith({ 311: 0b10101 })));

  expect(state['vocoder-on']).toEqual(1);
  expect(state['vocoder-sibilance-type']).toEqual(0);
  expect(state['vocoder-freeze']).toEqual(1);
  expect(state['vocoder-all-max']).toEqual(0);
  expect(state['vocoder-input']).toEqual(1);
});

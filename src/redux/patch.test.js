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

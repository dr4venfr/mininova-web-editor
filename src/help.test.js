import { controls } from './mininova';
import { helpFor, tabHelp } from './help';

test('every editable control has help with a guide page', () => {
  const missing = Object.entries(controls)
    .filter(([, control]) => control.msg)
    .filter(([id]) => {
      const help = helpFor(id);
      return !help || !help.text || !(help.page > 0);
    })
    .map(([id]) => id);

  expect(missing).toEqual([]);
});

test('envelope help explains the role of the envelope', () => {
  expect(helpFor('env-1-attack').context).toMatch(/amplitude/);
  expect(helpFor('env-2-attack').context).toMatch(/filter/);
  expect(helpFor('env-4-attack').context).toMatch(/Mod Matrix/);
});

test('every tab has an introduction', () => {
  for (const id of ['oscillators', 'filters', 'envelopes', 'lfos', 'effects', 'arp', 'vocoder', 'mod-matrix', 'tweaks']) {
    expect(tabHelp[id]).toBeDefined();
  }
});

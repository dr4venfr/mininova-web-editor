import { CommandType } from './midi.command';
import { controlMessage, controls, findControl, isPatch } from './mininova';
import { cc, nrpn } from './midi';

test('it detects a patch', () => {
  const message = new Uint8Array([
    0xF0, 0x00, 0x20, 0x29, 0x03, 0x01, 0x7F, 0x00, 0x00, 0x09, 0x04,
    0x00, 0x00, 0x00, 0x2A
  ]);

  expect(isPatch(message)).toBe(true);
});

test('it can decode a simple control change', () => {
  const osc1SetToMaximumLevel = {
    type: CommandType.ControlChange,
    values: [51, 127],
  };

  const control = findControl(osc1SetToMaximumLevel);

  expect(control.id).toEqual('osc-1-level');
  expect(control.value).toEqual(127);
});

test('it can decode a control change with linear mapping', () => {
  const preFXLevelSetTo18dB = {
    type: CommandType.ControlChange,
    values: [58, 82],
  };

  const control = findControl(preFXLevelSetTo18dB);

  expect(control.id).toEqual('pre-fx-level');
  expect(control.value).toEqual(18);
});

test('it can decode a NRPN message', () => {
  const tempoSetAt40 = {
    type: CommandType.NRPN,
    values: [2, 63, 0, 40],
  };

  const control = findControl(tempoSetAt40);

  expect(control.id).toEqual('tempo');
  expect(control.value).toEqual(40);
});

test('it can decode a message that maps to different NRPN values', () => {
  const tempoSetAt250 = {
    type: CommandType.NRPN,
    values: [2, 63, 1, 122],
  };

  const control = findControl(tempoSetAt250);

  expect(control.id).toEqual('tempo');
  expect(control.value).toEqual(250);
});

test('it will not return a control when value is out of range', () => {
  const invalidTempo = {
    type: CommandType.NRPN,
    values: [2, 63, 0, 0],
  };

  const control = findControl(invalidTempo);

  expect(control).toBe(undefined);
});

test('every control has an initial value within its enum or range', () => {
  for (const [id, control] of Object.entries(controls)) {
    if (control.enum) {
      expect([id, control.init >= 0 && control.init < control.enum.length]).toEqual([id, true]);
    } else if (control.range.length > 0) {
      expect([id, control.init >= control.range[0] && control.init <= control.range[1]]).toEqual([id, true]);
    }
  }
});

test('it applies the control offset when building a message', () => {
  expect(controlMessage(controls['pre-fx-level'], 0)).toEqual(cc(58, 64));
});

test('it sends the switch value matching an enum control', () => {
  expect(controlMessage(controls['lfo-2-one-shot'], 0)).toEqual(nrpn(0, 122, 22));
  expect(controlMessage(controls['lfo-2-one-shot'], 1)).toEqual(nrpn(0, 122, 23));
});

test('it sends the LSB of the tempo when it is zero', () => {
  expect(controlMessage(controls['tempo'], 128)).toEqual(nrpn(2, 63, 1, 0));
});

test('numbered copies of a control share the same label', () => {
  const labels = {};
  for (const [id, control] of Object.entries(controls)) {
    const key = id.replace(/-\d+(?=-|$)/g, '-N');
    const label = control.label.replace(/\d+/g, 'N');
    labels[key] = [...new Set([...(labels[key] || []), label])];
  }
  const inconsistent = Object.entries(labels).filter(([, values]) => values.length > 1);

  expect(inconsistent).toEqual([]);
});

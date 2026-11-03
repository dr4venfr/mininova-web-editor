import { describe, expect, it } from 'vitest';
import { cc } from '../src/midi';
import {
  describeSection, formatPatch, formatValue, initPatch, messageFor, parseValue, sectionOf, sections, sectionSummary,
  settableIds,
} from './parameters';

describe('sections', () => {
  it('puts every settable control in a section', () => {
    expect(settableIds().filter(id => !sectionOf(id))).toEqual([]);
  });

  it('summarizes each section', () => {
    const summary = sectionSummary();
    expect(summary.map(({ section }) => section)).toEqual(sections);
    expect(summary.every(({ description, parameters }) => description && parameters > 0)).toBe(true);
  });
});

describe('describeSection', () => {
  it('describes parameters with their values and help', () => {
    const wave = describeSection('oscillators').find(({ id }) => id === 'osc-1-wave');
    expect(wave).toMatchObject({ label: 'Wave', init: 'Sawtooth' });
    expect(wave?.choices).toContain('Sine');
    expect(wave?.help).toMatch(/waveform/);
  });

  it('lists repeated choices and help only once', () => {
    const wave = describeSection('oscillators').find(({ id }) => id === 'osc-2-wave');
    expect(wave?.choices).toBe('same as osc-1-wave');
    expect(wave?.help).toBe('same as osc-1-wave');
  });
});

describe('parseValue', () => {
  it('accepts choice names in any case, or their index', () => {
    expect(parseValue('osc-1-wave', 'sine')).toEqual({ value: 0 });
    expect(parseValue('osc-1-wave', 2)).toEqual({ value: 2 });
  });

  it('rejects unknown choices', () => {
    expect(parseValue('osc-1-wave', 'Kazoo')).toHaveProperty('error');
    expect(parseValue('osc-1-wave', 999)).toHaveProperty('error');
  });

  it('checks ranges, including negative ones', () => {
    expect(parseValue('filter-1-frequency', 30)).toEqual({ value: 30 });
    expect(parseValue('pre-fx-level', -12)).toEqual({ value: -12 });
    expect(parseValue('pre-fx-level', -13)).toHaveProperty('error');
    expect(parseValue('osc-1-cents', 500)).toHaveProperty('error');
    expect(parseValue('osc-1-cents', 64.5)).toHaveProperty('error');
  });

  it('rejects unknown and read-only parameters', () => {
    expect(parseValue('bogus', 1)).toEqual({ error: 'unknown parameter "bogus"' });
    expect(parseValue('tempo', 120)).toEqual({ error: '"tempo" is read-only' });
  });
});

describe('formatting', () => {
  it('shows choices by name', () => {
    expect(formatValue('osc-1-wave', 0)).toBe('Sine');
    expect(formatValue('filter-1-frequency', 30)).toBe(30);
  });

  it('formats a section of a patch with the patch name', () => {
    const patch = { 'patch-name': 'Airhead         ', tempo: 40, 'filter-1-type': 3, 'osc-1-wave': 0 };
    const formatted = formatPatch(patch, 'filters');
    expect(formatted).toMatchObject({ 'patch-name': 'Airhead', 'filter-1-type': 'LP24' });
    expect(formatted).not.toHaveProperty('tempo');
    expect(formatted).not.toHaveProperty('osc-1-wave');
  });
});

it('builds a valid initial patch', () => {
  const patch = initPatch();
  expect(Object.keys(patch).sort()).toEqual(settableIds().sort());
  expect(Object.entries(patch).filter(([id, value]) => 'error' in parseValue(id, value))).toEqual([]);
});

it('builds the MIDI message of a control', () => {
  expect(messageFor('osc-1-wave', 0)).toEqual(cc(19, 0));
});

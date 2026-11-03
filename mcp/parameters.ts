// Describes the MiniNova parameters to an LLM and validates the values it sends back.
// Everything comes from the web editor's own definitions, so both stay in sync.
import { controls as mininovaControls, controlMessage } from '../src/mininova';
import { helpFor, tabHelp } from '../src/help';

export interface Control {
  label: string,
  range?: number[],
  enum?: string[],
  init: number | string,
  offset?: number,
  msg?: (value: number) => Uint8Array,
}

export const controls = mininovaControls as unknown as Record<string, Control>;

export type Value = number | string;
export type Patch = Record<string, Value>;

// Sections follow the web editor's tabs
const sectionPrefixes: Record<string, string[]> = {
  oscillators: ['osc-', 'noise-', 'ring-mod-', 'pre-fx-level', 'post-fx-level', 'fx-wet-level'],
  filters: ['filter-'],
  envelopes: ['env-'],
  lfos: ['lfo-'],
  effects: ['fx-', 'eq-', 'compres-', 'distort-', 'delay-', 'reverb-', 'chorus-', 'chrous-', 'gator-'],
  voice: ['voice-', 'patch-category', 'patch-genre'],
  arp: ['arp-'],
  vocoder: ['vocoder-', 'chorder-', 'vocal-tune-'],
  'mod-matrix': ['mod-'],
  tweaks: ['tweak-'],
};

export const sections = Object.keys(sectionPrefixes) as [string, ...string[]];

export const sectionOf = (id: string): string | undefined =>
  sections.find(section => sectionPrefixes[section].some(prefix => id.startsWith(prefix)));

// Only controls the synth accepts a message for can be set (not the patch name). Like in the
// web editor, the tempo is read-only: it follows the TEMPO knob or an external MIDI clock.
// Spectrum resample is a command (resample the mic), not a setting.
const notSettable = ['tempo', 'vocoder-spectrum-resample'];
export const isSettable = (id: string): boolean => !!controls[id]?.msg && !notSettable.includes(id);

export const settableIds = (section?: string): string[] =>
  Object.keys(controls).filter(id => isSettable(id) && (!section || sectionOf(id) === section));

export const sectionSummary = () => sections.map(section => ({
  section,
  description: tabHelp[section as keyof typeof tabHelp][1],
  parameters: settableIds(section).length,
}));

// The enum is the source of truth: some enum controls also declare a raw 0-127 range
const describeValues = (control: Control): Pick<ParameterDescription, 'range' | 'choices'> => control.enum
  ? { choices: control.enum }
  : { range: control.range };

export interface ParameterDescription {
  id: string,
  label: string,
  range?: number[],
  choices?: string[] | string,
  init: Value,
  help?: string,
}

export const describeSection = (section: string): ParameterDescription[] => {
  // Numbered controls (oscillators, envelopes, mod slots…) repeat the same choices and help:
  // give them once and point to the first control that has them
  const firstWith = new Map<string, string>();
  const once = (id: string, value: string) => {
    const firstId = firstWith.get(value);
    if (firstId) {
      return `same as ${firstId}`;
    }
    firstWith.set(value, id);
    return undefined;
  };

  return settableIds(section).map(id => {
    const control = controls[id];
    const values = describeValues(control);
    if (control.enum) {
      values.choices = once(id, JSON.stringify(control.enum)) ?? control.enum;
    }
    // The role of each envelope (help context) is given by the section summary instead
    const help = helpFor(id)?.text;
    return {
      id,
      label: control.label,
      ...values,
      init: formatValue(id, control.init),
      ...(help && { help: once(id, help) ?? help }),
    };
  });
};

// Enum values are shown by name, which is what an LLM reasons about
export const formatValue = (id: string, value: Value): Value => {
  const choices = controls[id]?.enum;
  if (choices && typeof value === 'number' && choices[value] !== undefined) {
    return choices[value];
  }
  return value;
};

// The tempo is left out: patch dumps don't include it
export const formatPatch = (patch: Patch, section?: string): Patch => {
  const formatted: Patch = { 'patch-name': String(patch['patch-name']).trim() };
  for (const id of settableIds(section)) {
    formatted[id] = formatValue(id, patch[id]);
  }
  return formatted;
};

// Turns a value sent by the LLM into the value the synth expects, or explains why it can't
export const parseValue = (id: string, value: Value): { value: number } | { error: string } => {
  const control = controls[id];
  if (!control) {
    return { error: `unknown parameter "${id}"` };
  }
  if (!isSettable(id)) {
    return { error: `"${id}" is read-only` };
  }

  if (control.enum) {
    const choices = control.enum;
    if (typeof value === 'string') {
      const index = choices.findIndex(choice => choice.toLowerCase() === value.trim().toLowerCase());
      if (index === -1) {
        return { error: `"${value}" is not a choice of ${id} (use list_parameters to see them)` };
      }
      return { value: index };
    }
    if (Number.isInteger(value) && value >= 0 && value < choices.length) {
      return { value };
    }
    return { error: `${id} expects one of its choices, or an index from 0 to ${choices.length - 1}` };
  }

  const number = typeof value === 'string' ? Number(value) : value;
  const [min, max] = control.range ?? [0, 127];
  if (!Number.isInteger(number) || number < min || number > max) {
    return { error: `${id} expects an integer from ${min} to ${max}` };
  }
  return { value: number };
};

// The editor's initial values are mostly zero, which is silent (amp envelope without sustain).
// On top of them, these make a plain, audible starting point: one sawtooth through an open filter.
export const initOverrides: Patch = {
  'osc-2-level': 0,
  'osc-3-level': 0,
  'filter-routing': 'Single',
  'filter-1-type': 'LP24',
  'filter-1-frequency': 127,
  'env-1-sustain': 127,
  'env-1-release': 20,
};

export const initPatch = (): Patch => {
  const patch: Patch = {};
  for (const id of settableIds()) {
    patch[id] = controls[id].init;
  }
  return { ...patch, ...initOverrides };
};

export const messageFor = (id: string, value: number): Uint8Array => controlMessage(controls[id], value);

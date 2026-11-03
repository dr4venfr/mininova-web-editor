// MCP server letting an LLM design sounds on the MiniNova from a description
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  describeSection, formatPatch, formatValue, initPatch, messageFor, parseValue, sectionSummary, sections, Value,
} from './parameters';
import { Synth } from './synth';

// stdout carries the MCP protocol: send logs (including the shared code's) to stderr
console.log = console.error;

const instructions = `Controls a Novation MiniNova synthesizer over MIDI, to build the sound the user describes.

Workflow:
1. Call get_patch to start from the current sound, or init_patch for a blank one (a single sawtooth through an open low-pass filter, no modulation, no effects).
2. Call list_parameters for each section you use: parameter ids, ranges, choices and what each one does, from the MiniNova user guide.
3. Apply your changes with set_parameters, several at once.
4. You can't hear the result: ask the user to play it and describe what to change, then iterate.

Signal path: 3 oscillators + noise + 2 ring modulators (Osc 1×3, Osc 2×3) -> mixer -> 2 filters, each with its own drive, connected by filter-routing (Single, Series, Parallel…) -> amplifier (Envelope 1) -> FX section (5 slots, connected by fx-routing) -> output.
- Envelope 1 shapes the volume, Envelope 2 the filters (through filter-N-env2-to-freq).
- LFOs 1-3 and envelopes 3-6 only act once routed in the mod-matrix (20 slots: source × source -> destination, with a depth).
- Several sources in the mixer clip internally: keep levels around 64 each when mixing three or more.
- Values are 0-127 unless stated. For bipolar ones 64 is the centre (osc semitones 64 = in tune, 76 = +1 octave, 71 = +7 semitones; cents 64 = in tune).

Useful calibrations: attack 64 ≈ 250 ms and 127 > 20 s; release 64 ≈ 360 ms; portamento 115 ≈ 1 s; envelope delay 60-70 ≈ 1 s; delay time up to ~700 ms; delay feedback 64 ≈ 5-6 echoes; filter track 127 = cut-off follows the keyboard 1:1.

Effects: init_patch leaves fx-routing on R1, where all five slots are in parallel. For a chain where one effect feeds the next (e.g. chorus into reverb, distortion before delay), pick a routing with slots in series, like R5 (1->2->3->4->5); fx-routing's help describes all eight. Each effect unit (Delay1, Reverb1…) can be loaded in only one slot. fx-N-level is the amount of that slot; EQ and Gator need 127, and the Gator also needs gator-on.

Design with variety. Most synths can do "oscillators -> low-pass filter -> chorus, delay, reverb"; avoid using that recipe every time, and build each sound around what is distinctive on the MiniNova:
- Virtual sync (osc-N-vsync, multiples of 16 = harmonic) swept by an LFO or envelope: tearing, vocal leads.
- Wavetables (Wtable 1-36, 9 waveforms each): sweep osc-N-pwwti with an LFO or envelope (mod destinations O1PW/Idx to O3PW/Idx) for evolving pads and digital textures. Density and density detune thicken an oscillator without using voices.
- Ring modulators with Osc 3 detuned (+5, +7, +12 or odd intervals): bells, metallic and inharmonic sounds.
- Two filters: Series (e.g. band-pass into low-pass, high-pass then low-pass), Parallel with filter-balance, Parallel 2 (osc 3 + noise to filter 1). Band-pass and high-pass types; resonance; Q normalize.
- Filter drive types: Valve and Diode for warmth, Clipper and Rectify for aggression, BitsDown and RateDown for lo-fi digital grit.
- Envelopes: AD repeats (stuttering starts), sustain rate (notes that swell or fade while held), attack and decay slopes, delayed envelopes 3-6 for changes that happen seconds into a note.
- LFOs: step sequences (Seq, Altern) and melodic patterns (depth ±30 or ±36 on pitch for chromatic notes), sample & hold, one-shot LFOs as extra envelopes, fade in/out, slew.
- Mod matrix: two sources multiply (ModWheel × LFO = wheel-controlled modulation); velocity and keyboard as sources for expressive playing; modulating LFO rates or envelope decays.
- Voice: Mono modes with portamento, pre-glide (every note slides from up to an octave away), unison for width.
- Effects: Gator (32-step rhythmic gate, stereo modes), distortion, compressor, EQ, phaser (chorus type Phaser), FX feedback in series routings, auto-pan.
- Arpeggiator patterns and modes, and the vocoder in AllMax mode (no mic needed) as a resonant multi-band filter bank.

Changes go to the synth's edit buffer: they are lost when another patch is selected, unless the user saves the patch on the synth. Mention this once the user is happy with the sound.`;

const text = (value: unknown) => ({
  content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 1) }],
});

const synth = new Synth(process.env.MININOVA_MIDI_PORT || 'mininova');

// MIDI exchanges must not interleave: run tool calls one after the other
let queue: Promise<unknown> = Promise.resolve();
const serialized = <T>(task: () => Promise<T>): Promise<T> => {
  const result = queue.then(task);
  queue = result.catch(() => undefined);
  return result;
};

const errorText = (error: unknown) => ({
  ...text(error instanceof Error ? error.message : String(error)),
  isError: true,
});

const sectionSchema = z.enum(sections);

const server = new McpServer({ name: 'mininova', version: '0.1.0' }, { instructions });

server.registerTool('list_parameters', {
  title: 'List synth parameters',
  description: 'Without a section, lists the sections of the synth. With a section, lists its parameters: '
    + 'id, label, allowed values (range or choices), initial value and what it does to the sound.',
  inputSchema: { section: sectionSchema.optional() },
  annotations: { readOnlyHint: true },
}, async ({ section }) => text(section
  // One parameter per line keeps long sections compact
  ? `[\n${describeSection(section).map(parameter => JSON.stringify(parameter)).join(',\n')}\n]`
  : sectionSummary()));

server.registerTool('get_patch', {
  title: 'Read the current patch',
  description: 'Reads the current sound from the synth and returns its parameter values '
    + '(choices are given by name). Pass a section to only get that part of the patch.',
  inputSchema: { section: sectionSchema.optional() },
  annotations: { readOnlyHint: true },
}, ({ section }) => serialized(async () => text(formatPatch(await synth.readPatch(), section))).catch(errorText));

server.registerTool('set_parameters', {
  title: 'Set synth parameters',
  description: 'Sets parameters on the synth, which plays the new sound right away. '
    + 'Values are integers within the parameter\'s range, or for choices either the choice name or its index. '
    + 'Valid values are applied even when others are rejected.',
  inputSchema: {
    values: z.record(z.string(), z.union([z.number(), z.string()]))
      .describe('Parameter ids and their new values, e.g. {"osc-1-wave": "Sawtooth", "filter-1-frequency": 40}'),
  },
}, ({ values }) => serialized(async () => {
  const changes: [string, number, Uint8Array][] = [];
  const applied: Record<string, Value> = {};
  const errors: string[] = [];
  for (const [id, value] of Object.entries(values)) {
    const parsed = parseValue(id, value);
    if ('error' in parsed) {
      errors.push(parsed.error);
      continue;
    }
    changes.push([id, parsed.value, messageFor(id, parsed.value)]);
    applied[id] = formatValue(id, parsed.value);
  }
  if (changes.length) {
    await synth.send(changes);
  }
  return { ...text({ applied, ...(errors.length && { errors }) }), isError: changes.length === 0 };
}).catch(errorText));

server.registerTool('init_patch', {
  title: 'Reset to an initial patch',
  description: 'Resets every parameter to a plain starting point: a single sawtooth through an open low-pass filter, '
    + 'organ-like amp envelope, no modulation and no effects. Use it to design a sound from scratch.',
  annotations: { destructiveHint: true },
}, () => serialized(async () => {
  const changes = Object.entries(initPatch()).map(([id, value]) => {
    const parsed = parseValue(id, value) as { value: number };
    return [id, parsed.value, messageFor(id, parsed.value)] as [string, number, Uint8Array];
  });
  await synth.send(changes);
  return text(`Reset ${changes.length} parameters.`);
}).catch(errorText));

await server.connect(new StdioServerTransport());

const shutdown = () => {
  synth.disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.stdin.on('close', shutdown);

// MIDI connection to the MiniNova, from Node.js instead of the browser's Web MIDI API
import midi from '@julusian/midi';
import { Command, CommandType, getCommand } from '../src/midi.command';
import { ungroup } from '../src/midi';
import { findControl, isPatch, loadPatch, selectPatch } from '../src/mininova';
import { reducer, patchControlChanged, patchDumpReceived } from '../src/redux/patch';
import { Patch } from './parameters';

// The web editor's reducer decodes patch dumps and applies control changes
const updatePatch = reducer as unknown as (state: Patch | undefined, action: object) => Patch;

const PATCH_TIMEOUT = 6000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const findPort = (names: string[], pattern: string) =>
  names.findIndex(name => name.toLowerCase().includes(pattern.toLowerCase()));

export class Synth {
  private input: midi.Input | null = null;
  private output: midi.Output | null = null;
  private portName = '';
  private previousCommand: Command = { type: CommandType.None, values: [] };
  private patchListeners: ((data: number[]) => void)[] = [];
  // Mirrors the synth's edit buffer, kept up to date by patch dumps, knob moves and our own changes
  patch: Patch = updatePatch(undefined, { type: 'INIT' });

  constructor(private readonly portPattern: string) {}

  private connected() {
    return this.output !== null && midi.Output.getPortNames().includes(this.portName);
  }

  private connect() {
    this.disconnect();
    const outputs = midi.Output.getPortNames();
    const inputs = midi.Input.getPortNames();
    const outputIndex = findPort(outputs, this.portPattern);
    const inputIndex = findPort(inputs, this.portPattern);
    if (outputIndex === -1 || inputIndex === -1) {
      throw new Error(
        `No MIDI port matching "${this.portPattern}". Is the MiniNova plugged in and powered on? `
        + `Available outputs: ${outputs.join(', ') || 'none'}. `
        + 'Set MININOVA_MIDI_PORT to part of the right port name if needed.'
      );
    }

    this.output = new midi.Output();
    this.output.openPort(outputIndex);
    this.portName = outputs[outputIndex];

    this.input = new midi.Input();
    // Receive sysex (patch dumps), ignore clock and active sensing
    this.input.ignoreTypes(false, true, true);
    this.input.on('message', (_deltaTime, message) => this.onMessage(message));
    this.input.openPort(inputIndex);
  }

  disconnect() {
    this.input?.closePort();
    this.output?.closePort();
    this.input = null;
    this.output = null;
  }

  private onMessage(message: number[]) {
    const command = getCommand(new Uint8Array(message), this.previousCommand);
    this.previousCommand = command;

    if (command.type === CommandType.SysEx && isPatch(message)) {
      this.patch = updatePatch(this.patch, patchDumpReceived(message));
      this.patchListeners.forEach(listener => listener(message));
      this.patchListeners = [];
    } else if (command.type === CommandType.ControlChange || command.type === CommandType.NRPN) {
      // A knob turned on the synth
      const control = findControl(command);
      if (control) {
        this.patch = updatePatch(this.patch, patchControlChanged(control.id, control.value));
      }
    }
  }

  private emit(message: Uint8Array) {
    // RtMidi sends a single MIDI event per call: split NRPNs into their CC messages
    for (const part of ungroup(message)) {
      this.output!.sendMessage(Array.from(part));
    }
  }

  private waitForPatch(request: () => void) {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.patchListeners = this.patchListeners.filter(listener => listener !== onPatch);
        reject(new Error('The MiniNova did not send its patch. Check the MIDI connection and try again.'));
      }, PATCH_TIMEOUT);
      const onPatch = () => {
        clearTimeout(timeout);
        resolve();
      };
      this.patchListeners.push(onPatch);
      request();
    });
  }

  // Reads the edit buffer from the synth. The first time, runs the same handshake as the web editor.
  async readPatch(): Promise<Patch> {
    if (this.connected()) {
      await this.waitForPatch(() => this.emit(loadPatch));
    } else {
      this.connect();
      await this.waitForPatch(() => selectPatch((message: Uint8Array) => this.emit(message)));
    }
    return this.patch;
  }

  async send(changes: [id: string, value: number, message: Uint8Array][]) {
    if (!this.connected()) {
      await this.readPatch();
    }
    for (const [id, value, message] of changes) {
      this.emit(message);
      this.patch = updatePatch(this.patch, patchControlChanged(id, value));
      // Don't flood the synth when sending a whole patch
      await sleep(2);
    }
  }
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controls, DeviceSetup, Intro } from './components';
import { Command, CommandType, getCommand } from './midi.command';
import { findControl, isPatch, loadPatch, selectPatch } from './mininova';
import { debugMidiMessage, noDevice } from './debug';
import { DeviceInput, DeviceOutput, MidiMessage } from './ports';
import { patchControlChanged, patchDumpReceived } from './redux/patch';

interface RootState {
  device: {
    input: DeviceInput,
    output: DeviceOutput,
  }
}

function App() {
  const input = useSelector((state: RootState) => state.device.input);
  const output = useSelector((state: RootState) => state.device.output);
  const [currentPatch, setCurrentPatch] = useState<number | undefined>(undefined);
  const [debug, setDebug] = useState<boolean>(false);
  const previousCommandRef = useRef<Command>({ type: CommandType.None, values: [] });
  const dispatch = useDispatch();
  const connected = output.id !== noDevice.id;

  const onIncomingMidiMessage = useCallback((message: MidiMessage) => {
    const decodePatch = (data: Uint8Array) => {
      if (debug) {
        console.log('Received patch.');
      }
      dispatch(patchDumpReceived(data));
    };

    if (debug) {
      debugMidiMessage(message, 'Input: ');
    }

    const command = getCommand(message, previousCommandRef.current);
    previousCommandRef.current = command;

    switch (command.type) {
      case CommandType.ProgramChange:
        setCurrentPatch(command.values[0]);
        break;
      case CommandType.NRPN:
      case CommandType.ControlChange:
        const control = findControl(command);
        if (control) {
          dispatch(patchControlChanged(control.id, control.value));
        }
        break;
      case CommandType.SysEx:
        if (isPatch(message)) {
          decodePatch(message);
        }
        break;
    }
  }, [debug, dispatch]);

  const send = useCallback((device: DeviceOutput | null, message: Uint8Array) => {
    if (debug) {
      debugMidiMessage(message, 'Output: ');
    }
    if (!device) {
      return;
    }
    device.send(message);
  }, [debug]);

  const emit = useCallback((message: Uint8Array) => send(output, message), [output, send]);

  // The newly selected device is passed explicitly: `output` from this render
  // still refers to the previous device until the store update re-renders App
  const onChangeOutput = (device: DeviceOutput) => selectPatch((message: Uint8Array) => send(device, message));

  // Update the MIDI input listener when debug state changes
  useEffect(() => {
    if (input) {
      input.setIncomingMidiMessageListener(onIncomingMidiMessage);
    }
  }, [input, debug, onIncomingMidiMessage]);

  useEffect(() => {
    emit(loadPatch);
  }, [currentPatch, emit]);

  return (
    <div className="app">
      <header className="app-header">
        <Intro />
        <div className="setup">
          <span className={`status ${connected ? 'status-on' : ''}`}>
            {connected ? output.name || 'Connected' : 'No device'}
          </span>
          <DeviceSetup
            onChangeOutput={onChangeOutput}
            onIncomingMidiMessage={onIncomingMidiMessage}
            input={input}
            output={output}
          />
          <label className="debug">
            <input type="checkbox" checked={debug} onChange={() => setDebug(!debug)} />
            Debug
          </label>
        </div>
      </header>
      <Controls
        currentPatch={currentPatch}
        emit={emit}
      />
      <footer className="app-footer">
        <a href="https://github.com/nclavaud/mininova-web-editor/">Contribute on GitHub</a>
        <span>Last update: {__BUILD_DATE__}</span>
      </footer>
    </div>
  );
}

export default App;

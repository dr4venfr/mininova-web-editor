import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cc, nrpn } from '../midi';
import { controlMessage, controls, loadPatch } from '../mininova';
import Oscillators from './Oscillators';
import Filters from './Filters';
import Envelopes from './Envelopes';
import Lfos from './Lfos';
import Effects from './Effects';
import { Arp, Vocoder } from './ArpVocoder';
import Modmatrix from './Modmatrix';
import Tweaks from './Tweaks';
import Control from './Control';
import ControlGroup from './ControlGroup';
import SignalFlow from './SignalFlow';
import { guideLink, tabHelp } from '../help';
import { patchControlChanged, patchControlLockOn } from '../redux/patch';

const randomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

// Tabs follow the signal path, then the performance and modulation pages
const tabs = [
  ['oscillators', 'Oscillators'],
  ['filters', 'Filters'],
  ['envelopes', 'Envelopes'],
  ['lfos', 'LFOs'],
  ['effects', 'Effects'],
  ['arp', 'Arp'],
  ['vocoder', 'Vocoder'],
  ['mod-matrix', 'Mod Matrix'],
  ['tweaks', 'Tweaks'],
];
const tabIds = tabs.map(([id]) => id);

// The active tab is kept in the URL hash, so a reload stays on the same page
const initialTab = () => {
  const hash = window.location.hash.slice(1);
  return tabIds.includes(hash) ? hash : tabIds[0];
};

function Controls({ currentPatch, emit }) {
  const dispatch = useDispatch();

  const locks = useSelector(state => state.patch.locks);
  const patchName = useSelector(state => state.patch['patch-name']);
  const [activeTab, setActiveTab] = useState(initialTab);
  const panelRef = useRef(null);
  // Controls without a MIDI message (e.g. patch name) cannot be sent to the device
  const shouldBeControlled = (controlId, control) => !(locks.includes(controlId)) && !!control.msg;

  const changeOctave = () => emit(cc(13, 0));
  const activateArp = () => emit(nrpn(0, 122, 47));
  const deactivateArp = () => emit(nrpn(0, 122, 46));
  const selectPrevPatch = () => emit(nrpn(63, 0, 0));
  const selectNextPatch = () => emit(nrpn(63, 0, 2));

  const selectTab = id => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  // Left/right arrows move between tabs (WAI-ARIA tabs pattern)
  const onTabKeyDown = event => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) {
      return;
    }
    const id = tabIds[(tabIds.indexOf(activeTab) + step + tabIds.length) % tabIds.length];
    selectTab(id);
    document.getElementById(`tab-${id}`).focus();
  };

  // When switching tabs while scrolled down, show the new page from its top
  useEffect(() => {
    const panel = panelRef.current;
    if (panel && panel.getBoundingClientRect().top < 0) {
      panel.scrollIntoView();
    }
  }, [activeTab]);

  // On narrow screens the tab bar scrolls: keep the active tab centered in it
  useEffect(() => {
    const tab = document.getElementById(`tab-${activeTab}`);
    const list = tab.parentElement;
    const tabRect = tab.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    list.scrollLeft += tabRect.left - listRect.left - (listRect.width - tabRect.width) / 2;
  }, [activeTab]);

  const panels = {
    oscillators: () => <Oscillators emit={emit} />,
    filters: () => <Filters emit={emit} />,
    envelopes: () => <Envelopes emit={emit} />,
    lfos: () => <Lfos emit={emit} />,
    effects: () => <Effects emit={emit} />,
    arp: () => (
      <div className="rows">
        <ControlGroup title="Performance" ids={[]} emit={emit}>
          <Control
            id="tempo"
            control={controls['tempo']}
            emit={emit}
            readonly
          />
          <div className="button-group mt-1">
            <button onClick={changeOctave} title="Shift the keyboard octave on the synth">Change octave</button>
            <button onClick={activateArp} title="Start the arpeggiator">Arp ON</button>
            <button onClick={deactivateArp} title="Stop the arpeggiator">Arp OFF</button>
          </div>
        </ControlGroup>
        <Arp emit={emit} />
      </div>
    ),
    vocoder: () => <Vocoder emit={emit} />,
    'mod-matrix': () => <Modmatrix emit={emit} />,
    tweaks: () => <Tweaks emit={emit} />,
  };

  const resetDefaults = () => {
    for (let [controlId, control] of Object.entries(controls)) {
      if (!shouldBeControlled(controlId, control)) {
        continue;
      }
      const value = control.init;
      emit(controlMessage(control, value));
      dispatch(patchControlChanged(controlId, value));
    }
  };

  const lockAll = () => {
    for (let [controlId, control] of Object.entries(controls)) {
      if (!shouldBeControlled(controlId, control)) {
        continue;
      }
      try {
        dispatch(patchControlLockOn(controlId));
      } catch (error) {
        console.log('Could not lock control "' + controlId +'"');
        console.log(error);
      }
    }
  };

  const randomize = () => {
    for (let [controlId, control] of Object.entries(controls)) {
      if (!shouldBeControlled(controlId, control)) {
        continue;
      }
      // The enum is the source of truth: some enum controls also declare a raw 0-127 range
      const value = control.enum ? randomInt(0, control.enum.length - 1) : randomInt(...control.range);
      try {
        emit(controlMessage(control, value));
        dispatch(patchControlChanged(controlId, value));
      } catch (error) {
        console.log('Could not randomize control "' + controlId +'"');
        console.log(error);
      }
    }
  };

  return (
    <main>
      <SignalFlow activeTab={activeTab} onSelect={selectTab} />

      <div className="toolbar">
        <div className="lcd" aria-live="polite">
          <span className="lcd-patch">{currentPatch ?? '---'}</span>
          <span className="lcd-name">{patchName.split('\0')[0].trim() || 'NO PATCH'}</span>
        </div>
        <div className="button-group">
          <button onClick={selectPrevPatch} title="Select the previous patch on the synth">Prev</button>
          <button onClick={selectNextPatch} title="Select the next patch on the synth">Next</button>
          <button onClick={() => emit(loadPatch)} title="Read the current patch from the synth into the editor">Load patch</button>
        </div>
        <div className="button-group">
          <button onClick={lockAll} title="Lock every control, so Randomize and Reset defaults leave them unchanged">Lock all</button>
          <button className="button-primary" onClick={randomize} title="Set every unlocked control to a random value">Randomize</button>
          <button onClick={resetDefaults} title="Set every unlocked control back to its initial value">Reset defaults</button>
        </div>
        <div className="tabs" role="tablist" aria-label="Settings" onKeyDown={onTabKeyDown}>
          {tabs.map(([id, title]) => (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={id === activeTab}
              aria-controls={`panel-${id}`}
              tabIndex={id === activeTab ? 0 : -1}
              onClick={() => selectTab(id)}
            >{title}</button>
          ))}
        </div>
      </div>

      <section
        ref={panelRef}
        id={`panel-${activeTab}`}
        className="tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        <p className="tab-intro">
          {tabHelp[activeTab][1]}{' '}
          <a href={guideLink(tabHelp[activeTab][0])} target="_blank" rel="noreferrer">User guide p. {tabHelp[activeTab][0]}</a>
        </p>
        {panels[activeTab]()}
      </section>
    </main>
  );
}

export default Controls;

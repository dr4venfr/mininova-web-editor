import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { patchControlChanged, patchControlLockOff, patchControlLockOn } from '../redux/patch';
import { CommandType } from '../midi.command';
import { controlMessage } from '../mininova';
import { helpFor } from '../help';
import { ControlHelp } from './ControlHelp';
import InputEnum from './InputEnum';
import InputRange from './InputRange';
import InputText from './InputText';

function Control(props) {
  const { control, emit, id } = props;

  const value = useSelector(state => state.patch[id]);
  const locked = useSelector(state => state.patch.locks.includes(id));
  const dispatch = useDispatch();
  const [helpOpen, setHelpOpen] = useState(false);
  const help = helpFor(id);

  const onChange = value => {
    dispatch(patchControlChanged(id, value));
    emit(controlMessage(control, value));
  };

  const onLockOff = () => {
    dispatch(patchControlLockOff(id));
  };

  const onLockOn = () => {
    dispatch(patchControlLockOn(id));
  };

  let Component = control.hasOwnProperty('enum') ? InputEnum : InputRange;
  if (control.type === CommandType.None) {
      Component = InputText
  }

  return (
    <>
      <Component
        {...props}
        id={id}
        onChange={onChange}
        onLockOff={onLockOff}
        onLockOn={onLockOn}
        value={value}
        locked={locked}
        help={help}
        helpOpen={helpOpen}
        onToggleHelp={() => setHelpOpen(!helpOpen)}
      />
      {help && helpOpen && (
        <ControlHelp id={id} control={control} help={help} onClose={() => setHelpOpen(false)} />
      )}
    </>
  );
}

export default Control;

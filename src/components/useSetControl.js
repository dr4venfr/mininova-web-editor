import { useDispatch } from 'react-redux';
import { controlMessage, controls } from '../mininova';
import { patchControlChanged } from '../redux/patch';

// Set a control from a custom widget: update the editor and send it to the synth
export const useSetControl = emit => {
  const dispatch = useDispatch();

  return (id, value) => {
    dispatch(patchControlChanged(id, value));
    emit(controlMessage(controls[id], value));
  };
};

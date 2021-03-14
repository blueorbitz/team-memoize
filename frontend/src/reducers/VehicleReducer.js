import { ActionTypes } from '../const';

const initialState = {
  vehicle_id: null,
  from: '',
  plate_number: '',
  chasis_sn: '',
  manufacture_date: null,
  ownership_date: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_PLATE:
      return Object.assign({}, state, {
        from: typeof action.from === 'undefined' ? state.from : action.from,
        plate_number: action.plate_number || initialState.plate_number,
      });
    case ActionTypes.UPD_VEHICLE:
      return Object.assign({}, state, {
        from: typeof action.from === 'undefined' ? state.from : action.from,
        id: action.vehicle_id || initialState.vehicle_id,
        chasis_sn: action.chasis_sn || initialState.chasis_sn,
        manufacture_date: action.manufacture_date || initialState.manufacture_date,
        ownership_date: action.ownership_date || initialState.ownership_date,
      });
    case ActionTypes.DEL_PLATE:
      return Object.assign({}, state, {
        from: typeof action.from === 'undefined' ? state.from : action.from,
        plate_number: action.plate_number || initialState.plate_number,
      });
    default:
      return state;
  }
}
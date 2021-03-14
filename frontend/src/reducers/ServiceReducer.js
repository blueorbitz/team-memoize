import { ActionTypes } from '../const';

const initialState = {
  service_id: null,
  vehicle_id: null,
  service_date: null,
  memo: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_SERVICE:
      return Object.assign({}, state, {
        vehicle_id: action.vehicle_id || initialState.vehicle_id,
        service_date: action.service_date || initialState.service_date,
        memo: action.memo || initialState.memo,
      });
    case ActionTypes.DEL_SERVICE:
      return Object.assign({}, state, {
        id: action.service_id || initialState.service_id
      });
    default:
      return state;
  }
}
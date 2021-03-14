import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import VehicleReducer from './VehicleReducer';
import ServiceReducer from './ServiceReducer';

export default combineReducers({
  user: UserReducer,
  vehicle: VehicleReducer,
  service: ServiceReducer,
});

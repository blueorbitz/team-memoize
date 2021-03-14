import { ActionTypes } from '../const';

class UserAction {

  static setUser({ from }) {
    return {
      type: ActionTypes.SET_USER,
      from,
    };
  }

  static add_plate({ from, plate_number }) {
    return {
      type: ActionTypes.ADD_PLATE,
      from,
      plate_number,
    };
  }

  static delete_plate({ from, plate_number }) {
    return {
      type: ActionTypes.DEL_PLATE,
      from,
      plate_number,
    };
  }

  static update_vehicle({ from, id, chasis_sn, manufacture_date, ownership_date }) {
    return {
      type: ActionTypes.UPD_VEHICLE,
      from,
      id,
      chasis_sn,
      manufacture_date,
      ownership_date,
    };
  }

  static add_service({ from, vehicle_id, service_date, memo }) {
    return {
      type: ActionTypes.ADD_SERVICE,
      from,
      vehicle_id,
      service_date,
      memo,
    };
  }

  static delete_service({ from, service_id }) {
    return {
      type: ActionTypes.DEL_SERVICE,
      from,
      id: service_id,
    };
  }

}

export default UserAction;

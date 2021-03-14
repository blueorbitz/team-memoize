import { ActionTypes } from '../const';

const initialState = {
  from: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_USER: {
      return Object.assign({}, state, {
        from: action.from || initialState.from,
      });
    }
    default:
      return state;
  }
}

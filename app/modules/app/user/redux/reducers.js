import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const newUser = {
  firstName: '',
  lastName: '',
  email: '',
};

const initalState = fromJS({
  users: {
    list: [],
    loading: false,
  },
  user: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
});

function userReducer(state = initalState, action) {
  switch (action.type) {
    case CONSTANTS.LOAD_NEW_USER:
      return state.set(
        'user',
        fromJS({
          data: newUser,
          id: 'new',
          error: [],
          loading: false,
        }),
      );
    case CONSTANTS.USER_LIST_REQUEST:
      return state.setIn(['users', 'loading'], true);
    case CONSTANTS.USER_LIST_SUCCESS:
      return state
        .setIn(['users', 'list'], fromJS(action.data))
        .setIn(['users', 'loading'], false);
    case CONSTANTS.USER_LIST_ERROR:
      return state.setIn(['users', 'loading'], false);
    case CONSTANTS.USER_DELETE_REQUEST:
      return state
        .setIn(['users', 'loading'], true)
        .setIn(['user', 'loading'], true);
    case CONSTANTS.USER_DELETE_SUCCESS: {
      const userList = state.getIn(['users', 'list']);
      const filteredList = userList.filter(
        user => user.get('_id') !== action.id,
      );
      return state
        .setIn(['users', 'list'], fromJS(filteredList))
        .setIn(['users', 'loading'], false)
        .setIn(['user', 'loading'], false);
    }
    case CONSTANTS.USER_DELETE_ERROR:
      return state
        .setIn(['users', 'loading'], false)
        .setIn(['user', 'loading'], false);
    case CONSTANTS.USER_LOAD_REQUEST:
      return state.setIn(['user', 'loading'], true);
    case CONSTANTS.USER_LOAD_SUCCESS:
      return state
        .setIn(['user', 'data'], fromJS(action.data))
        .setIn(['user', 'id'], action.data._id)
        .setIn(['user', 'loading'], false);
    case CONSTANTS.USER_LOAD_ERROR:
      return state.setIn(['user', 'loading'], false);
    case CONSTANTS.USER_SAVE_REQUEST:
      return state
        .setIn(['user', 'loading'], true)
        .setIn(['user', 'error'], fromJS([]));
    case CONSTANTS.USER_SAVE_SUCCESS:
      return state
        .setIn(['user', 'id'], action.data._id)
        .setIn(['user', 'data', 'id'], action.data._id)
        .setIn(['user', 'loading'], false);
    case CONSTANTS.USER_SAVE_ERROR:
      return state
        .setIn(['user', 'loading'], false)
        .setIn(['user', 'error'], fromJS(action.data.error));
    case CONSTANTS.UPDATE_USER_FIELD:
      return state.setIn(['user', 'data', action.field], action.value);
    default:
  }

  return state;
}

export default userReducer;

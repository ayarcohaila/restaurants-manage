import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const newRestaurant = {
  date: new Date(),
};

const initalState = fromJS({
  restaurants: {
    list: [],
    loading: false,
  },
  restaurant: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
});

function restaurantReducer(state = initalState, action) {
  switch (action.type) {
    case CONSTANTS.LOAD_NEW_RESTAURANT:
      return state.set(
        'restaurant',
        fromJS({
          data: newRestaurant,
          id: 'new',
          error: [],
          loading: false,
        }),
      );
    case CONSTANTS.RESTAURANT_LIST_REQUEST:
      return state.setIn(['restaurants', 'loading'], true);
    case CONSTANTS.RESTAURANT_LIST_SUCCESS:
      return state
        .setIn(['restaurants', 'list'], fromJS(action.data))
        .setIn(['restaurants', 'loading'], false);
    case CONSTANTS.RESTAURANT_LIST_ERROR:
      return state.setIn(['restaurants', 'loading'], false);
    case CONSTANTS.RESTAURANT_DELETE_REQUEST:
      return state
        .setIn(['restaurants', 'loading'], true)
        .setIn(['restaurant', 'loading'], true);
    case CONSTANTS.RESTAURANT_DELETE_SUCCESS: {
      const restaurantList = state.getIn(['restaurants', 'list']);
      const filteredList = restaurantList.filter(
        restaurant => restaurant.get('_id') !== action.id,
      );
      return state
        .setIn(['restaurants', 'list'], fromJS(filteredList))
        .setIn(['restaurants', 'loading'], false)
        .setIn(['restaurant', 'loading'], false);
    }
    case CONSTANTS.RESTAURANT_DELETE_ERROR:
      return state
        .setIn(['restaurants', 'loading'], false)
        .setIn(['restaurant', 'loading'], false);
    case CONSTANTS.RESTAURANT_LOAD_REQUEST:
      return state.setIn(['restaurant', 'loading'], true);
    case CONSTANTS.RESTAURANT_LOAD_SUCCESS:
      return state
        .setIn(['restaurant', 'data'], fromJS(action.data))
        .setIn(['restaurant', 'id'], action.data._id)
        .setIn(['restaurant', 'loading'], false);
    case CONSTANTS.RESTAURANT_LOAD_ERROR:
      return state.setIn(['restaurant', 'loading'], false);
    case CONSTANTS.RESTAURANT_SAVE_REQUEST:
      return state
        .setIn(['restaurant', 'loading'], true)
        .setIn(['restaurant', 'error'], fromJS([]));
    case CONSTANTS.RESTAURANT_SAVE_SUCCESS:
      return state
        .setIn(['restaurant', 'id'], action.data._id)
        .setIn(['restaurant', 'data', 'id'], action.data._id)
        .setIn(['restaurant', 'loading'], false);
    case CONSTANTS.RESTAURANT_SAVE_ERROR:
      return state
        .setIn(['restaurant', 'loading'], false)
        .setIn(['restaurant', 'error'], fromJS(action.data.error));
    case CONSTANTS.UPDATE_RESTAURANT_FIELD:
      return state.setIn(['restaurant', 'data', action.field], action.value);
    default:
  }

  return state;
}

export default restaurantReducer;

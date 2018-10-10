import { combineReducers } from 'redux-immutable';
import userReducer from '../user/redux/reducers';
import restaurantReducer from '../restaurant/redux/reducers';
import reviewReducer from '../review/redux/reducers';

const appReducer = combineReducers({
  user: userReducer,
  restaurant: restaurantReducer,
  review: reviewReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;

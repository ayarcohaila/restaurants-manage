import { fork, call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import history from 'browserHistory';

import * as CONSTANTS from './constants';
import {
  restaurantListSuccess,
  restaurantListError,
  restaurantLoadSuccess,
  restaurantLoadError,
  restaurantSaveSuccess,
  restaurantSaveError,
  restaurantDeleteSuccess,
  restaurantDeleteError,
} from './actions';
import { selectRestaurant } from './selectors';

export function* restaurantListRequest() {
  try {
    const data = yield call(request, 'restaurants', 'GET', null, true);

    yield put(restaurantListSuccess(data));
  } catch (err) {
    yield put(restaurantListError(err));
  }
}

export function* restaurantLoadRequest(action) {
  try {
    const data = yield call(
      request,
      `restaurants/${action.id}`,
      'GET',
      null,
      true,
    );
    yield put(restaurantLoadSuccess(data));
  } catch (err) {
    yield put(restaurantLoadError(err));
  }
}

export function* restaurantDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `restaurants/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(restaurantDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(restaurantDeleteError(err));
  }
}

export function* restaurantSaveRequest() {
  try {
    const state = yield select();
    const restaurant = selectRestaurant(state);
    const requestData = restaurant
      .get('restaurant')
      .get('data')
      .toJS();
    const id = restaurant.get('restaurant').get('id');
    let responseData = null;

    if (id === 'new') {
      responseData = yield call(
        request,
        'restaurants',
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `restaurants/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }
    history.push('/restaurants');
    notify.success('Restaurant saved'); // eslint-disable-line

    yield put(restaurantSaveSuccess(responseData));
  } catch (err) {
    notify.error(err); // eslint-disable-line
    yield put(restaurantSaveError(err));
  }
}

export default [
  fork(takeLatest, CONSTANTS.RESTAURANT_LIST_REQUEST, restaurantListRequest),
  fork(takeLatest, CONSTANTS.RESTAURANT_LOAD_REQUEST, restaurantLoadRequest),
  fork(takeLatest, CONSTANTS.RESTAURANT_SAVE_REQUEST, restaurantSaveRequest),
  fork(
    takeLatest,
    CONSTANTS.RESTAURANT_DELETE_REQUEST,
    restaurantDeleteRequest,
  ),
];

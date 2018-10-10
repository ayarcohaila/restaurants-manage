import { fork, call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';

import * as CONSTANTS from './constants';
import {
  userListSuccess,
  userListError,
  userLoadSuccess,
  userLoadError,
  userSaveSuccess,
  userSaveError,
  userDeleteSuccess,
  userDeleteError,
} from './actions';
import { selectUser } from './selectors';

export function* userListRequest() {
  try {
    const data = yield call(request, 'users', 'GET', null, true);
    yield put(userListSuccess(data));
  } catch (err) {
    yield put(userListError(err));
  }
}

export function* userLoadRequest(action) {
  try {
    const data = yield call(request, `users/${action.id}`, 'GET', null, true);
    yield put(userLoadSuccess(data));
  } catch (err) {
    yield put(userLoadError(err));
  }
}

export function* userDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `users/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(userDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(userDeleteError(err));
  }
}

export function* userSaveRequest() {
  try {
    const state = yield select();
    const user = selectUser(state);
    const requestData = user
      .get('user')
      .get('data')
      .toJS();
    const id = user.get('user').get('id');
    let responseData = null;

    if (id === 'new') {
      responseData = yield call(
        request,
        'users',
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `users/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }

    yield put(userSaveSuccess(responseData));
    notify.success('User saved'); //eslint-disable-line
  } catch (err) {
    notify.success(err); //eslint-disable-line
    yield put(userSaveError(err));
  }
}

export default [
  fork(takeLatest, CONSTANTS.USER_LIST_REQUEST, userListRequest),
  fork(takeLatest, CONSTANTS.USER_LOAD_REQUEST, userLoadRequest),
  fork(takeLatest, CONSTANTS.USER_SAVE_REQUEST, userSaveRequest),
  fork(takeLatest, CONSTANTS.USER_DELETE_REQUEST, userDeleteRequest),
];

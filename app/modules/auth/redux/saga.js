import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import history from 'browserHistory';
import * as CONSTANTS from './constants';
import {
  loginSuccess,
  loginError,
  signupSuccess,
  signupError,
} from './actions';

export function* loginRequest(action) {
  try {
    const data = yield call(request, 'auth/login', 'POST', {
      email: action.email,
      password: action.password,
    });
    yield put(loginSuccess(data));
  } catch (err) {
    yield put(loginError(err));
  }
}

export function* signupRequest(action) {
  try {
    const data = yield call(request, 'auth/signup', 'POST', action.data);
    yield put(signupSuccess(data));
    history.push('/login');
  } catch (err) {
    yield put(signupError(err));
  }
}

export default function* authSaga() {
  yield takeLatest(CONSTANTS.LOGIN_REQUEST, loginRequest);
  yield takeLatest(CONSTANTS.SIGNUP_REQUEST, signupRequest);
}

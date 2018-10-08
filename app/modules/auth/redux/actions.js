import * as CONSTANTS from './constants';

export function loginRequest(email, password) {
  return {
    type: CONSTANTS.LOGIN_REQUEST,
    email,
    password,
  };
}

export function loginSuccess(data) {
  return {
    type: CONSTANTS.LOGIN_SUCCESS,
    data,
  };
}

export function loginError(data) {
  return {
    type: CONSTANTS.LOGIN_ERROR,
    ...data,
  };
}

export function signupRequest(data) {
  return {
    type: CONSTANTS.SIGNUP_REQUEST,
    data,
  };
}

export function signupSuccess(data) {
  return {
    type: CONSTANTS.SIGNUP_SUCCESS,
    data,
  };
}

export function signupError(data) {
  return {
    type: CONSTANTS.SIGNUP_ERROR,
    ...data,
  };
}

export function logout() {
  return {
    type: CONSTANTS.LOGOUT,
  };
}

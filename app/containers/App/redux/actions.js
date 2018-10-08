import * as CONSTANTS from './constants';

export function setAPILoading(value) {
  return {
    type: CONSTANTS.SET_API_LOADING,
    value,
  };
}

export function setGlobalNotification(
  heading,
  message,
  visible = true,
  messageType = 'error',
) {
  return {
    type: CONSTANTS.SET_GLOBAL_NOTIFICATION,
    heading,
    message,
    visible,
    messageType,
  };
}

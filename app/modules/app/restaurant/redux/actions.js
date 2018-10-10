import * as CONSTANTS from './constants';

export function restaurantListRequest() {
  return {
    type: CONSTANTS.RESTAURANT_LIST_REQUEST,
  };
}

export function restaurantListSuccess(data) {
  return {
    type: CONSTANTS.RESTAURANT_LIST_SUCCESS,
    data,
  };
}

export function restaurantListError(data) {
  return {
    type: CONSTANTS.RESTAURANT_LIST_ERROR,
    data,
  };
}

export function restaurantLoadRequest(id) {
  return {
    type: CONSTANTS.RESTAURANT_LOAD_REQUEST,
    id,
  };
}

export function restaurantLoadSuccess(data) {
  return {
    type: CONSTANTS.RESTAURANT_LOAD_SUCCESS,
    data,
  };
}

export function restaurantLoadError(data) {
  return {
    type: CONSTANTS.RESTAURANT_LOAD_ERROR,
    data,
  };
}

export function restaurantDeleteRequest(id) {
  return {
    type: CONSTANTS.RESTAURANT_DELETE_REQUEST,
    id,
  };
}

export function restaurantDeleteSuccess(id, data) {
  return {
    type: CONSTANTS.RESTAURANT_DELETE_SUCCESS,
    id,
    data,
  };
}

export function restaurantDeleteError(data) {
  return {
    type: CONSTANTS.RESTAURANT_DELETE_ERROR,
    ...data,
  };
}

export function restaurantSaveRequest() {
  return {
    type: CONSTANTS.RESTAURANT_SAVE_REQUEST,
  };
}

export function restaurantSaveSuccess(data) {
  return {
    type: CONSTANTS.RESTAURANT_SAVE_SUCCESS,
    data,
  };
}

export function restaurantSaveError(data) {
  return {
    type: CONSTANTS.RESTAURANT_SAVE_ERROR,
    data,
  };
}

export function loadNewRestaurant() {
  return {
    type: CONSTANTS.LOAD_NEW_RESTAURANT,
  };
}

export function updateRestaurantField(field, value) {
  return {
    type: CONSTANTS.UPDATE_RESTAURANT_FIELD,
    field,
    value,
  };
}

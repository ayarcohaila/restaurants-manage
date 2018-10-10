import * as CONSTANTS from './constants';

export function reviewListRequest(restaurantId) {
  return {
    type: CONSTANTS.REVIEW_LIST_REQUEST,
    restaurantId,
  };
}

export function reviewListSuccess(data) {
  return {
    type: CONSTANTS.REVIEW_LIST_SUCCESS,
    data,
  };
}

export function reviewListError(data) {
  return {
    type: CONSTANTS.REVIEW_LIST_ERROR,
    data,
  };
}

export function reviewLoadRequest(id, restaurantId) {
  return {
    type: CONSTANTS.REVIEW_LOAD_REQUEST,
    id,
    restaurantId,
  };
}

export function reviewLoadSuccess(data) {
  return {
    type: CONSTANTS.REVIEW_LOAD_SUCCESS,
    data,
  };
}

export function reviewLoadError(data) {
  return {
    type: CONSTANTS.REVIEW_LOAD_ERROR,
    data,
  };
}

export function reviewDeleteRequest(id, restaurantId) {
  return {
    type: CONSTANTS.REVIEW_DELETE_REQUEST,
    id,
    restaurantId,
  };
}

export function reviewDeleteSuccess(id, data) {
  return {
    type: CONSTANTS.REVIEW_DELETE_SUCCESS,
    id,
    data,
  };
}

export function reviewDeleteError(data) {
  return {
    type: CONSTANTS.REVIEW_DELETE_ERROR,
    ...data,
  };
}

export function reviewSaveRequest(restaurantId) {
  return {
    type: CONSTANTS.REVIEW_SAVE_REQUEST,
    restaurantId,
  };
}

export function reviewSaveSuccess(data) {
  return {
    type: CONSTANTS.REVIEW_SAVE_SUCCESS,
    data,
  };
}

export function reviewSaveError(data) {
  return {
    type: CONSTANTS.REVIEW_SAVE_ERROR,
    data,
  };
}

export function loadNewReview() {
  return {
    type: CONSTANTS.LOAD_NEW_REVIEW,
  };
}

export function updateReviewField(field, value) {
  return {
    type: CONSTANTS.UPDATE_REVIEW_FIELD,
    field,
    value,
  };
}

export function reviewReplyRequest(restaurantId, reviewId, reply) {
  return {
    type: CONSTANTS.REVIEW_REPLY_REQUEST,
    restaurantId,
    reviewId,
    reply,
  };
}

export function reviewReplySuccess(data) {
  return {
    type: CONSTANTS.REVIEW_REPLY_SUCCESS,
    data,
  };
}
export function reviewReplyError(data) {
  return {
    type: CONSTANTS.REVIEW_REPLY_ERROR,
    data,
  };
}

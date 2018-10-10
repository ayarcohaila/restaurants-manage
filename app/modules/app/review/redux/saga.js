import { fork, call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';

import * as CONSTANTS from './constants';
import {
  reviewListSuccess,
  reviewListError,
  reviewLoadSuccess,
  reviewLoadError,
  reviewSaveSuccess,
  reviewSaveError,
  reviewDeleteSuccess,
  reviewDeleteError,
  reviewReplySuccess,
  reviewReplyError,
} from './actions';
import { selectReview } from './selectors';

export function* reviewListRequest(action) {
  try {
    const data = yield call(
      request,
      `restaurants/${action.restaurantId}/reviews`,
      'GET',
      null,
      true,
    );
    yield put(reviewListSuccess(data));
  } catch (err) {
    yield put(reviewListError(err));
  }
}

export function* reviewLoadRequest(action) {
  try {
    const data = yield call(
      request,
      `/restaurants/${action.restaurantId}/reviews/${action.id}`,
      'GET',
      null,
      true,
    );
    yield put(reviewLoadSuccess(data));
  } catch (err) {
    yield put(reviewLoadError(err));
  }
}

export function* reviewDeleteRequest(action) {
  try {
    const data = yield call(
      request,
      `restaurants/${action.restaurantId}/reviews/${action.id}`,
      'DELETE',
      null,
      true,
    );
    yield put(reviewDeleteSuccess(action.id, data));
  } catch (err) {
    yield put(reviewDeleteError(err));
  }
}

export function* reviewSaveRequest(action) {
  try {
    const state = yield select();
    const review = selectReview(state);
    const requestData = review
      .get('review')
      .get('data')
      .toJS();
    const id = review.get('review').get('id');
    let responseData = null;

    if (id === 'new') {
      responseData = yield call(
        request,
        `restaurants/${action.restaurantId}/reviews`,
        'POST',
        { ...requestData },
        true,
      );
    } else {
      responseData = yield call(
        request,
        `restaurants/${action.restaurantId}/reviews/${id}`,
        'PUT',
        { ...requestData },
        true,
      );
    }

    yield put(reviewSaveSuccess(responseData));
    notify.success('Review saved!'); // eslint-disable-line
  } catch (err) {
    yield put(reviewSaveError(err));
  }
}

export function* reviewReplyRequest(action) {
  try {
    const state = yield select();
    const review = selectReview(state);
    const requestData = review
      .get('review')
      .get('data')
      .toJS();
    let responseData = null;

    responseData = yield call(
      request,
      `restaurants/${action.restaurantId}/reviews/${action.reviewId}`,
      'PUT',
      { ...requestData },
      true,
    );

    yield put(reviewReplySuccess(responseData));
  } catch (err) {
    yield put(reviewReplyError(err));
  }
}

export default [
  fork(takeLatest, CONSTANTS.REVIEW_LIST_REQUEST, reviewListRequest),
  fork(takeLatest, CONSTANTS.REVIEW_LOAD_REQUEST, reviewLoadRequest),
  fork(takeLatest, CONSTANTS.REVIEW_SAVE_REQUEST, reviewSaveRequest),
  fork(takeLatest, CONSTANTS.REVIEW_DELETE_REQUEST, reviewDeleteRequest),
  fork(takeLatest, CONSTANTS.REVIEW_REPLY_REQUEST, reviewReplyRequest),
];

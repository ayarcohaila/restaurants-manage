import { fromJS } from 'immutable';
import * as CONSTANTS from './constants';

const newReview = {
  date: new Date(),
};

const initalState = fromJS({
  reviews: {
    list: [],
    loading: false,
  },
  review: {
    id: '',
    data: {},
    error: [],
    loading: false,
  },
});

function reviewReducer(state = initalState, action) {
  switch (action.type) {
    case CONSTANTS.LOAD_NEW_REVIEW:
      return state.set(
        'review',
        fromJS({
          data: newReview,
          id: 'new',
          error: [],
          loading: false,
        }),
      );
    case CONSTANTS.REVIEW_LIST_REQUEST:
      return state.setIn(['reviews', 'loading'], true);
    case CONSTANTS.REVIEW_LIST_SUCCESS:
      return state
        .setIn(['reviews', 'list'], fromJS(action.data))
        .setIn(['reviews', 'loading'], false);
    case CONSTANTS.REVIEW_LIST_ERROR:
      return state.setIn(['reviews', 'loading'], false);
    case CONSTANTS.REVIEW_DELETE_REQUEST:
      return state
        .setIn(['reviews', 'loading'], true)
        .setIn(['review', 'loading'], true);
    case CONSTANTS.REVIEW_DELETE_SUCCESS: {
      const reviewList = state.getIn(['reviews', 'list']);
      const filteredList = reviewList.filter(
        review => review.get('_id') !== action.id,
      );
      return state
        .setIn(['reviews', 'list'], fromJS(filteredList))
        .setIn(['reviews', 'loading'], false)
        .setIn(['review', 'loading'], false);
    }
    case CONSTANTS.REVIEW_DELETE_ERROR:
      return state
        .setIn(['reviews', 'loading'], false)
        .setIn(['review', 'loading'], false);
    case CONSTANTS.REVIEW_LOAD_REQUEST:
      return state.setIn(['review', 'loading'], true);
    case CONSTANTS.REVIEW_LOAD_SUCCESS:
      return state
        .setIn(['review', 'data'], fromJS(action.data))
        .setIn(['review', 'id'], action.data._id)
        .setIn(['review', 'loading'], false);
    case CONSTANTS.REVIEW_LOAD_ERROR:
      return state.setIn(['review', 'loading'], false);
    case CONSTANTS.REVIEW_SAVE_REQUEST:
      return state
        .setIn(['review', 'loading'], true)
        .setIn(['review', 'error'], fromJS([]));
    case CONSTANTS.REVIEW_SAVE_SUCCESS:
      return state
        .setIn(['review', 'id'], action.data._id)
        .setIn(['review', 'data', 'id'], action.data._id)
        .setIn(['review', 'loading'], false);
    case CONSTANTS.REVIEW_SAVE_ERROR:
      return state
        .setIn(['review', 'loading'], false)
        .setIn(['review', 'error'], fromJS(action.data.error));
    case CONSTANTS.UPDATE_REVIEW_FIELD:
      return state.setIn(['review', 'data', action.field], action.value);

    case CONSTANTS.REVIEW_REPLY_REQUEST:
      return state
        .setIn(['review', 'loading'], true)
        .setIn(['review', 'data', 'reply'], fromJS(action.reply));
    case CONSTANTS.REVIEW_REPLY_SUCCESS:
      return state
        .setIn(['review', 'id'], action.data._id)
        .setIn(['review', 'data', 'id'], action.data._id)
        .setIn(['review', 'loading'], false);
    default:
  }

  return state;
}

export default reviewReducer;

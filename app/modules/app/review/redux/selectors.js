import { createSelector } from 'reselect';

const selectReview = state => state.get('app').get('review');

const makeSelectReviewList = () =>
  createSelector(selectReview, reviewState =>
    reviewState.getIn(['reviews', 'list']),
  );

const makeSelectReviewListLoading = () =>
  createSelector(selectReview, reviewState =>
    reviewState.getIn(['reviews', 'loading']),
  );
const makeSelectReview = () =>
  createSelector(selectReview, reviewState =>
    reviewState.getIn(['review', 'data']),
  );

const makeSelectReviewLoading = () =>
  createSelector(selectReview, reviewState =>
    reviewState.getIn(['review', 'loading']),
  );

export {
  selectReview,
  makeSelectReviewList,
  makeSelectReviewListLoading,
  makeSelectReview,
  makeSelectReviewLoading,
};

import { createSelector } from 'reselect';

const selectUser = state => state.get('app').get('user');

const makeSelectUserList = () =>
  createSelector(selectUser, userState => userState.getIn(['users', 'list']));

const makeSelectUserListLoading = () =>
  createSelector(selectUser, userState =>
    userState.getIn(['users', 'loading']),
  );

const makeSelectUser = () =>
  createSelector(selectUser, userState => userState.getIn(['user', 'data']));

const makeSelectUserLoading = () =>
  createSelector(selectUser, userState => userState.getIn(['user', 'loading']));

export {
  selectUser,
  makeSelectUserList,
  makeSelectUserListLoading,
  makeSelectUser,
  makeSelectUserLoading,
};

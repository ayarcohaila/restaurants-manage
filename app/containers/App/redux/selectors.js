/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const selectRoute = state => state.get('route');

const selectAuth = state => state.get('auth');

const makeSelectCurrentUser = () =>
  createSelector(selectAuth, globalState => globalState.get('currentUser'));

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.get('loading'));

const makeSelectPersisting = () =>
  createSelector(selectGlobal, globalState => globalState.get('persisted'));

const makeSelectPersistLoaded = () =>
  createSelector(selectGlobal, globalState => globalState.get('persistLoaded'));

const makeSelectNotification = () =>
  createSelector(selectGlobal, globalState => globalState.get('notification'));

const makeSelectLocation = () =>
  createSelector(selectRoute, routeState => routeState.get('location').toJS());

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectNotification,
  makeSelectLocation,
  makeSelectPersistLoaded,
  makeSelectPersisting,
};

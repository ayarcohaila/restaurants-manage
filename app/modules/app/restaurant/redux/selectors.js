import { createSelector } from 'reselect';

const selectRestaurant = state => state.get('app').get('restaurant');

const makeSelectRestaurantList = () =>
  createSelector(selectRestaurant, restaurantState =>
    restaurantState.getIn(['restaurants', 'list']),
  );

const makeSelectRestaurantListLoading = () =>
  createSelector(selectRestaurant, restaurantState =>
    restaurantState.getIn(['restaurants', 'loading']),
  );

const makeSelectRestaurant = () =>
  createSelector(selectRestaurant, restaurantState =>
    restaurantState.getIn(['restaurant', 'data']),
  );

const makeSelectRestaurantLoading = () =>
  createSelector(selectRestaurant, restaurantState =>
    restaurantState.getIn(['restaurant', 'loading']),
  );

export {
  selectRestaurant,
  makeSelectRestaurantList,
  makeSelectRestaurantListLoading,
  makeSelectRestaurant,
  makeSelectRestaurantLoading,
};

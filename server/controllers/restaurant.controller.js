// const mongoose = require('mongoose');
const _ = require('lodash');
const Restaurant = require('../models/restaurant.model');
const Review = require('../models/review.model');
const ROLES = require('../constants/role');

function create(req, res, next) {
  const restaurant = new Restaurant(req.body);
  if (req.user.role === ROLES.USER) {
    res.status(403).json({ message: 'You are not allowed to add restaurant' });
  } else {
    restaurant.user =
      req.user.role === ROLES.OWNER ? req.user._id : req.body.user;
    restaurant
      .save()
      .then(newRestaurant => {
        res.json(newRestaurant);
      })
      .catch(next);
  }
}

function update(req, res, next) {
  Object.assign(req.restaurant, req.body);
  if (req.user.role === ROLES.ADMIN) {
    req.restaurant
      .save()
      .then(updatedRestaurant => {
        res.json(updatedRestaurant);
      })
      .catch(next);
  } else {
    res
      .status(403)
      .json({ message: 'You are not allowed to update restaurant' });
  }
}

function read(req, res) {
  res.json(req.restaurant);
}

function list(req, res, next) {
  let where = {};

  if (req.user.role === ROLES.OWNER) {
    where = { user: req.user._id }; // eslint-disable-line
  }

  Restaurant.find(where)
    .populate('user')
    .then(restaurants => {
      const restaurantWithReview = [];
      return restaurants.reduce(
        (lastPromise, restaurant) =>
          lastPromise.then(() =>
            Review.find({ restaurant: restaurant._id })
              .exec()
              .then(reviews => {
                const average =
                  _.sumBy(reviews || [], review => Number(review.rate)) /
                  reviews.length;
                restaurantWithReview.push({ ...restaurant._doc, average });
                return restaurantWithReview;
              }),
          ),
        Promise.resolve(),
      );
    })
    .then(result => {
      res.send(result);
    })
    .catch(next);
}

function remove(req, res, next) {
  if (req.user.role !== ROLES.ADMIN) {
    res
      .status(403)
      .json({ message: 'You are not allowed to delete restaurant' });
  } else {
    req.restaurant
      .remove()
      .then(() => {
        res.json(req.restaurant);
      })
      .catch(next);
  }
}

function getRestaurantByID(req, res, next, id) {
  Restaurant.findById(id)
    .then(restaurant => {
      if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found' });
        return;
      }

      req.restaurant = restaurant;
      next();
    })
    .catch(next);
}

module.exports = {
  create,
  update,
  read,
  list,
  remove,
  getRestaurantByID,
};

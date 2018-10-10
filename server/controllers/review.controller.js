const Review = require('../models/review.model');
const ROLES = require('../constants/role');

function create(req, res, next) {
  const review = new Review(req.body);
  review.restaurant = req.restaurant._id;
  review
    .save()
    .then(newReview => {
      res.json(newReview);
    })
    .catch(next);
}

function update(req, res, next) {
  Object.assign(req.review, req.body);
  if (req.user.role !== ROLES.USER) {
    req.review
      .save()
      .then(updatedReview => {
        res.json(updatedReview);
      })
      .catch(next);
  } else {
    res.status(403).json({ message: 'You are not allowed to update review' });
  }
}

function read(req, res) {
  res.json(req.review);
}

function list(req, res, next) {
  let where = {};
  const { restaurantId } = req.params;
  where = { restaurant: restaurantId };

  Review.find(where)
    .populate('restaurant')
    .then(reviews => {
      res.json(reviews);
    })
    .catch(next);
}

function remove(req, res, next) {
  if (req.user.role !== ROLES.ADMIN) {
    res.status(403).json({ message: 'You are not allowed to delete review' });
  } else {
    req.review
      .remove()
      .then(() => {
        res.json(req.review);
      })
      .catch(next);
  }
}

function getReviewByID(req, res, next, id) {
  Review.findById(id)
    .then(review => {
      if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      req.review = review;
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
  getReviewByID,
};

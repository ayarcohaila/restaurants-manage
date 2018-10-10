const Review = require('../models/review.model');

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

  req.review
    .save()
    .then(updatedReview => {
      res.json(updatedReview);
    })
    .catch(next);
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
  req.review
    .remove()
    .then(() => {
      res.json(req.review);
    })
    .catch(next);
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

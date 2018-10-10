const express = require('express');
const expressJwt = require('express-jwt');
const config = require('../config');

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const restaurantRoute = require('./restaurant.route');

const router = express.Router();
const authMiddleware = expressJwt({ secret: config.jwtSecret });

router.use('/auth', authRoute);
router.use('/restaurants', authMiddleware, restaurantRoute);
router.use('/users', authMiddleware, userRoute);

module.exports = router;

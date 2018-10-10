const express = require('express');
const userCtrl = require('../controllers/user.controller');
const ROLES = require('../constants/role');
const policies = require('../policies');

const router = express.Router();

router.use(policies.checkRoles([ROLES.ADMIN]));

router
  .route('/')
  .get(userCtrl.list)
  .post(userCtrl.create);

router
  .route('/:userId')
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove);

router.param('userId', userCtrl.getUserByID);

module.exports = router;

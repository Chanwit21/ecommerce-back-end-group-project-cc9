const router = require('express').Router();
const passport = require('passport');
const cartController = require('../controller/cart');

router.get('/', passport.authenticate('jwtCustomer', { session: false }), cartController.getAllCartItem);

module.exports = router;

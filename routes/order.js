const router = require('express').Router();
const passport = require('passport');
const orderController = require('../controller/order');

router.post(
  '/create_order_with_address_and_card',
  passport.authenticate('jwtCustomer', { session: false }),
  orderController.createOrderWithAddressAndCard
);

module.exports = router;

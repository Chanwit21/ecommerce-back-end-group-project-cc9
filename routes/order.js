const router = require('express').Router();
const passport = require('passport');
const orderController = require('../controller/order');

router.post(
  '/create_order_with_address_and_card',
  passport.authenticate('jwtCustomer', { session: false }),
  orderController.createOrderWithAddressAndCard
);
router.post(
  '/create_order_with_selected_address_and_card',
  passport.authenticate('jwtCustomer', { session: false }),
  orderController.createOrderWithCardAndAddressId
);
router.post(
  '/create_order_with_selected_card_and_address',
  passport.authenticate('jwtCustomer', { session: false }),
  orderController.createOrderWithCardIdAndAddress
);
router.post(
  '/create_order_with_selected_card_and_selected_address',
  passport.authenticate('jwtCustomer', { session: false }),
  orderController.createOrderWithCardIdAndAddressId
);

module.exports = router;

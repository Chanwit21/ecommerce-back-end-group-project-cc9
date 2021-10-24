const router = require('express').Router();
const passport = require('passport');
const addressController = require('../controller/address');

router.get('/', passport.authenticate('jwtCustomer', { session: false }), addressController.getAllAddress);
router.post('/', passport.authenticate('jwtCustomer', { session: false }), addressController.createAddress);

module.exports = router;

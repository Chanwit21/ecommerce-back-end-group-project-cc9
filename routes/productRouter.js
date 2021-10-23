const express = require('express');
const productController = require('../controller/productController');
const passport = require('passport');

const productRouter = express.Router();

productRouter.get('/:productName', productController.getProductById)
productRouter.post('/checkFavorite', passport.authenticate('jwtAll', { session: false }), productController.checkFavorite)
productRouter.post('/favorite', passport.authenticate('jwtAll', { session: false }), productController.createFavorite)
productRouter.post('/cart', passport.authenticate('jwtAll', { session: false }), productController.createCartItem)
productRouter.delete('/favorite/:productId', passport.authenticate('jwtAll', { session: false }), productController.deleteFavorite)

module.exports = productRouter;

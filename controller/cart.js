const { Cart, CartItem, Sequelize, Product, ProductImage } = require('../models');

exports.getAllCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId: userId },
      include: { model: CartItem, include: { model: Product, include: { model: ProductImage } } },
    });
    const carts = cart.dataValues.CartItems.map((item) => {
      const clone1 = JSON.parse(JSON.stringify(item));
      delete clone1.Product;
      const { Product } = JSON.parse(JSON.stringify(item));
      const clone = { ...Product };
      delete clone.ProductImages;
      return { ...clone, imageUrl: Product.ProductImages[0].imageUrl, ...clone1 };
    });
    res.status(201).json({ carts: carts, countCart: carts.length });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItemById = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quality } = req.body;
    const cartItem = await CartItem.findByPk(cartItemId);
    cartItem.quality = quality;
    cartItem.save();
    res.status(200).json({ cartItem });
  } catch (err) {
    next(err);
  }
};

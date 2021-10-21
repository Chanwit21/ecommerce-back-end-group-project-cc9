const { Cart, CartItem, Sequelize } = require('../models');

exports.getAllCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId: userId },
      include: { model: CartItem },
    });
    res.status(200).json({ carts: cart.CartItems, countCart: cart.CartItems.length });
  } catch (err) {
    next(err);
  }
};

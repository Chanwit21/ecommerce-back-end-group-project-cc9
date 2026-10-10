const {
  Cart,
  CartItem,
  Sequelize,
  Product,
  ProductImage,
} = require("../../../database/models");

exports.getAllCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId: userId },
      include: {
        model: CartItem,
        include: { model: Product, include: { model: ProductImage } },
      },
    });
    const carts = cart.dataValues.CartItems.map((item) => {
      const clone1 = JSON.parse(JSON.stringify(item));
      delete clone1.Product;
      const { Product } = JSON.parse(JSON.stringify(item));
      const clone = { ...Product };
      delete clone.ProductImages;
      return {
        ...clone,
        imageUrl: Product.ProductImages[0].imageUrl,
        ...clone1,
      };
    });
    res.status(201).json({ carts: carts, countCart: carts.length });
  } catch (err) {
    next(err);
  }
};

exports.addCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quality, productId } = req.body;
    if (
      !Number.isInteger(Number(quality)) ||
      Number(quality) < 1 ||
      Number(quality) > 99
    )
      return res.status(400).json({ message: "Invalid quantity" });
    const cart = await Cart.findOne({ where: { userId: userId } });
    const cartItem = await CartItem.create({
      cartId: cart.id,
      productId,
      quality,
    });
    const product = await Product.findOne({
      where: { id: productId },
      include: { model: ProductImage },
    });
    const clone = { ...JSON.parse(JSON.stringify(product)) };
    const imageUrl = clone.ProductImages[0].imageUrl;
    delete clone.ProductImages;
    res
      .status(200)
      .json({
        cartItem: {
          ...clone,
          imageUrl: imageUrl,
          ...JSON.parse(JSON.stringify(cartItem)),
        },
      });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItemById = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quality } = req.body;
    if (
      !Number.isInteger(Number(quality)) ||
      Number(quality) < 1 ||
      Number(quality) > 99
    )
      return res.status(400).json({ message: "Invalid quantity" });
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cartId: cart.id },
    });
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });
    cartItem.quality = quality;
    await cartItem.save();
    res.status(200).json({ cartItem });
  } catch (err) {
    next(err);
  }
};

exports.deleteCartItemById = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    await CartItem.destroy({ where: { id: cartItemId, cartId: cart.id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

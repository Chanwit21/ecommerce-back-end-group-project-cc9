const { Op } = require('sequelize');
const { Product, FavoriteProduct, ProductImage, CartItem, Cart } = require('../models');

// get all data
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findName = await Product.findOne({
      where: {
        id,
      },
    });
    const product = await Product.findAll({
      where: {
        name: findName.name,
      },
    });

    const productImage = await ProductImage.findAll({
      where: {
        '$Product.name$': findName.name,
      },
      include: {
        model: Product,
        // attributes: ['name', 'id']
      },
    });

    res.json({ product, productImage });
  } catch (err) {
    next(err);
  }
};

exports.checkFavorite = async (req, res, next) => {
  try {
    const { productName } = req.body;
    let IsFavorite = false;
    const product = await Product.findAll({
      where: {
        name: productName,
      },
    });
    const productId = [];
    product.forEach((item) => productId.push({ id: item.id }));
    const favortie = await FavoriteProduct.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [...productId],
      },
    });

    if (favortie.length) {
      IsFavorite = true;
    }

    res.status(201).json({ IsFavorite });
  } catch (err) {
    next(err);
  }
};
exports.createFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const data = await FavoriteProduct.create({
      productId,
      userId: req.user.id,
    });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
};

exports.deleteFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const data = await FavoriteProduct.destroy({
      where: {
        productId,
        userId: req.user.id,
      },
    });
    res.status(204);
  } catch (err) {
    next(err);
  }
};

exports.createCartItem = async (req, res, next) => {
  try {
    const { quality, productId } = req.body; //quantity
    let userCart = await Cart.findOne({ where: { userId: req.user.id } });
    console.log(`userCart`, userCart);

    if (!userCart) {
      userCart = await Cart.create({
        userId: req.user.id,
      });
    }

    const cartItem = await CartItem.create({
      isSelectToPay: false,
      quality,
      cartId: userCart.id,
      productId,
    });
    res.status(201).json({ cartItem });
  } catch (err) {
    next(err);
  }
};

const { Op } = require('sequelize');
const { Product, FavoriteProduct, ProductImage, CartItem, Cart, OrderItem, Order } = require('../models');
const cloundinaryUploadPromise = require('../util/upload');

// get all data
exports.getProductById = async (req, res, next) => {
  try {
    const { productName } = req.params;
    const product = await Product.findAll({
      where: {
        name: productName,
      },
    });

    const productImage = await ProductImage.findAll({
      where: {
        '$Product.name$': productName,
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
    product.forEach((item) => productId.push(+item.id));
    const favortie = await FavoriteProduct.findAll({
      where: {
        userId: req.user.id,
        productId: {
          [Op.or]: [...productId],
        },
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
    const { productId, productName } = req.body;
    const data = await FavoriteProduct.create({
      productId,
      userId: req.user.id,
      name: productName,
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
    res.status(204).json();
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

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const rows = await Product.destroy({
      where: {
        id: productId,
      },
    });
    console.log(`rows`, rows);
    if (rows === 0) return res.status(400).json({ message: 'Delete is failed' });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.getProductAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.createNewProduct = async (req, res, next) => {
  try {
    const { name, description, price, cetagory, colorName, color, countStock, ingredient } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      cetagory,
      colorName,
      color,
      countStock,
      ingredient,
    });

    Promise.all(req.files.map((item) => cloundinaryUploadPromise(item.path)))
      .then((value) => {
        value.forEach((item) => {
          ProductImage.create({
            imageUrl: item.secure_url,
            productId: product.id,
          });
        });
      })
      .catch((err) => console.log(err));

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.getProductImageByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productImage = await ProductImage.findAll({
      where: {
        productId,
      },
    });

    res.json({ productImage });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, cetagory, colorName, color, countStock, ingredient, deletedImg } = req.body;
    const { productId } = req.params;
    const [rows] = await Product.update(
      {
        name,
        description,
        price,
        cetagory,
        colorName,
        color,
        countStock,
        ingredient,
      },
      {
        where: {
          id: productId,
        },
      }
    );

    if (rows === 0) {
      return res.status(400).json({ message: 'Update is failed' });
    }
    await ProductImage.destroy({
      where: {
        imageUrl: { [Op.or]: ['x', ...deletedImg.split(',')] },
      },
    });

    await Promise.all(req.files.map((item) => cloundinaryUploadPromise(item.path)))
      .then((value) => {
        value.forEach((item) => {
          ProductImage.create({
            imageUrl: item.secure_url,
            productId: productId,
          });
        });
      })
      .catch((err) => console.log(err));

    res.json({ message: 'Updated is Successful' });
  } catch (err) {
    next(err);
  }
};

exports.readyToShip = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const orderItem = await OrderItem.findAll({
      where: {
        productId,
        '$Order.shipping_status$': 'To Ship',
      },
      include: {
        model: Order,
        attributes: ['status', 'shippingStatus'],
      },
    });

    const numberOfReadytoSend = orderItem.reduce((acc, item) => acc + +item.quality, 0);

    res.json({ numberOfReadytoSend });
  } catch (err) {
    next(err);
  }
};

exports.getAllProductByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const result = await Product.findAll({
      where: { cetagory: category },
      include: { model: ProductImage, attributes: ['imageUrl'] },
    });
    const products = result.map((product) => {
      const { ProductImages } = product.dataValues;
      const clone = { ...product.dataValues };
      delete clone.ProductImages;
      return { ...clone, imageUrl: ProductImages[0]?.imageUrl };
    });
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

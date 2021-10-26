const { Address, Order, CreditCard, OrderItem, Product, CartItem } = require('../models');
const { addCreditCard, createCharge, deleteCreditCard } = require('../util/omise');

const processAfterCreateCharge = (charge, orders, customer) => {};

exports.createOrderWithAddressAndCard = async (req, res, ncartIdext) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardToken, amount, orders, cartId } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: address.id,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.id, customer.default_card);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardAndAddressId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, creditCardToken, amount, orders, cartId } = req.body;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: addressId,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.id, customer.default_card);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardIdAndAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardId, amount, orders, cartId } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: address.id,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.customerId, creditCardId);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardIdAndAddressId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, creditCardId, amount, orders, cartId } = req.body;
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === 'successful') {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: 'successful',
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: 'To Ship',
        shippingTrackingId: '',
        addressId: addressId,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { productId, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: productId } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { productId, quality } = product;
        return {
          productId: productId,
          quality: quality,
          orderId: order.id,
        };
      });

      await CartItem.destroy({ where: { cartId: cartId } });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    } else {
      await deleteCreditCard(customer.customerId, creditCardId);
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

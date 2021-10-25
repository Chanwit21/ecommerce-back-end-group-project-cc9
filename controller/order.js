const { Address, Order, CreditCard, OrderItem } = require('../models');
const { addCreditCard, createCharge, deleteCreditCard } = require('../util/omise');

exports.createOrderWithAddressAndCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardToken, amount, orders } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === 'failed') {
      await deleteCreditCard(customer.id, customer.default_card);
    } else {
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
      const orderItemCreate = orders.map((product) => {
        return {
          productId: product.id,
          quality: product.quality,
          orderId: order.id,
        };
      });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardAndAddressId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, creditCardToken, amount, orders } = req.body;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === 'failed') {
      await deleteCreditCard(customer.id, customer.default_card);
    } else {
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
      const orderItemCreate = orders.map((product) => {
        return {
          productId: product.id,
          quality: product.quality,
          orderId: order.id,
        };
      });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

exports.createOrderWithCardIdAndAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardId, amount, orders } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === 'failed') {
      await deleteCreditCard(customer.customerId, creditCardId);
    } else {
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
      const orderItemCreate = orders.map((product) => {
        return {
          productId: product.id,
          quality: product.quality,
          orderId: order.id,
        };
      });

      await OrderItem.bulkCreate(orderItemCreate);
      return res.status(200).json({ charge, order });
    }
    res.status(200).json({ charge });
  } catch (err) {
    next(err);
  }
};

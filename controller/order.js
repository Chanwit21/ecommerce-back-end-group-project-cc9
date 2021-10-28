const { Address, Order, User, CreditCard, OrderItem, Product } = require("../models");
const { addCreditCard, createCharge, deleteCreditCard } = require("../util/omise");

const processAfterCreateCharge = (charge, orders, customer) => {};

exports.createOrderWithAddressAndCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardToken, amount, orders } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === "successful") {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: "successful",
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: "To Ship",
        shippingTrackingId: "",
        addressId: address.id,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { id, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: id } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { id, quality } = product;
        return {
          productId: id,
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
    const { addressId, creditCardToken, amount, orders } = req.body;
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    const charge = await createCharge(customer.id, customer.default_card, amount);
    if (charge.status === "successful") {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: "successful",
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: "To Ship",
        shippingTrackingId: "",
        addressId: addressId,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { id, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: id } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { id, quality } = product;
        return {
          productId: id,
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

exports.createOrderWithCardIdAndAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardId, amount, orders } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === "successful") {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: "successful",
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: "To Ship",
        shippingTrackingId: "",
        addressId: address.id,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { id, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: id } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { id, quality } = product;
        return {
          productId: id,
          quality: quality,
          orderId: order.id,
        };
      });

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
    const { addressId, creditCardId, amount, orders } = req.body;
    const customer = await CreditCard.findOne({ where: { userId: userId } });
    const charge = await createCharge(customer.customerId, creditCardId, amount);
    if (charge.status === "successful") {
      const order = await Order.create({
        omiseCreatedAt: charge.created_at,
        cardId: charge.card.id,
        sourceId: null,
        chargeId: charge.id,
        amount: charge.amount / 100,
        status: "successful",
        paidAt: charge.paid_at,
        expiresAt: charge.expired_at,
        shippingStatus: "To Ship",
        shippingTrackingId: "",
        addressId: addressId,
      });

      // Update Stock
      orders.forEach(async (product) => {
        const { id, quality } = product;
        const productUpdate = await Product.findOne({ where: { id: id } });
        productUpdate.countStock = +productUpdate.countStock - +quality;
        productUpdate.save();
      });

      const orderItemCreate = orders.map((product) => {
        const { id, quality } = product;
        return {
          productId: id,
          quality: quality,
          orderId: order.id,
        };
      });

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

exports.getAllOrder = async (req, res, next) => {
  try {
    const getAllOrder = await Order.findAll({ include: { model: Address, include: { model: User } } });

    const orderItems = getAllOrder.map((orderList) => {
      const { id, omiseCreatedAt, amount, shippingStatus, Address, shippingTrackingId } = orderList;
      return {
        orderId: id,
        firstname: Address.User.firstName,
        date: omiseCreatedAt,
        amount: amount,
        shippingStatus: shippingStatus,
        shippingTrackingId: shippingTrackingId,
      };
    });
    // console.log("mapItem : ", orderItems);
    res.status(200).json({ orderItems });
  } catch (err) {
    next(err);
  }
};

exports.orderAdminEditShippingInfo = async (req, res, next) => {
  try {
    const { id, shippingStatus, shippingTrackingId } = req.body;
    const { orderId } = req.params;
    const updateShippingInfo = await Order.update({ shippingStatus, shippingTrackingId }, { where: { id: orderId } });
    res.status(201).json(updateShippingInfo);
    console.log(shippingTrackingId);
  } catch (err) {
    next(err);
  }
};

const { Address, Order, CreditCard } = require('../models');
const { addCreditCard } = require('../util/omise');

exports.createOrderWithAddressAndCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressCreate, creditCardToken } = req.body;
    const address = await Address.create({ ...addressCreate, userId });
    const creditCard = await CreditCard.findOne({ where: { userId } });
    const customer = await addCreditCard(creditCard.customerId, creditCardToken);
    console.log(customer);
    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};

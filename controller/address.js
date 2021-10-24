const { Address } = require('../models');

exports.getAllAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allAddress = await Address.findAll({ where: { userId: userId } });
    res.status(200).json({ allAddress, count: allAddress.length });
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, address1, address2, province, district, subDistrict, postalCode, phoneNumber } =
      req.body;
    const address = await Address.create({
      firstName,
      lastName,
      address1,
      address2,
      subDistrict,
      district,
      province,
      postalCode,
      phoneNumber,
      userId,
    });
    res.status(200).json({ address });
  } catch (err) {
    next(err);
  }
};

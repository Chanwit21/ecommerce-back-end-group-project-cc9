const { User, Cart, CreditCard } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail, isStrongPassword } = require('validator');
const omise = require('omise')({ secretKey: 'skey_test_5ov8h8rdpslf54x97k1' });
const Customerror = require('../util/error');
const cloundinaryUploadPromise = require('../util/upload');

const createCartAndCreditCardOmise = async (userCreate) => {
  // Create Cart when user registed
  await Cart.create({ userId: userCreate.id });

  //create customer id in omise
  omise.customers.create(
    {
      description: `${userCreate.firstName + ' ' + userCreate.lastName} (id: ${userCreate.id})`,
      email: userCreate.email,
    },
    async function (error, customer) {
      if (error) {
        throw new Customerror(error.message, 400);
      } else {
        try {
          await CreditCard.create({ customerId: customer.id, userId: userCreate.id });
        } catch (err) {
          next(err);
        }
      }
    }
  );
};

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if ([firstName, lastName, email, password].includes(undefined)) {
    return res.status(400).json({ message: 'firstName, lastName, email and password is require!!' });
  }

  if (
    !isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({ message: 'password is week!!' });
  }

  try {
    const user = await User.findOne({
      where: { email: email, facebookId: null, facebookId: null },
    });

    if (user) {
      res.status(400).json({ message: 'Email Already in Use.' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: null,
        password: hashedPassword,
        googleId: null,
        facebookId: null,
      });

      await createCartAndCreditCardOmise(userCreate);

      res.status(201).json({ message: 'User has been created' });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ([email, password].includes(undefined)) {
      return res.status(400).json({ massage: 'email and password is require!!' });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        message: 'email  is invalid format',
      });
    }

    const user = await User.findOne({
      where: { email: email, facebookId: null, googleId: null },
    });

    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        const payload = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: user.imageUrl,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: process.env.TOKEN_EXPIRE,
        });
        res.status(200).json({ message: 'Success login', token });
      } else {
        res.status(400).json({
          message: 'email or password is incorrect',
        });
      }
    } else {
      res.status(400).json({
        message: 'email or password is incorrect',
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { email, firstName, lastName, googleId, imageUrl } = req.body;

    if ([firstName, lastName, email, googleId].includes(undefined)) {
      return res.status(400).json({ message: 'firstName, lastName, email and googleId is require!!' });
    }

    const user = await User.findOne({ where: { email, googleId } });

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        image: user.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    } else {
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: imageUrl,
        password: null,
        facebookId: null,
        googleId: googleId,
      });

      await createCartAndCreditCardOmise(userCreate);

      const payload = {
        id: userCreate.id,
        email: userCreate.email,
        firstName: userCreate.firstName,
        lastName: userCreate.lastName,
        role: userCreate.role,
        image: userCreate.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    }
  } catch (err) {
    next(err);
  }
};

exports.loginWithFacebook = async (req, res, next) => {
  try {
    const { email, firstName, lastName, facebookId, imageUrl } = req.body;

    if ([firstName, lastName, email, facebookId].includes(undefined)) {
      return res.status(400).json({ message: 'firstName, lastName, email and facebookId is require!!' });
    }

    const user = await User.findOne({ where: { email, facebookId } });

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        image: user.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    } else {
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: imageUrl,
        password: null,
        googleId: null,
        facebookId: facebookId,
      });

      await createCartAndCreditCardOmise(userCreate);

      const payload = {
        id: userCreate.id,
        email: userCreate.email,
        firstName: userCreate.firstName,
        lastName: userCreate.lastName,
        role: userCreate.role,
        image: userCreate.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    }
  } catch (err) {
    next(err);
  }
};

exports.editUserInformation = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body
    const result = req.file && await cloundinaryUploadPromise(req.file.path)
    const rows = await User.update({
      firstName,
      lastName,
      email,
      phoneNumber,
      imageUrl: result?.secure_url
    },
      {
        where: {
          id: req.user.id
        }
      })

    if (rows === 0) {
      return res.status(400).json({ message: 'Update is failed' });
    }

    res.json({ message: 'Updated is Successful' });
  }
  catch (err) {
    next(err)
  }
}

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: ['firstName', 'lastName', 'email', 'imageUrl', 'phoneNumber', 'gender', 'id']
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

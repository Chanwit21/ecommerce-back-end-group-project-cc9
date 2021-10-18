const { User, Cart } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail, isStrongPassword } = require('validator');

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
      const user = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: null,
        password: hashedPassword,
        facebookId: null,
        facebookId: null,
      });

      // Create Cart when user registed
      await Cart.create({ userId: user.id });

      //Create token whenregistered auto login
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

      res.status(201).json({ message: 'User has been created', token });
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
      where: { email: email, facebookId: null, facebookId: null },
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
    const { email, firstName, lastName, googleId } = req.body;

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
        imageUrl: null,
        password: null,
        facebookId: null,
        googleId: googleId,
      });

      // Create Cart when user registed
      await Cart.create({ userId: userCreate.id });

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
    const { email, firstName, lastName, facebookId } = req.body;

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
        imageUrl: null,
        password: null,
        googleId: null,
        facebookId: facebookId,
      });

      // Create Cart when user registed
      await Cart.create({ userId: userCreate.id });

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

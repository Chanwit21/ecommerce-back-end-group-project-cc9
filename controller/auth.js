const { User, Cart } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloundinaryUploadPromise } = require('../util/upload');

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password, facebookId, googleId } = req.body;
  let { imageUrl } = req.body;

  if ([firstName, lastName, email].includes(undefined)) {
    return res.status(400).json({ message: 'firstName, lastName, email is require!!' });
  }

  if (password === undefined && facebookId === undefined && googleId === undefined) {
    return res.status(400).json({
      message: 'password or facebookId or googleId is require!!',
    });
  }

  if (req.file && !imageUrl) {
    const result = await cloundinaryUploadPromise(req.file.path);
    imageUrl = result.secure_url;
  }

  try {
    if (password) {
      const user = await User.findOne({
        where: { email: email, facebookId: null, googleId: null },
      });

      if (user) {
        res.status(400).json({ message: 'Email Already in Use.' });
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
          firstName,
          lastName,
          email,
          imageUrl: imageUrl || null,
          password: hashedPassword,
          facebookId: null,
          googleId: null,
        });
        // Create Cart when user registed
        await Cart.create({ userId: user.id });
        res.status(201).json({ message: 'User has been created' });
      }
    } else if (facebookId) {
      const user = await User.findOne({
        where: { email: email, password: null, googleId: null },
      });
      if (user) {
        res.status(400).json({ message: 'Email Already in Use.' });
      } else {
        const user = await User.create({
          firstName,
          lastName,
          email,
          imageUrl: imageUrl || null,
          password: null,
          facebookId: facebookId,
          googleId: null,
        });
        // Create Cart when user registed
        await Cart.create({ userId: user.id });
        res.status(201).json({ message: 'User has been created' });
      }
    } else if (googleId) {
      const user = await User.findOne({
        where: { email: email, password: null, facebookId: null },
      });
      if (user) {
        res.status(400).json({ message: 'Email Already in Use.' });
      } else {
        const user = await User.create({
          firstName,
          lastName,
          email,
          imageUrl: imageUrl || null,
          password: null,
          facebookId: null,
          googleId: googleId,
        });
        // Create Cart when user registed
        await Cart.create({ userId: user.id });
        res.status(201).json({ message: 'User has been created' });
      }
    } else {
      res.status(400).json({
        message: 'password or facebookId or googleId is require!!',
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, facebookId, googleId } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'email or password or googleId or facebookId is incorrect',
      });
    }

    if (password) {
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
            image: user.image,
          };
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRE,
          });
          res.status(200).json({ message: 'Success login', token });
        } else {
          res.status(400).json({
            message: 'email or password or googleId or facebookId is incorrect',
          });
        }
      } else {
        res.status(400).json({
          message: 'email or password or googleId or facebookId is incorrect',
        });
      }
    } else if (facebookId) {
      const user = await User.findOne({
        where: { email: email, password: null, googleId: null },
      });
      if (user) {
        const isCorrectFacebookId = user.facebookId === facebookId;
        if (isCorrectFacebookId) {
          const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.image,
          };
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRE,
          });
          res.status(200).json({ message: 'Success login', token });
        } else {
          res.status(400).json({
            message: 'email or password or googleId or facebookId is incorrect',
          });
        }
      } else {
        res.status(400).json({
          message: 'email or password or googleId or facebookId is incorrect',
        });
      }
    } else if (googleId) {
      const user = await User.findOne({
        where: { email: email, password: null, facebookId: null },
      });
      if (user) {
        const isCorrectGoogleId = user.googleId === googleId;
        if (isCorrectGoogleId) {
          const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.image,
          };
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRE,
          });
          res.status(200).json({ message: 'Success login', token });
        } else {
          res.status(400).json({
            message: 'email or password or googleId or facebookId is incorrect',
          });
        }
      } else {
        res.status(400).json({
          message: 'email or password or googleId or facebookId is incorrect',
        });
      }
    } else {
      res.status(400).json({
        message: 'password or facebookId or googleId is require!!',
      });
    }
  } catch (err) {
    next(err);
  }
};

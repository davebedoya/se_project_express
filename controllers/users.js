const jwt = require("jsonwebtoken"); // importing the jsonwebtoken module
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../errors/unauthorized-err");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Invalid email or password"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((e) => {
      if (e.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(e);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Invalid data"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          res.status(201).send(userObj);
        })
        .catch((e) => {
          if (e.code === 11000) {
            return next(new ConflictError("Email already exists"));
          }
          if (e.name === "ValidationError") {
            return next(new BadRequestError("Invalid data"));
          }
          return next(e);
        })
    )
    .catch((e) => {
      if (e.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(e);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not Found"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      return next(e);
    });
};

const updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (e.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(e);
    });
};

module.exports = { createUser, getCurrentUser, login, updateCurrentUser };

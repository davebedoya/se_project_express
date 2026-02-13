const User = require("../models/user");
const jwt = require("jsonwebtoken"); // importing the jsonwebtoken module
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  CONFLICT_STATUS_CODE,
} = require("../utils/errors");

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Invalid email or password" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      // authentication error
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Internal server Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      name,
      avatar,
      email,
      password: hash, // adding the hash to the database
    })

      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password; // not being returned to the client
        res.status(201).send(userObj);
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res
            .status(CONFLICT_STATUS_CODE)
            .send({ message: "Email already exists" });
        }
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST_STATUS_CODE)
            .send({ message: "Invalid data" });
        }
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server." });
      })
  );
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: e.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

//TODO
const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { createUser, getCurrentUser, login, updateCurrentUser };

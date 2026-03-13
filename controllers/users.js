const jwt = require("jsonwebtoken"); // importing the jsonwebtoken module
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   NOT_FOUND_STATUS_CODE,
//   INTERNAL_SERVER_ERROR_STATUS_CODE,
//   UNAUTHORIZED_STATUS_CODE,
//   CONFLICT_STATUS_CODE,
// } = require("../utils/errors");

const UnauthorizedError = require("../errors/unauthorized-err");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   UNAUTHORIZED_STATUS_CODE,
// } = require("../utils/errors");

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res
    //   .status(BAD_REQUEST_STATUS_CODE)
    //   .send({ message: "Invalid email or password" });
    return next(new BadRequestError("Invalid email or password"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((e) => {
      // authentication error
      if (e.message === "Incorrect email or password") {
        // return res
        //   .status(UNAUTHORIZED_STATUS_CODE)
        //   .send({ message: err.message });
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "Internal server Error" });
      return next(e);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Validate BEFORE hashing so /signup never hangs and returns 400 for invalid input
  if (!email || !password) {
    // return res
    //   .status(BAD_REQUEST_STATUS_CODE)
    //   .send({ message: "Invalid data" });
    return next(new BadRequestError("Invalid data"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash, // store hash only
      })
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password; // never return the password hash
          res.status(201).send(userObj);
        })
        .catch((e) => {
          if (e.code === 11000) {
            // return res
            //   .status(CONFLICT_STATUS_CODE)
            //   .send({ message: "Email already exists" });
            return next(new ConflictError("Email already exists"));
          }
          if (e.name === "ValidationError") {
            // return res
            //   .status(BAD_REQUEST_STATUS_CODE)
            //   .send({ message: "Invalid data" });
            return next(new BadRequestError("Invalid data"));
          }
          // return res
          //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
          //   .send({ message: "An error has occurred on the server." });
          next(e);
        })
    )
    .catch((e) => {
      // If password is undefined, null, not a string, missing then throw an error
      if (e.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "An error has occurred on the server." });
      next(e);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "User not found" });
        return next(new NotFoundError("User not Found"));
      }
      if (e.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid ID" });
        return next(new BadRequestError("Invalid ID"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "An error has occurred on the server." });
      next(e);
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
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "User not found" });
        return next(new NotFoundError("User not found"));
      }
      if (e.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "An error has occurred on the server." });
      next(e);
    });
};

module.exports = { createUser, getCurrentUser, login, updateCurrentUser };

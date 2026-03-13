const ClothingItem = require("../models/clothingItems");
// const {
//   BAD_REQUEST_STATUS_CODE,
//   NOT_FOUND_STATUS_CODE,
//   INTERNAL_SERVER_ERROR_STATUS_CODE,
//   FORBIDDEN_STATUS_CODE,
// } = require("../utils/errors");

const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        //   return res
        //     .status(BAD_REQUEST_STATUS_CODE)
        //     .send({ message: "Invalid data" });
        // }
        return next(new BadRequestError("Invalid data"));
      }
      //   return res
      //     .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //     .send({ message: "An error has occurred on the server." });
      // });
      return next(e);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    // .catch(() =>
    //   res
    //     .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
    //     .send({ message: "An error has occurred on the server." })
    // );
    .catch(next);
};

const updateItem = (req, res, next) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    id,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid data" });
        return next(new BadRequestError("Invalid data"));
      }
      if (e.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid ID" });
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "Item not found" });
        return next(new NotFoundError("Item not found"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "An error has occurred on the server." });
      return next(e);
    });
};

const deleteItem = (req, res, next) => {
  const { id: itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        // return res
        //   .status(FORBIDDEN_STATUS_CODE)
        //   .send({ message: "Forbidden: you can only delete your own items" });
        return next(
          new ForbiddenError("Forbidden: you can only delete your own items")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(() => res.status(200).send(item));
    })
    .catch((e) => {
      if (e.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid ID" });
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "Item not found" });
        return next(new NotFoundError("Item not found"));
      }
      //   return res
      //     .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //     .send({ message: "An error has occurred on the server." });
      return next(e);
    });
};

const likeItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid ID" });
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "Item not found" });
        return next(new NotFoundError("Item not found"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "An error has occurred on the server." });
      return next(e);
    });
};

const unlikeItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        // return res
        //   .status(BAD_REQUEST_STATUS_CODE)
        //   .send({ message: "Invalid ID" });
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "Item not found" });
        return next(new NotFoundError("Item not found"));
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      //   .send({ message: "An error has occurred on the server." });
      return next(e);
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};

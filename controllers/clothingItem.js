const ClothingItem = require("../models/clothingItems");
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
        return next(new BadRequestError("Invalid data"));
      }
      return next(e);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
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
        return next(new BadRequestError("Invalid data"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
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
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
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
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
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
        return next(new BadRequestError("Invalid ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
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

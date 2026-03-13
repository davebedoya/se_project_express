const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// CRUD create, read, update, delete

// Read
router.get("/", getItems);

// Auth
router.use(auth);

// Create
// router.post("/", createItem);

router.post("/", validateClothingItemBody, createItem);

// Update
// router.put("/:id/likes", likeItem);
router.put("/:id/likes", validateId, likeItem);

// Delete
// router.delete("/:id", deleteItem);
// router.delete("/:id/likes", unlikeItem);

router.delete("/:id", validateId, deleteItem);
router.delete("/:id/likes", validateId, unlikeItem);

module.exports = router;

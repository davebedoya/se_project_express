const router = require("express").Router();
const auth = require("../middlewares/auth");

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
router.post("/", createItem);

// Update
router.put("/:id/likes", likeItem);

// Delete
router.delete("/:id", deleteItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;

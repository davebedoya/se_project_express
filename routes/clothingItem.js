const router = require("express").Router();

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// CRUD create, read, update, delete

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
// router.put("/:id", updateItem);
router.put("/:id/likes", likeItem);

// Delete
router.delete("/:id", deleteItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;

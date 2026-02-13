const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// CRUD create, read, update, delete

// Read
router.get("/", getItems);
router.use(auth);
// Create
router.post("/", createItem);
// Update
// router.put("/:id", updateItem);
router.put("/:id/likes", likeItem);

// Delete
router.delete("/:id", deleteItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;

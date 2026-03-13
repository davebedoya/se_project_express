const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const {
  validateLoginBody,
  validateUserBody,
} = require("../middlewares/validation");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

// router.post("/signin", login);
// router.post("/signup", createUser);
router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;

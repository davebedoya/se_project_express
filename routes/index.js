const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");
const { login, createUser } = require("../controllers/users");
const {
  validateLoginBody,
  validateUserBody,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-err");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);
module.exports = router;

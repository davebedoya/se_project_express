const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

// router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

// router.post("/", createUser);

// router.post("/signin", login);
// router.post("/signup", createUser);

module.exports = router;

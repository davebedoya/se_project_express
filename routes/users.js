const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateUserBody } = require("../middlewares/validation");

router.use(auth);

router.get("/me", getCurrentUser);
// router.patch("/me", updateCurrentUser);
router.patch("/me", validateUpdateUserBody, updateCurrentUser);

module.exports = router;

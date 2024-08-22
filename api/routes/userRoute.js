const { register, login, logout } = require("../controllers/userController");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/profile", profile);
router.post("/logout", logout);
// router.post("/upload-by-link", upload_by_link);

module.exports = router;

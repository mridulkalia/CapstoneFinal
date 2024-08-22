const { register, login, logout, getUserByEmail } = require("../controllers/userController");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/profile", profile);
router.post("/logout", logout);
// router.post("/upload-by-link", upload_by_link);
router.get('/user-by-email', getUserByEmail);


module.exports = router;

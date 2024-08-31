const express = require("express");
const router = express.Router();

const {
    register,
    resgisterWithUpload,
    login
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/register/upload", resgisterWithUpload);
router.post("/login", login);

module.exports = router;
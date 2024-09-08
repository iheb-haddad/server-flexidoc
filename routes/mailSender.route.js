const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();

const sendMail = require("../services/mailSender");

router.post("/", upload.single('file'), sendMail);

module.exports = router;
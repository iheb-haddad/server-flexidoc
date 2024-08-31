const express = require("express");
const router = express.Router();

const {
  getMemos,
  createMemo,
  updateMemo,
} = require("../controllers/memos.controller");

router.get("/", getMemos);
router.post("/", createMemo);
router.put("/:_id", updateMemo);

module.exports = router;

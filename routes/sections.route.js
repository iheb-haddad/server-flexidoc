const express = require("express");
const router = express.Router();

const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sections.controller");

router.get("/", getSections);
router.post("/", createSection);
router.put("/:_id", updateSection);
router.delete("/:_id", deleteSection);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  updateSectionsOrder
} = require("../controllers/sections.controller");

router.get("/", getSections);
router.post("/", createSection);
router.put("/:_id", updateSection);
router.delete("/:_id", deleteSection);
router.patch("/order", updateSectionsOrder);

module.exports = router;

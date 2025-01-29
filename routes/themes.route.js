const express = require("express");
const router = express.Router();

const {
    getThemes,
    getTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    verifyNameUniqueness
} = require("../controllers/theme.controller");

router.get("/", getThemes);
router.get("/:_id", getTheme);
router.post("/", createTheme);
router.put("/:_id", updateTheme);
router.delete("/:_id", deleteTheme);
router.post("/verifyNameUniqueness", verifyNameUniqueness);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    } = require("../controllers/languages.controller");

router.get("/", getLanguages);
router.post("/", createLanguage);
router.put("/:_id", updateLanguage);
router.delete("/:_id", deleteLanguage);

module.exports = router;
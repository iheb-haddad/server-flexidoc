const express = require("express");
const router = express.Router();

const {
    getSupportEmails,
    getSupportEmail,
    createSupportEmail,
    updateSupportEmail,
    deleteSupportEmail,
    } = require("../controllers/supportEmail.controller");

router.get("/", getSupportEmails);
router.get("/:idSubProject", getSupportEmail);
router.post("/", createSupportEmail);
router.put("/:_id", updateSupportEmail);
router.delete("/:_id", deleteSupportEmail);

module.exports = router;
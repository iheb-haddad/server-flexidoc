const express = require("express");
const router = express.Router();

const {
    getSmtpConfigurations,
    getSmtpConfiguration,
    createSmtpConfiguration,
    updateSmtpConfiguration,
    deleteSmtpConfiguration,
    } = require("../controllers/smtpConfiguration.controller");

router.get("/", getSmtpConfigurations);
router.get("/:idProject", getSmtpConfiguration);
router.post("/", createSmtpConfiguration);
router.put("/:_id", updateSmtpConfiguration);
router.delete("/:_id", deleteSmtpConfiguration);

module.exports = router;
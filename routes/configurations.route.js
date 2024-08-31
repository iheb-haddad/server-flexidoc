const express = require("express");
const router = express.Router();

const {
  getConfigurations,
  getConfigurationByProject,
  createConfiguration,
  createConfigurationWithUpload,
  updateConfiguration,
} = require("../controllers/configurations.controller");

router.get("/", getConfigurations);
router.get("/project/:idProject", getConfigurationByProject);
router.post("/", createConfiguration);
router.post("/upload", createConfigurationWithUpload);
router.put("/:_id", updateConfiguration);

module.exports = router;

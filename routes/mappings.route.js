const express = require("express");
const router = express.Router();

const {
  getMappings,
  getMappingsByUser,
  getMappingsByProject,
  getMappingsByParameters,
  createMapping,
  createMappingWithUpload,
  updateMapping,
  deleteMapping
} = require("../controllers/mappings.controller");

router.get("/", getMappings);
router.get("/user/:user", getMappingsByUser);
router.get("/project/:project", getMappingsByProject);
router.get("/parameters", getMappingsByParameters);
router.post("/", createMapping);
router.post("/upload", createMappingWithUpload);
router.put("/:_id", updateMapping);
router.delete("/:_id", deleteMapping);

module.exports = router;

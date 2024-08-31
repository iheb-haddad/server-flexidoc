const express = require("express");
const router = express.Router();

const {
  getSources,
  getSourcesByUser,
  getSourcesByProject,
  createSource,
  createSourceWithUpload,
  updateSource,
  deleteSource,
} = require("../controllers/sources.controller");

router.get("/", getSources);
router.get("/user/:user", getSourcesByUser);
router.get("/project/:project", getSourcesByProject);
router.post("/", createSource);
router.post("/upload", createSourceWithUpload);
router.put("/:_id", updateSource);
router.delete("/:_id", deleteSource);

module.exports = router;

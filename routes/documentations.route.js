const express = require("express");
const router = express.Router();
const {
  getDocumentations,
  getDocumentationsSafely,
  createDocumentation,
  createDocumentationWithUpload,
  updateDocumentation,
  resetConsultationNumber,
  deleteDocumentation,
} = require("../controllers/documentations.controller");

router.get("/", getDocumentations);
router.get("/:user", getDocumentationsSafely);
router.post("/", createDocumentation);
router.post("/upload", createDocumentationWithUpload);
router.put("/:_id", updateDocumentation);
router.put("/resetConsultationNumber/:_id", resetConsultationNumber);
router.delete("/:_id", deleteDocumentation);

module.exports = router;

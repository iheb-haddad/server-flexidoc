const express = require("express");
const router = express.Router();
const {
  getDocumentations,
  getDocumentationsSafely,
  getNbrConsultationOfDocuments,
  getNbrConsultationPerDate,
  createDocumentation,
  createDocumentationWithUpload,
  updateDocumentation,
  updateLastConsultation,
  resetConsultationNumber,
  deleteDocumentation,
  iheb
} = require("../controllers/documentations.controller");

router.get("/", getDocumentations);
router.get("/:user", getDocumentationsSafely);
router.get("/nbrConsultation/:user", getNbrConsultationOfDocuments);
router.get("/nbrConsultationPerDate/:user", getNbrConsultationPerDate);
router.post("/", createDocumentation);
router.post("/upload", createDocumentationWithUpload);
router.put("/:_id", updateDocumentation);
router.put("/updateLastConsultation/:_id", updateLastConsultation);
router.put("/resetConsultationNumber/:_id", resetConsultationNumber);
router.delete("/:_id", deleteDocumentation);

module.exports = router;

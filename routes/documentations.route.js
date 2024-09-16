const express = require("express");
const router = express.Router();
const {
  getDocumentations,
  getDocumentationsSafely,
  getDocumentationsSafelyWithDate,
  getNbrConsultationOfDocuments,
  getNbrConsultationPerDate,
  createDocumentation,
  createDocumentationWithUpload,
  addNewConsultation,
  updateDocumentation,
  resetConsultationNumber,
  deleteDocumentation
} = require("../controllers/documentations.controller");

router.get("/", getDocumentations);
router.get("/:user", getDocumentationsSafely);
router.get("/date/:user", getDocumentationsSafelyWithDate);
router.get("/nbrConsultation/:user", getNbrConsultationOfDocuments);
router.get("/nbrConsultationPerDate/:user", getNbrConsultationPerDate);
router.post("/", createDocumentation);
router.post("/upload", createDocumentationWithUpload);
router.put("/:_id", updateDocumentation);
router.put("/addConsultation/:_id", addNewConsultation);
router.put("/resetConsultationNumber/:_id", resetConsultationNumber);
router.delete("/:_id", deleteDocumentation);

module.exports = router;

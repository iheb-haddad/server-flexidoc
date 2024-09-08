const express = require("express");
const router = express.Router();

const {
    getConsultHistorics,
    getConsultHistoric,
    createConsultHistoric,
    getConsultHistoricsByDocumentation,
    getNbrConsultationGroupByConsultationDate,
    deleteConsultHistoric,
    deleteAllHistoricOfDocumentation
    } = require("../controllers/consultHistoric.controller");

router.get("/", getConsultHistorics);
router.get("/idConsult/:_id", getConsultHistoric);
router.post("/", createConsultHistoric);
router.get("/documentation/:idDocumentation", getConsultHistoricsByDocumentation);
router.get("/nbrConsultationGroupByConsultationDate", getNbrConsultationGroupByConsultationDate);
router.delete("/:_id", deleteConsultHistoric);
router.delete("/documentation/:idDocumentation", deleteAllHistoricOfDocumentation);

module.exports = router;
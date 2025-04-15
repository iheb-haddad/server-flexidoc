const ConsultHistoric = require("../models/conusltHistoric.model.js");
const Documentation = require("../models/documentation.model.js");
const moment = require("moment");
const requestIp = require('request-ip');

// Create and Save a new ConsultHistoric
const createConsultHistoric = async (req, res) => {
  const consultHistoric = req.body;
  const documentation = await Documentation.findOne({
    _id: consultHistoric.idDocumentation,
  });
  if (!documentation) {
    return res.status(404).json({ message: "Documentation not found" });
  }
  const clientIp = requestIp.getClientIp(req);
  
  consultHistoric.ipUser = clientIp === '::1' ? '127.0.0.1' : clientIp;
  consultHistoric.idDocumentation = documentation;
  const newConsultHistoric = new ConsultHistoric(consultHistoric);
  newConsultHistoric
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const getConsultHistorics = (req, res) => {
  ConsultHistoric.find()
    .populate("idDocumentation")
    .then((consultHistorics) => {
      res.send(consultHistorics);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const getConsultHistoric = (req, res) => {
  const id = req.params._id;
  ConsultHistoric.findOne({ _id: id })
    .populate("idDocumentation")
    .then((consultHistoric) => {
      if (!consultHistoric) {
        return res.status(404).json({ message: "ConsultHistoric not found" });
      }
      res.send(consultHistoric);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const getConsultHistoricsByDocumentation = (req, res) => {
  const idDocumentation = req.params.idDocumentation;
  ConsultHistoric.find({ idDocumentation: idDocumentation })
    .populate("idDocumentation")
    .then((consultHistorics) => {
      if (!consultHistorics) {
        return res.status(404).json({ message: "ConsultHistoric not found" });
      }
      res.send(consultHistorics);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const getConsultHistoricsByDocs = (req, res) => {
  const idsDocs = req.params.idsDocs.split(",");
  ConsultHistoric.find({ idDocumentation: { $in: idsDocs } })
    .populate("idDocumentation")
    .then((consultHistorics) => {
      if (!consultHistorics) {
        return res.status(404).json({ message: "ConsultHistoric not found" });
      }
      res.send(consultHistorics);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const deleteConsultHistoric = (req, res) => {
  const id = req.params._id;
  ConsultHistoric.findOneAndDelete
    .then((consultHistoric) => {
      if (!consultHistoric) {
        return res.status(404).json({ message: "ConsultHistoric not found" });
      }
      res.send({ message: "ConsultHistoric deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const deleteAllHistoricOfDocumentation = (req, res) => {
  const idDocumentation = req.params.idDocumentation;
  ConsultHistoric.deleteMany({ idDocumentation: idDocumentation })
    .then((consultHistorics) => {
      if (!consultHistorics) {
        return res.status(404).json({ message: "ConsultHistoric not found" });
      }
      res.send({ message: "ConsultHistoric deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = {
  createConsultHistoric,
  getConsultHistorics,
  getConsultHistoric,
  getConsultHistoricsByDocumentation,
  getConsultHistoricsByDocs,
  deleteConsultHistoric,
  deleteAllHistoricOfDocumentation,
};

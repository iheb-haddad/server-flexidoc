const SmtpConfiguration = require("../models/SmtpConfiguration.model");
const Project = require("../models/project.model");

const getSmtpConfigurations = async (req, res) => {
  const smtpConfigurations = await SmtpConfiguration.find().populate(
    "idProject"
  );
  res.send(smtpConfigurations);
};

const getSmtpConfiguration = async (req, res) => {
  const projectId = req.params.idProject;
  try {
    const smtpConfiguration = await SmtpConfiguration.findOne({
      idProject: projectId,
    });
    res.status(200).json(smtpConfiguration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSmtpConfiguration = async (req, res) => {
  const smtpConfiguration = req.body;

  const project = await Project.findOne({ _id: smtpConfiguration.idProject });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }

  try {
    smtpConfiguration.idProject = project;
    const newSmtpConfiguration = new SmtpConfiguration(smtpConfiguration);
    await newSmtpConfiguration.save();
    res.status(201).json(newSmtpConfiguration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSmtpConfiguration = async (req, res) => {
  const _id = req.params._id;
  const smtpConfiguration = req.body;

  const project = await Project.findOne({ _id: smtpConfiguration.idProject });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }
  try {
    smtpConfiguration.idProject = project;
    await SmtpConfiguration.findByIdAndUpdate(_id, smtpConfiguration);
    res
      .status(200)
      .json({ message: "Smtp Configuration updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSmtpConfiguration = async (req, res) => {
  const _id = req.params._id;
  try {
    await SmtpConfiguration.findByIdAndDelete(_id);
    res
      .status(200)
      .json({ message: "Smtp Configuration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSmtpConfigurations,
  getSmtpConfiguration,
  createSmtpConfiguration,
  updateSmtpConfiguration,
  deleteSmtpConfiguration,
};

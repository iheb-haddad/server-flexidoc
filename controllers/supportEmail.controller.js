const SupportEmail = require("../models/SupportEmail.model");
const Project = require("../models/project.model");
const SubProject = require("../models/subProject.model");

const getSupportEmails = async (req, res) => {
  const supportEmails = await SupportEmail.find()
    .populate("idProject")
    .populate("idSubProject");
  res.send(supportEmails);
};

const getSupportEmail = async (req, res) => {
  const subProjectId = req.params.idSubProject;
  try {
    const supportEmail = await SupportEmail.findOne({
      idSubProject: subProjectId,
    });
    res.status(200).json(supportEmail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSupportEmail = async (req, res) => {
  const supportEmail = req.body;

  const project = await Project.findOne({ _id: supportEmail.idProject });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }
  const subProject = await SubProject.findOne({
    _id: supportEmail.idSubProject,
  });
  if (!subProject) {
    return res.status(404).json({ message: "Project not found" });
  }

  try {
    supportEmail.idProject = project;
    supportEmail.idSubProject = subProject;
    const newSupportEmail = new SupportEmail(supportEmail);
    await newSupportEmail.save();
    res.status(201).json(newSupportEmail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSupportEmail = async (req, res) => {
  const _id = req.params._id;
  const supportEmail = req.body;

  const project = await Project.findOne({ _id: supportEmail.idProject });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }
  const subProject = await SubProject.findOne({
    _id: supportEmail.idSubProject,
  });
  if (!subProject) {
    return res.status(404).json({ message: "Project not found" });
  }
  try {
    supportEmail.idProject = project;
    supportEmail.idSubProject = subProject;
    await SupportEmail.findByIdAndUpdate(_id, supportEmail);
    res.status(200).json({ message: "Support Email updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSupportEmail = async (req, res) => {
  const _id = req.params._id;
  try {
    await SupportEmail.findByIdAndDelete(_id);
    res.status(200).json({ message: "Support Email deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSupportEmails,
  getSupportEmail,
  createSupportEmail,
  updateSupportEmail,
  deleteSupportEmail,
};

const Configuration = require("../models/configuration.model");
const Project = require("../models/project.model");

const getConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.find();
    res.send(configurations);
  } catch (error) {
    res.status(500).json({ message: "Error getting configurations" });
  }
};

const getConfigurationByProject = async (req, res) => {
  const idProject = req.params.idProject;
  const configuration = await Configuration.findOne({
    idProject: idProject,
  }).populate("idProject");
  if (!configuration) {
    return res.status(404).json({ message: "Configuration not found" });
  }
  res.send(configuration);
};

const createConfiguration = async (req, res) => {
  const conf = req.body;
  const existingConfiguration = await Configuration.findOne({
    idProject: conf.idProject,
  });
  if (existingConfiguration) {
    return res
      .status(400)
      .json({ error: "Configuration of this client all ready set" });
  }
  const project = await Project.findOne({ _id: conf.idProject });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }
  conf.idProject = project;
  await Configuration.create(conf)
    .then((result) => {
      res.status(201).json({ message: "conf created" });
    })
    .catch((err) => {
      res.status(500).send();
    });
};

const createConfigurationWithUpload = async (req, res) => {
  const conf = req.body;

  const project = await Project.findOne({ name: conf.client });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }

  const existingConfiguration = await Configuration.findOne({
    idProject: project._id,
  });

  if (existingConfiguration) {
    return res
      .status(400)
      .json({ error: "Configuration of this client all ready set" });
  }

  conf.idProject = project;
  await Configuration.create(conf)
    .then((result) => {
      res.status(201).json({ message: "conf created" });
    })
    .catch((err) => {
      res.status(500).send();
    });
};

const updateConfiguration = async (req, res) => {
  const updates = req.body;
  const id = req.params._id;
  await Configuration.findByIdAndUpdate(id, updates)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getConfigurations,
  getConfigurationByProject,
  createConfiguration,
  createConfigurationWithUpload,
  updateConfiguration,
};

const Source = require("../models/source.model");
const Mapping = require("../models/mapping.model");
const SubProject = require("../models/subProject.model");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Documentation = require("../models/documentation.model");
const getSubProjectsManagedByUser = require("./additionalControllers").getSubProjectsManagedByUser;

const getSources = async (req, res) => {
  try {
    const sources = await Source.find()
      .populate("idProject")
      .populate("idSubProject");
    res.send(sources);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

const getSourcesByUser = async (req, res) => {
  const userId = req.params.user;
  const user = await User.findOne({ _id: userId });
  if (user) {
    if (user.role === "admin") {
      const sources = await Source.find()
        .populate("idProject")
        .populate("idSubProject");
      res.send(sources);
    } else if (user.role === "user") {
      const subProjects = await getSubProjectsManagedByUser(userId);
      const sources = await Source.find({ idSubProject: { $in: subProjects } })
        .populate("idProject")
        .populate("idSubProject");
      res.send(sources);
    }
  }
};

const getSourcesByProject = async (req, res) => {
  const projectId = req.params.project;
  const sources = await Source.find({ idProject : projectId })
    .populate("idProject")
    .populate("idSubProject");
  res.send(sources);
}

const createSource = async (req, res) => {
  const source = req.body;

  const project = await Project.findOne({ _id: source.idProject });
  if (!project) {
    return res.status(404).json({message : "Project not found"});
  }

  const subProject = await SubProject.findOne({ _id: source.idSubProject , idProject: project._id});
  if (!subProject) {
    return res.status(404).json({message : "subProject not found"});
  }

  const existingSource = await Source.findOne({ name: source.name, idSubProject: source.idSubProject });
  if (existingSource) {
    return res.status(400).json({message : "Source with this name already exists under this subProject"});
  }

  source.idProject = project;
  source.idSubProject = subProject;
  const newSource = await Source.create(source);
  res.status(201).send(newSource);
};

const createSourceWithUpload = async (req, res) => {
  const source = req.body;

  const project = await Project.findOne({ name: source.project });
  if (!project) {
    return res.status(404).json({message : "Project not found"});
  }

  const subProject = await SubProject.findOne({ name: source.subProject , idProject: project._id});
  if (!subProject) {
    return res.status(404).json({message : "subProject not found"});
  }

  const existingSource = await Source.findOne({ name: source.name, idSubProject: subProject._id });
  if (existingSource) {
    return res.status(400).json({message : "Source with this name already exists under this subProject"});
  }

  source.idProject = project;
  source.idSubProject = subProject;
  const newSource = await Source.create(source);
  res.status(201).send(newSource);
}

const updateSource = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;

  const project = await Project.findOne({ _id: updates.idProject });
  if (!project) {
    return res.status(404).json({message : "Project not found"});
  }

  const subProject = await SubProject.findOne({ _id: updates.idSubProject , idProject: project._id});
  if (!subProject) {
    return res.status(404).json({message : "subProject not found"});
  }

  const existingSource = await Source.findOne({ name: updates.name, idSubProject: updates.idSubProject , _id: { $ne: _id } });
  if (existingSource) {
    return res.status(400).json({message : "Source with this name already exists under this subProject"});
  }

  updates.idProject = project;
  updates.idSubProject = subProject;

  const updatedSource = await Source.updateOne({ _id: _id }, updates);
  res.status(201).send(updatedSource);
};

const deleteSource = async (req, res) => {
  const _id = req.params._id;
  await Source.deleteOne({ _id: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
  await Mapping.deleteMany({ idSource: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
};

module.exports = {
  getSources,
  getSourcesByUser,
  getSourcesByProject,
  createSource,
  createSourceWithUpload,
  updateSource,
  deleteSource,
};

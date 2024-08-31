const Mapping = require("../models/mapping.model");
const Section = require("../models/section.model");
const Source = require("../models/source.model");
const Documentation = require("../models/documentation.model");
const SubProject = require("../models/subProject.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const getSubProjectsManagedByUser = require("./additionalControllers").getSubProjectsManagedByUser;

const getMappings = async (req, res) => {
  try {
    const mappings = await Mapping.find()
      .populate("idProject")
      .populate("idSubProject")
      .populate("idDocument")
      .populate("idSource")
      .populate("idSection");
    res.send(mappings);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

const getMappingsByUser = async (req, res) => {
  const userId = req.params.user;
  const user = await User.findOne({ _id: userId });
  if(user){
  if(user.role === "admin"){
    try {
      const mappings = await Mapping.find()
        .populate("idProject")
        .populate("idSubProject")
        .populate("idDocument")
        .populate("idSource")
        .populate("idSection");
      res.send(mappings);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }else if(user.role === "user"){
    try {
      const subProjects = await getSubProjectsManagedByUser(userId);
      const mappings = await Mapping.find({ idSubProject: { $in: subProjects } })
        .populate("idProject")
        .populate("idSubProject")
        .populate("idDocument")
        .populate("idSource")
        .populate("idSection");
      res.send(mappings);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  }
}
};

const getMappingsByProject = async (req, res) => {
  const projectId = req.params.project;
  const mappings = await Mapping.find({ idProject : projectId})
    .populate("idProject")
    .populate("idSubProject")
    .populate("idDocument")
    .populate("idSource")
    .populate("idSection");
  res.send(mappings);
}

const  checkIfSourcesExistInUrl =(currentUrl, sourceList) =>{
  const sourcePattern = sourceList.map((source) => source.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*');
  const regex = new RegExp(sourcePattern, 'i'); // 'i' flag for case-insensitive matching

  return regex.test(currentUrl);
}

const getMappingsByParameters = async (req, res) => {
  const projectId = req.query.idProject;
  const currentUrl = req.query.currentURL;

  const allMappings = await Mapping.find({ idProject : projectId})
    .populate("idProject")
    .populate("idSubProject")
    .populate("idDocument")
    .populate("idSource")
    .populate("idSection");
  const mappings = allMappings.filter(mapping => checkIfSourcesExistInUrl(currentUrl, mapping.idSource.keywords) && mapping.idDocument.status === "public");
  res.send(mappings);
}

const createMapping = async (req, res) => {
  let mapping = req.body;

  const project = await Project.findOne({ _id: mapping.idProject });
  if (!project) {
    res.status(404).json({ message: "Projet non reconnu" });
    return;
  }

  const subProject = await SubProject.findOne({ _id: mapping.idSubProject });
  if (!subProject) {
    res.status(404).json({ message: "Sous-projet non reconnu" });
    return;
  }

  const document = await Documentation.findOne({ _id: mapping.idDocument });
  if (!document) {
    res.status(404).json({ message: "Document non reconnu" });
    return;
  }
  const source = await Source.findOne({ _id: mapping.idSource });
  if (!source) {
    res.status(404).json({ message: "Source non reconnue" });
    return;
  }
  const section = await Section.findOne({ _id: mapping.idSection });
  if (!section) {
    res.status(404).json({ message: "Section non reconnu" });
    return;
  }

  mapping.idProject = project;
  mapping.idSubProject = subProject;
  mapping.idDocument = document;
  mapping.idSource = source;
  mapping.idSection = section;

    try {
      await Mapping.create(mapping);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "error with adding mapping" });
    }
};

const createMappingWithUpload = async (req, res) => {
  let mapping = req.body;

  const project = await Project.findOne({ name: mapping.project });
  if (!project) {
    res.status(404).json({ message: "Projet non reconnu" });
    return;
  }

  const subProject = await SubProject.findOne({ name: mapping.subProject, idProject: project._id });
  if (!subProject) {
    res.status(404).json({ message: "Sous-projet non reconnu" });
    return;
  }

  const document = await Documentation.findOne({ title: mapping.document , idSubProject: subProject._id});
  if (!document) {
    res.status(404).json({ message: "Document non reconnu" });
    return;
  }
  const source = await Source.findOne({ name: mapping.source , idProject: project._id});
  if (!source) {
    res.status(404).json({ message: "Source non reconnue" });
    return;
  }
  const section = await Section.findOne({ titleFr: mapping.section });
  if (!section) {
    res.status(404).json({ message: "Section non reconnu" });
    return;
  }

  const existingMapping = await Mapping.findOne({ idDocument: document._id, idSource: source._id, idSection: section._id });

  if (existingMapping) {
    res.status(400).json({ message: "Ce mapping existe déjà" });
    return;
  }

  mapping.idProject = project;
  mapping.idSubProject = subProject;
  mapping.idDocument = document;
  mapping.idSource = source;
  mapping.idSection = section;

    try {
      await Mapping.create(mapping);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "error with adding mapping" });
    }
}

const updateMapping = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;
  try {
    const result = await Mapping.findByIdAndUpdate(_id, updates);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

const deleteMapping = async (req, res) => {
  const _id = req.params._id;
  try {
    await Mapping.deleteOne({ _id: _id });
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = {
  getMappings,
  getMappingsByUser,
  getMappingsByProject,
  getMappingsByParameters,
  createMapping,
  createMappingWithUpload,
  updateMapping,
  deleteMapping
};

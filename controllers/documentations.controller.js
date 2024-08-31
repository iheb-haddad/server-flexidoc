const Documentation = require("../models/documentation.model");
const Mapping = require("../models/mapping.model");
const SubProject = require("../models/subProject.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const getSubProjectsManagedByUser = require("./additionalControllers").getSubProjectsManagedByUser;
const moment = require('moment');

const getDocumentations = async (req, res) => {
  try {
    const result = await Documentation.find()
      .populate("idProject")
      .populate("idSubProject");
    res.send(result);
  }
  catch (err) {
    console.log(err);
  }
};

const getDocumentationsSafely = async (req, res) => {
  const userId = req.params.user;
  const user = await User.findOne({ _id: userId });
  if(user){
    if(user.role === "admin"){
      try {
        const result = await Documentation.find()
          .populate("idProject")
          .populate("idSubProject");
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    }else if(user.role === "user"){
      try {
        const subProjects = await getSubProjectsManagedByUser(userId);
        const documents = await Documentation.find({ idSubProject: { $in: subProjects } })
          .populate("idProject")
          .populate("idSubProject");
        res.send(documents);
      } catch (err) {
        console.log(err);
      }
    }
  } 
};

const createDocumentation = async (req, res) => {
  const doc = req.body;

  const project = await Project.findOne({ _id: doc.idProject });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const subProject = await SubProject.findOne({ _id: doc.idSubProject , idProject: project._id});
  if (!subProject) {
    return res.status(404).json({message : "subProject not found"}); 
  }

  const document = await Documentation.findOne({ title : doc.title , idSubProject : doc.idSubProject});
  if(document){
    return res.status(400).json({message : "document with this title already exists under this subProject"});
  }

  doc.idProject = project;
  doc.idSubProject = subProject;
  doc.expiration = doc.expiration === "null" ? null : doc.expiration;
  if(doc.expiration !== '' && doc.expiration !== null){
    try {
    doc.expiration = moment(doc.expiration).format("YYYY-MM-DD");
    if (moment(doc.expiration).isBefore(moment(), "day")) {
      doc.status = "expiré";
    }
  } catch (err) {
    res.status(403).json({ message: "error with expiration format" + err });
  }
  }  
  try {
    await Documentation.create(doc);
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ message: "error with adding documentation" + err });
  }
};

const createDocumentationWithUpload = async (req, res) => {
  const doc = req.body;

  const project = await Project.findOne({ name: doc.project });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const subProject = await SubProject.findOne({ name: doc.subProject , idProject: project._id});
  if (!subProject) {
    return res.status(404).json({ message: "subProject not found" });
  }

  const document = await Documentation.findOne({ title : doc.title , idSubProject : doc.subProject});
  if(document){
    return res.status(400).json({message : "document with this title already exists under this subProject"});
  }

  doc.idProject = project;
  doc.idSubProject = subProject;
  doc.expiration = doc.expiration === "null" ? null : doc.expiration;
  if(doc.expiration !== '' && doc.expiration !== null){
    try {
    doc.expiration = moment(doc.expiration).format("YYYY-MM-DD");
    if (moment(doc.expiration).isBefore(moment(), "day")) {
      doc.status = "expiré";
    }
  } catch (err) {
    res.status(403).json({ message: "error with expiration format" + err });
  }
  }
  try {
    await Documentation.create(doc);
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ message: "error with adding documentation" + err });
  }
}

const updateDocumentation = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;

  const project = await Project.findOne({ _id: updates.idProject });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const subProject = await SubProject.findOne({ _id: updates.idSubProject , idProject: project._id});
  if (!subProject) {
    return res.status(404).json({ message: "subProject not found" });
  }

  const document = await Documentation.findOne({ title : updates.title , idSubProject : updates.idSubProject , _id: { $ne: _id }});
  if(document){
    return res.status(400).json({message : "document with this title already exists under this subProject"});
  }

  updates.idProject = project;
  updates.idSubProject = subProject;
  updates.expiration = updates.expiration === "null" ? null : updates.expiration;
  if(updates.expiration !== '' && updates.expiration !== null){
    try {
    updates.expiration = moment(updates.expiration).format("YYYY-MM-DD");
    if (moment(updates.expiration).isBefore(moment(), "day")) {
      updates.status = "expiré";
    }
  } catch {
    return res.status(403).json({ message: "error with expiration format" });
  }
  }  

  try {
		const result = await Documentation.updateOne({_id : _id}, updates)
		res.status(200).json(result)
	} catch {
		return res.status(500).json({ message: "error with updating documentation" });
	}
};

const resetConsultationNumber = async (req, res) => {
  const _id = req.params._id;
  try {
    await Documentation.updateOne({ _id: _id}, {consultationNumber: 0 , lastConsultation: ''});
    res.status(200).send();
  }
  catch {
    res.status(500).send();
  }
}

const deleteDocumentation = async (req, res) => {
  const _id = req.params._id;
  //deleting the document
  await Documentation.deleteOne({ _id: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
  //deleting the mapping
  await Mapping.deleteMany({ idDocument: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
};

module.exports = {
  getDocumentations,
  getDocumentationsSafely,
  createDocumentation,
  createDocumentationWithUpload,
  updateDocumentation,
  resetConsultationNumber,
  deleteDocumentation,
};

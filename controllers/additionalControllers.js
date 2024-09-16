const User = require("../models/user.model");
const SubProject = require("../models/subProject.model");
const Documentation = require("../models/documentation.model");
const Project = require("../models/project.model");
const moment = require("moment");

const getProjectsManagedByUser = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .populate("projects")
    .populate("subProjects");
  if (user) {
    if (user.role === "admin") {
      try {
        const result = await Project.find();
        return result;
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      try {
        const projectsManaged = user.projects.filter(
          (project) =>
            !user.subProjects.some(
              (subProject) =>
                subProject.idProject.toString() === project._id.toString()
            )
        );
        return projectsManaged;
      } catch (err) {
        console.log(err);
      }
    }
  }
};

const getSubProjectsManagedByUser = async (userId) => {
  let user;
  try {
    user = await User.findOne({ _id: userId }).populate("subProjects");
  } catch (err) {
    console.log(err);
    return;
  }
  if (user) {
    const subProjects = await SubProject.find().populate("idProject");
    if (user.role === "admin") {
      try {
        return subProjects;
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      const userSubprojects = user.subProjects;
      const projectsManaged = await getProjectsManagedByUser(userId);
      const subProjectsUnderUserProjects = await SubProject.find({
        idProject: { $in: projectsManaged },
      }).populate("idProject");
      const allSubProjects = [
        ...userSubprojects,
        ...subProjectsUnderUserProjects,
      ];
      return allSubProjects;
    }
  }
};

const getDocumentationsSafely = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (user) {
    if (user.role === "admin") {
      try {
        const result = await Documentation.find().populate("idSubProject");
        return result;
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      try {
        const subProjects = await getSubProjectsManagedByUser(userId);
        const documents = await Documentation.find({
          idSubProject: { $in: subProjects },
        }).populate("idSubProject");
        return documents;
      } catch (err) {
        console.log(err);
      }
    }
  }
};

const createDocumentation = async (doc) => {
  const project = await Project.findOne({ _id: doc.idProject });
  if (!project) {
    return false;
  }

  const subProject = await SubProject.findOne({
    _id: doc.idSubProject,
    idProject: project._id,
  });
  if (!subProject) {
    return false;
  }

  const document = await Documentation.findOne({
    title: doc.title,
    idSubProject: doc.idSubProject,
  });
  if (document) {
    return false;
  }

  doc.idProject = project;
  doc.idSubProject = subProject;
  doc.expiration = doc.expiration === "null" ? null : doc.expiration;
  doc.isError = true;
  if (doc.expiration !== "" && doc.expiration !== null) {
    try {
      doc.expiration = moment(doc.expiration).format("YYYY-MM-DD");
      if (moment(doc.expiration).isBefore(moment(), "day")) {
        doc.status = "expiré";
      }
    } catch (err) {
      return false;
    }
  }
  try {
    const newDocument = await Documentation.create(doc);
    return newDocument;
  } catch (err) {
    return false;
  }
};

const createDocumentationWithUpload = async (doc) => {
  const project = await Project.findOne({ name: doc.project });
  if (!project) {
    return false;
  }

  const subProject = await SubProject.findOne({
    name: doc.subProject,
    idProject: project._id,
  });
  if (!subProject) {
    return false;
  }

  const document = await Documentation.findOne({
    title: doc.title,
    idSubProject: subProject._id,
  });
  if (document) {
    return false;
  }

  doc.idProject = project;
  doc.idSubProject = subProject;
  doc.isError = true;
  doc.expiration = doc.expiration === "null" ? null : doc.expiration;
  if (doc.expiration !== "" && doc.expiration !== null) {
    try {
      doc.expiration = moment(doc.expiration).format("YYYY-MM-DD");
      if (moment(doc.expiration).isBefore(moment(), "day")) {
        doc.status = "expiré";
      }
    } catch (err) {
      return false;
    }
  }
  try {
    const newDoc = await Documentation.create(doc);
    return newDoc;
  } catch (err) {
    return false;
  }
};

module.exports = {
  getSubProjectsManagedByUser,
  getDocumentationsSafely,
  getProjectsManagedByUser,
  createDocumentation,
  createDocumentationWithUpload,
};

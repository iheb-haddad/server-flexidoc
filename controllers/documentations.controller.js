const Documentation = require("../models/documentation.model");
const Mapping = require("../models/mapping.model");
const SubProject = require("../models/subProject.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const getSubProjectsManagedByUser =
  require("./additionalControllers").getSubProjectsManagedByUser;
const moment = require("moment");
const ConsultHistoric = require("../models/conusltHistoric.model");
const { getProjectsManagedByUser } = require("./additionalControllers");

const getDocumentations = async (req, res) => {
  try {
    const result = await Documentation.find({ isError: false })
      .populate("idProject")
      .populate("idSubProject");
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getDocumentationsSafely = async (req, res) => {
  const userId = req.params.user;
  const user = await User.findOne({ _id: userId });
  if (user) {
    if (user.role === "admin") {
      try {
        const result = await Documentation.find({ isError: false })
          .populate("idProject")
          .populate("idSubProject");
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      try {
        const subProjects = await getSubProjectsManagedByUser(userId);
        const documents = await Documentation.find({
          idSubProject: { $in: subProjects },
          isError: false,
        })
          .populate("idProject")
          .populate("idSubProject");
        res.send(documents);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
const getDocumentationsSafelyWithDate = async (req, res) => {
  const userId = req.params.user;
  const user = await User.findOne({ _id: userId });
  const fromCreationDate = req.query.fromCreationDate;
  const toCreationDate = req.query.toCreationDate;
  const fromConsultationDate = req.query.fromConsultationDate;
  const toConsultationDate = req.query.toConsultationDate;
  if (user) {
    if (user.role === "admin") {
      try {
        const result = await Documentation.find({
          isError: false,
          createdAt: { $gte: fromCreationDate, $lte: toCreationDate },
          lastConsultation: {
            $gte: fromConsultationDate,
            $lte: toConsultationDate,
          },
        })
          .populate("idProject")
          .populate("idSubProject");
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      try {
        const subProjects = await getSubProjectsManagedByUser(userId);
        const documents = await Documentation.find({
          idSubProject: { $in: subProjects },
          isError: false,
          createdAt: { $gte: fromCreationDate, $lte: toCreationDate },
          lastConsultation: {
            $gte: fromConsultationDate,
            $lte: toConsultationDate,
          },
        })
          .populate("idProject")
          .populate("idSubProject");
        res.send(documents);
      } catch (err) {
        console.log(err);
      }
    }
  }
};

const getNbrConsultationOfDocuments = async (req, res) => {
  const userId = req.params.user;
  const projectId = req.query.idProject;
  const subProjectId = req.query.idSubProject;
  const sourceId = req.query.idSource;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const user = await User.findOne({ _id: userId });
  if (user) {
    if (user.role === "admin") {
      try {
        const result = await Documentation.find()
          .populate("idProject")
          .populate("idSubProject");
        const filtredDocs = sourceId
          ? mappings
              .filter(
                (mapping) =>
                  mapping.idDocument.consultationNumber > 0 &&
                  mapping.idSource._id == sourceId
              )
              .map((mapping) => mapping.idDocument)
          : subProjectId
          ? result.filter(
              (doc) =>
                doc.consultationNumber > 0 &&
                doc.idSubProject._id == subProjectId
            )
          : projectId
          ? result.filter(
              (doc) =>
                doc.consultationNumber > 0 && doc.idProject._id == projectId
            )
          : result.filter((doc) => doc.consultationNumber > 0);
        if (fromDate === "" || toDate === "") {
          const docs = filtredDocs.map((doc, index) => {
            return {
              _id: doc._id,
              title: doc.title,
              consultationNumber: doc.consultationNumber,
              fill:
                filtredDocs.length % 10 === 1 &&
                index === filtredDocs.length - 1
                  ? `hsl(var(--chart-${(index % 10) + 2}))`
                  : `hsl(var(--chart-${(index % 10) + 1}))`,
            };
          });
          res.send(docs);
        } else {
          const historic = await ConsultHistoric.find({
            date: { $gte: fromDate, $lte: toDate },
          });
          const docs = filtredDocs.map((doc, index) => {
            return {
              _id: doc._id,
              title: doc.title,
              consultationNumber: historic.filter(
                (hist) => hist.idDocumentation.toString() == doc._id.toString()
              ).length,
              fill:
                filtredDocs.length % 10 === 1 &&
                index === filtredDocs.length - 1
                  ? `hsl(var(--chart-${(index % 10) + 2}))`
                  : `hsl(var(--chart-${(index % 10) + 1}))`,
            };
          });
          res.send(docs);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      try {
        const projects = await getProjectsManagedByUser(userId);
        const subProjects = await getSubProjectsManagedByUser(userId);
        const documents =
          subProjectId && !sourceId
            ? await Documentation.find({
                idSubProject: { $in: subProjects },
              })
                .populate("idProject")
                .populate("idSubProject")
            : !sourceId
            ? await Documentation.find({
                idProject: { $in: projects },
              })
                .populate("idProject")
                .populate("idSubProject")
            : [];

        const mappings = sourceId
          ? await Mapping.find().populate("idSource").populate("idDocument")
          : [];
        const filtredDocs = sourceId
          ? mappings
              .filter(
                (mapping) =>
                  mapping.idDocument.consultationNumber > 0 &&
                  mapping.idSource._id == sourceId
              )
              .map((mapping) => mapping.idDocument)
          : subProjectId
          ? documents.filter(
              (doc) =>
                doc.consultationNumber > 0 &&
                doc.idSubProject._id == subProjectId
            )
          : projectId
          ? documents.filter(
              (doc) =>
                doc.consultationNumber > 0 && doc.idProject._id == projectId
            )
          : documents.filter((doc) => doc.consultationNumber > 0);
        if (fromDate === "" || toDate === "") {
          const docs = filtredDocs.map((doc, index) => {
            return {
              _id: doc._id,
              title: doc.title,
              consultationNumber: doc.consultationNumber,
              fill:
                filtredDocs.length % 10 === 1 &&
                index === filtredDocs.length - 1
                  ? `hsl(var(--chart-${(index % 10) + 2}))`
                  : `hsl(var(--chart-${(index % 10) + 1}))`,
            };
          });
          res.send(docs);
        } else {
          const historic = await ConsultHistoric.find({
            date: { $gte: fromDate, $lte: toDate },
          });
          const docs = filtredDocs.map((doc, index) => {
            return {
              _id: doc._id,
              title: doc.title,
              consultationNumber: historic.filter(
                (hist) => hist.idDocumentation.toString() == doc._id.toString()
              ).length,
              fill:
                filtredDocs.length % 10 === 1 &&
                index === filtredDocs.length - 1
                  ? `hsl(var(--chart-${(index % 10) + 2}))`
                  : `hsl(var(--chart-${(index % 10) + 1}))`,
            };
          });
          res.send(docs);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};

const getNbrConsultationPerDate = async (req, res) => {
  const userId = req.params.user;
  const projectId = req.query.idProject;
  const subProjectId = req.query.idSubProject;
  const sourceId = req.query.idSource;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const user = await User.findOne({ _id: userId });
  if (user) {
    if (user.role === "admin") {
      try {
        const result = !sourceId
          ? await Documentation.find()
              .populate("idProject")
              .populate("idSubProject")
          : [];

        const mappings = sourceId
          ? await Mapping.find().populate("idSource").populate("idDocument")
          : [];

        const filtredDocs = sourceId
          ? mappings
              .filter(
                (mapping) =>
                  mapping.idDocument.consultationNumber > 0 &&
                  mapping.idSource._id == sourceId
              )
              .map((mapping) => mapping.idDocument)
          : subProjectId
          ? result.filter(
              (doc) =>
                doc.consultationNumber > 0 &&
                doc.idSubProject._id == subProjectId
            )
          : projectId
          ? result.filter(
              (doc) =>
                doc.consultationNumber > 0 && doc.idProject._id == projectId
            )
          : result.filter((doc) => doc.consultationNumber > 0);
        if (fromDate === "" || toDate === "") {
          const historic = await ConsultHistoric.find({
            idDocumentation: { $in: filtredDocs.map((doc) => doc._id) },
          });
          const aggregatedHistoric = historic.reduce((acc, hist) => {
            const date = moment(hist.date).format("YYYY-MM-DD");
            if (acc[date]) {
              acc[date] += 1;
            } else {
              acc[date] = 1;
            }
            return acc;
          }, {});
          const finalResult = aggregatedHistoric
            ? Object.keys(aggregatedHistoric).map((key) => {
                return { date: key, nbrConsultation: aggregatedHistoric[key] };
              })
            : [];
          res.send(finalResult);
        } else {
          const historic = await ConsultHistoric.find({
            idDocumentation: { $in: filtredDocs.map((doc) => doc._id) },
          });
          const aggregatedHistoric = historic.reduce((acc, hist) => {
            const date = moment(hist.date).format("YYYY-MM-DD");
            if (acc[date]) {
              acc[date] += 1;
            } else {
              acc[date] = 1;
            }
            return acc;
          }, {});
          const finalResult = aggregatedHistoric
            ? Object.keys(aggregatedHistoric).map((key) => {
                return { date: key, nbrConsultation: aggregatedHistoric[key] };
              })
            : [];
          const filtredResult = finalResult.filter((result) =>
            moment(result.date).isBetween(fromDate, toDate, "day", "[]")
          );
          res.send(filtredResult);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (user.role === "user") {
      try {
        const projects = await getProjectsManagedByUser(userId);
        const subProjects = await getSubProjectsManagedByUser(userId);
        const documents =
          subProjectId && !sourceId
            ? await Documentation.find({
                idSubProject: { $in: subProjects },
              })
                .populate("idProject")
                .populate("idSubProject")
            : !sourceId
            ? await Documentation.find({
                idProject: { $in: projects },
              })
                .populate("idProject")
                .populate("idSubProject")
            : [];

        const mappings = sourceId
          ? await Mapping.find().populate("idSource").populate("idDocument")
          : [];

        const filtredDocs = sourceId
          ? mappings
              .filter(
                (mapping) =>
                  mapping.idDocument.consultationNumber > 0 &&
                  mapping.idSource._id == sourceId
              )
              .map((mapping) => mapping.idDocument)
          : subProjectId
          ? documents.filter(
              (doc) =>
                doc.consultationNumber > 0 &&
                doc.idSubProject._id == subProjectId
            )
          : projectId
          ? documents.filter(
              (doc) =>
                doc.consultationNumber > 0 && doc.idProject._id == projectId
            )
          : documents.filter((doc) => doc.consultationNumber > 0);
        if (fromDate === "" || toDate === "") {
          const historic = await ConsultHistoric.find({
            idDocumentation: { $in: filtredDocs.map((doc) => doc._id) },
          });
          const aggregatedHistoric = historic.reduce((acc, hist) => {
            const date = moment(hist.date).format("YYYY-MM-DD");
            if (acc[date]) {
              acc[date] += 1;
            } else {
              acc[date] = 1;
            }
            return acc;
          }, {});
          const finalResult = aggregatedHistoric
            ? Object.keys(aggregatedHistoric).map((key) => {
                return { date: key, nbrConsultation: aggregatedHistoric[key] };
              })
            : [];
          res.send(finalResult);
        } else {
          const historic = await ConsultHistoric.find({
            idDocumentation: { $in: filtredDocs.map((doc) => doc._id) },
          });
          const aggregatedHistoric = historic.reduce((acc, hist) => {
            const date = moment(hist.date).format("YYYY-MM-DD");
            if (acc[date]) {
              acc[date] += 1;
            } else {
              acc[date] = 1;
            }
            return acc;
          }, {});
          const finalResult = aggregatedHistoric
            ? Object.keys(aggregatedHistoric).map((key) => {
                return { date: key, nbrConsultation: aggregatedHistoric[key] };
              })
            : [];
          const filtredResult = finalResult.filter((result) =>
            moment(result.date).isBetween(fromDate, toDate, "day", "[]")
          );
          res.send(filtredResult);
        }
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
    return res.status(404).json({ message: "Client not found" });
  }

  const subProject = await SubProject.findOne({
    _id: doc.idSubProject,
    idProject: project._id,
  });
  if (!subProject) {
    return res.status(404).json({ message: "Project not found" });
  }

  const document = await Documentation.findOne({
    title: doc.title,
    idSubProject: doc.idSubProject,
  });
  if (document) {
    return res.status(400).json({
      message: "document with this title already exists under this Project",
    });
  }

  doc.idProject = project;
  doc.idSubProject = subProject;
  doc.isError = false;
  doc.expiration = doc.expiration === "null" ? null : doc.expiration;
  if (doc.expiration !== "" && doc.expiration !== null) {
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

  const project = await Project.findOne({ name: doc.client });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }

  const subProject = await SubProject.findOne({
    name: doc.project,
    idProject: project._id,
  });
  if (!subProject) {
    return res.status(404).json({ message: "Project not found" });
  }

  const document = await Documentation.findOne({
    title: doc.title,
    idSubProject: subProject._id,
  });
  if (document) {
    return res.status(400).json({
      message: "document with this title already exists under this Project",
    });
  }

  doc.idProject = project;
  doc.idSubProject = subProject;
  doc.isError = false;
  doc.expiration = doc.expiration === "null" ? null : doc.expiration;
  if (doc.expiration !== "" && doc.expiration !== null) {
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

const updateDocumentation = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;

  const project = await Project.findOne({ _id: updates.idProject });
  if (!project) {
    return res.status(404).json({ message: "Client not found" });
  }

  const subProject = await SubProject.findOne({
    _id: updates.idSubProject,
    idProject: project._id,
  });
  if (!subProject) {
    return res.status(404).json({ message: "Project not found" });
  }

  const document = await Documentation.findOne({
    title: updates.title,
    idSubProject: updates.idSubProject,
    _id: { $ne: _id },
  });
  if (document) {
    return res.status(400).json({
      message: "document with this title already exists under this Project",
    });
  }

  updates.idProject = project;
  updates.idSubProject = subProject;
  updates.expiration =
    updates.expiration === "null" ? null : updates.expiration;
  if (updates.expiration !== "" && updates.expiration !== null) {
    try {
      updates.expiration = moment(updates.expiration).format("YYYY-MM-DD");
      if (moment(updates.expiration).isBefore(moment(), "day")) {
        updates.status = "expiré";
      }
    } catch {
      return res.status(403).json({ message: "error with expiration format" });
    }
  } else {
    doc.status = "public";
  }

  try {
    const result = await Documentation.updateOne({ _id: _id }, updates);
    res.status(200).json(result);
  } catch {
    return res
      .status(500)
      .json({ message: "error with updating documentation" });
  }
};

const addNewConsultation = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;

  const documentation = await Documentation.findOne({ _id: _id });
  if (!documentation) {
    return res.status(404).json({ message: "Documentation not found" });
  }

  const consultHistoric = {
    consultationNumber: documentation.consultationNumber + 1,
    lastConsultation: updates.lastConsultation,
  };

  try {
    await Documentation.updateOne({ _id: _id }, consultHistoric);
    res.status(200).send();
  } catch {
    res.status(500).send();
  }
};

const resetConsultationNumber = async (req, res) => {
  const _id = req.params._id;
  try {
    await Documentation.updateOne(
      { _id: _id },
      { consultationNumber: 0, lastConsultation: "" }
    );
    res.status(200).send();
  } catch {
    res.status(500).send();
  }
};

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
  getDocumentationsSafelyWithDate,
  getNbrConsultationOfDocuments,
  getNbrConsultationPerDate,
  createDocumentation,
  createDocumentationWithUpload,
  addNewConsultation,
  updateDocumentation,
  resetConsultationNumber,
  deleteDocumentation,
};

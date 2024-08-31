const Error = require("../models/error.model");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const SubProject = require("../models/subProject.model");
const Documentation = require("../models/documentation.model");
const getSubProjectsManagedByUser = require("./additionalControllers").getSubProjectsManagedByUser;

const getErrors = (req, res) => {
    Error.find()
        .populate("idProject")
        .populate("idSubProject")
        .populate("idDocumentation")
        .then(errors => res.json(errors))
        .catch(err => res.status(400).json('Error: ' + err));
};

const getErrorsSafely = async (req, res) => {
    const userId = req.params.user;
    const user = await User.findOne({ _id: userId });
    if(user){
        if(user.role === "admin"){
            try {
                const result = await Error.find()
                    .populate("idProject")
                    .populate("idSubProject")
                    .populate("idDocumentation");
                res.send(result);
            } catch (err) {
                console.log(err);
            }
        }else if(user.role === "user"){
            try {
                const subProjects = await getSubProjectsManagedByUser(userId);
                const errors = await Error.find({ idSubProject: { $in: subProjects } })
                    .populate("idProject")
                    .populate("idSubProject")
                    .populate("idDocumentation");
                res.send(errors);
            } catch (err) {
                console.log(err);
            }
        }
    }
};

const getErrorsBySubProject = async (req, res) => {
    const subProjectId = req.params.subProject;
    const errors = await Error.find({ idSubProject : subProjectId})
        .populate("idProject")
        .populate("idSubProject")
        .populate("idDocumentation");
    res.send(errors);
};

const createError = async (req, res) => {
    const error = req.body;

    const project = await Project.findOne({ _id: error.idProject });
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    const subProject = await SubProject.findOne({ _id: error.idSubProject , idProject: project._id});
    if (!subProject) {
        return res.status(404).json({message : "subProject not found"});
    }

    const documentation = await Documentation.findOne({ _id: error.idDocumentation , idSubProject: subProject._id});
    if (!documentation) {
        return res.status(404).json({message : "Documentation not found"});
    }

    const errorDocument = await Error.findOne({ idDocumentation : error.idDocumentation , idSubProject : error.idSubProject});
    if(errorDocument){
        return res.status(400).json({message : "Error already exists"});
    }

    const newError = new Error(error);

    newError.save()
        .then(() => 
        res.json(newError))
        .catch(err => res.status(400).json('Error: ' + err));
};

const getError = (req, res) => {
    Error.findById(req.params.id)
        .populate("idProject")
        .populate("idSubProject")
        .populate("idDocumentation")
        .then(error => res.json(error))
        .catch(err => res.status(400).json('Error: ' + err));
}

const updateError = (req, res) => {
    Error.findById(req.params.id)
        .then(error => {
            error.idProject = req.body.idProject;
            error.idSubProject = req.body.idSubProject;
            error.idDocumentation = req.body.idDocumentation;

            error.save()
                .then(() => res.json('Error updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
}

const deleteError = (req, res) => {
    Error.findByIdAndDelete(req.params.id)
        .then(() => res.json('Error deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
}

module.exports = {
    getErrors,
    getErrorsSafely,
    getErrorsBySubProject,
    createError,
    getError,
    updateError,
    deleteError
};
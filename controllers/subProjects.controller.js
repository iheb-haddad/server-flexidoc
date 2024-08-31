const SubProject = require("../models/subProject.model");
const Documentation = require("../models/documentation.model");
const Source = require("../models/source.model");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const { getProjectsManagedByUser } = require("./additionalControllers");

// Create and Save a new Project
const createSubProject = async (req, res) => {
    const subProject = req.body;
    const project = await Project.findOne({ _id: subProject.idProject });
    if (!project) {
      return res.status(404).json({message : "Project not found"}); 
    }

    const existingSubProject = await SubProject.findOne({ name: subProject.name , idProject: subProject.idProject});
    if (existingSubProject) {
        return res.status(400).json({ message: 'SubProject with this name already exists under this project' });
    }

    subProject.idProject = project;
    await SubProject.create(subProject);
    res.status(201).send();
};

const createSubProjectWithUpload = async (req, res) => {
    const subProject = req.body;
    const project = await Project.findOne({ name: subProject.project });
    if (!project) {
        return res.status(404).json({message : "Project not found"});
    }
    const existingSubProject = await SubProject.findOne({ name: subProject.name , idProject: project._id});
    if (existingSubProject) {
        return res.status(400).json({ message: 'SubProject with this name already exists under this project' });
    }
    subProject.idProject = project;
    await SubProject.create(subProject);
    res.status(201).send();
};

// Retrieve all Projects from the database.
const getSubProjects = async (req, res) => {
    const subProjects = await SubProject.find()
        .populate("idProject");
    res.send(subProjects);
};

const getSubProjectsManagedByUser = async (req, res) => {
    const userId = req.params.user;
    let user;
    try{
        user = await User.findOne({ _id: userId })
            .populate('subProjects');
    }
    catch(err){
        res.status(404).json({ message: "user not found" });
        return
    }
    if (user) {
        const subProjects = await SubProject.find()
            .populate("idProject");
        if (user.role === "admin") {
            try{
                res.send(subProjects);
            }
            catch(err){
                res.status(403).json({ message: "subProjects not found" });
            }
        } else if (user.role === "user") {
            let userSubprojects = [];
            for (let i = 0; i < user.subProjects.length; i++) {
                userSubprojects.push(await SubProject.findOne({ _id: user.subProjects[i] })
                    .populate("idProject"));
            }
            const projectsManaged = await getProjectsManagedByUser(userId);
            const subProjectsUnderUserProjects = await SubProject.find({ idProject : { $in : projectsManaged }})
            .populate("idProject");
            const allSubProjects = [...userSubprojects, ...subProjectsUnderUserProjects];
            res.send(allSubProjects);
        }
    }
}

// Find a single Project with an id
const getSubProject = async (req, res) => {
    const _id = req.params._id;
    const subProject = await SubProject.findOne({ _id: _id })
        .populate("idProject");
    if (!subProject) {
        return res.status(404).send();
    }
    res.send(subProject);
}

// Update a Project by the id in the request
const updateSubProject = async (req, res) => {
    const _id = req.params._id;
    const updates = req.body;
    const existingSubProject = await SubProject.findOne({ name: updates.name , _id: { $ne: _id }});
    if (existingSubProject) {
        return res.status(400).json({ error: 'Sub Project with this name already exists' });
    }
    const updatedSubProject = await SubProject.updateOne({ _id: _id }, updates);
    res.status(200).json(updatedSubProject);
};

// Delete a Project with the specified id in the request
const deleteSubProject = async (req, res) => {
    const _id = req.params._id;
    await SubProject.deleteOne({ _id: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
    //deleting documentations
    await Documentation.deleteMany({ idSubProject: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
    //deleting sources
    await Source.deleteMany({ idSubProject: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
}

module.exports = {
    createSubProject,
    createSubProjectWithUpload,
    getSubProjects,
    getSubProjectsManagedByUser,
    getSubProject,
    updateSubProject,
    deleteSubProject,
};
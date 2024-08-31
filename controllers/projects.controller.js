const Project = require("../models/project.model");
const Configuration = require("../models/configuration.model");
const SubProject = require("../models/documentation.model");
const User = require("../models/user.model");

// Create and Save a new Project
const createProject = async (req, res) => {
    let project = req.body;
    project.name = project.name.toUpperCase();
    const existingProject = await Project.findOne({ name: project.name });
    if (existingProject) {
        return res.status(400).json({ error: 'Project with this name already exists' });
    }
    const newProject = await Project.create(project);
    const newConfiguration = {
        idProject : newProject._id,
        panelColor : 'white',
        panelWidth : "300px",
        memoSection : "display",
        memoBackgroundColor : '#ffc000',
        memoFontColor : 'white',
        generalUrl : '',
        timer : 10 ,
        resizeBarWidth : '5px'
      }
    await Configuration.create(newConfiguration);
    res.status(201).send();
};

// Retrieve all Projects from the database.
const getProjects = async (req, res) => {
    const projects = await Project.find();
    res.send(projects);
};

const getUserProjects = async (req, res) => {
  const userId = req.params.user;
  const user = await User.findOne({ _id: userId })
  .populate('projects')
  .populate('subProjects');
  if(user){
    if(user.role === "admin"){
      try {
        const result = await Project.find();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    }else if(user.role === "user"){
      try {
        res.send(user.projects);
      } catch (err) {
        console.log(err);
      }
      }
    } 
  };

const getProjectsManagedByUser = async (req, res) => {
    const userId = req.params.user;
    const user = await User.findOne({ _id: userId })
    .populate('projects')
    .populate('subProjects');
    if(user){
    if(user.role === "admin"){
      try {
        const result = await Project.find();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    }else if(user.role === "user"){
      try {
        const projectsManaged = user.projects.filter(project => !user.subProjects.some(subProject => subProject.idProject.toString() === project._id.toString()));
        res.send(projectsManaged);
      } catch (err) {
        console.log(err);
      }
      }
    } 
  };

// Find a single Project with an id
const getProject = async (req, res) => {
    const _id = req.params._id;
    const project = await Project.findOne({ _id: _id });
    if (!project) {
        return res.status(404).send();
    }
    res.send(project);
}

// Update a Project by the id in the request
const updateProject = async (req, res) => {
    const _id = req.params._id;
    let updates = req.body;
    updates.name = updates.name.toUpperCase();
    const existingProject = await Project.findOne({ name: updates.name , _id: { $ne: _id }});
    if (existingProject) {
        return res.status(400).json({ error: 'Project with this name already exists' });
    }
    const updatedProject = await Project.updateOne({ _id: _id }, updates);
    res.status(200).json(updatedProject);
};

// Delete a Project with the specified id in the request
const deleteProject = async (req, res) => {
    const _id = req.params._id;
    await Project.deleteOne({ _id: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
    //deleting configurations
    await Configuration.deleteMany({ idProject: _id })
    .then(() => res.status(200).send())
    .catch(() => res.status(500));
}
const getProjectByName = async (req, res) => {
    const name = req.params.name.toUpperCase();
    const project = await Project.findOne({ name: name });
    if (!project) {
        return res.status(404).send();
    }
    res.send(project);
}

module.exports = {
    createProject,
    getProjects,
    getProjectsManagedByUser,
    getUserProjects,
    getProject,
    getProjectByName,
    updateProject,
    deleteProject,
};
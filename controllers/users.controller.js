const User = require("../models/user.model");
const Project = require("../models/project.model");
const SubProject = require("../models/subProject.model");
const bcrypt = require("bcryptjs");
const { getProjectsManagedByUser } = require("./additionalControllers");

const getUsers = async (req, res) => {
  try {
    const result = await User.find()
      .populate("projects")
      .populate("subProjects");
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

const getUsersSafely = async (req, res) => {
  const userId = req.params.user;
  let user;
  try {
    user = await User.findOne({ _id: userId })
      .populate("projects")
      .populate("subProjects");
  } catch (err) {
    res.status(404).json({ message: "user not found" });
    return;
  }
  if (user) {
    if (user.role === "admin") {
      try {
        const result = await User.find({ role: "user"})
          .populate("projects")
          .populate("subProjects");
        res.send(result);
      } catch (err) {
        res.status(403).json({ message: "users not found" });
      }
    } else if (user.role === "user") {
      const allprojects = await getProjectsManagedByUser(userId);
      const allSubProjects = await SubProject.find({ idProject: { $in: allprojects } });
      const allUsers = await User.find({ subProjects : { $in : allSubProjects }})
        .populate("projects")
        .populate("subProjects");
      res.send(allUsers);
    }
  }
}

const updateUser = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;
      try {
        await User.findByIdAndUpdate(_id, updates);
        res.status(200).json({ message: "user updated" });
      } catch {
        res.status(500).send();
      }
  };

const updatePassword = async (req, res) => {
  const _id = req.params._id;
  const actualPassword = req.body.actualPassword;
  const newPassword = req.body.newPassword;
  const confirmation = req.body.confirmationPassword;
  try {
    const user = await User.findById(_id);
    const passwordMatch = await bcrypt.compare(actualPassword, user.password);
    if(!passwordMatch){
      res.status(401).json({ message: "wrong password" });
      return;
    }
    if(newPassword !== confirmation){
      res.status(403).json({ message: "passwords don't match" });
      return;
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt);   
    await User.findByIdAndUpdate(_id, { password: hashedPassword });
    res.status(200).json({ message: "password updated" });
  }
  catch {
    res.status(500).send();
  }
};

const updatePrivileges = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;

  // verification of the projects
  if(updates.projects.length === 0) {
      return res.status(402).json({ error: 'You must select at least one project' });
  }else if(updates.projects.length !== 0){
      updates.projects.map(async (prj) =>
      {
          const project = await Project.findOne({ _id: prj });
          if (!project) {
               return res.status(404).json({ message: "Project not found" });
          }
      })
  }
  // verification of the subProjects
  if(updates.subProjects.length === 0 && updates.projects.length === 0) {
      return res.status(403).json({ error: 'You must select at least one subProject' });
  }
  else if(updates.subProjects.length !== 0){
      updates.subProjects.map(async (subPrj) =>
      {
          const subProject = await SubProject.findOne({ _id: subPrj })
              .populate('idProject');
          if (!subProject) {
              return res.status(404).json({ message: "SubProject not found" });
          }
      })
  }

  const changes = {
    projects: updates.projects,
    subProjects: updates.subProjects,
  };
  // change password
  if(updates.password !== ""){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(updates.password, salt);   
    changes.password = hashedPassword;
  }

  try {
    await User.findByIdAndUpdate(_id, changes);
    res.status(200).json({ message: "privileges updated" });
  }
  catch {
    res.status(500).send();
  }
}
const deleteUser = async (req, res) => {
  const _id = req.params._id;
  try {
    await User.deleteOne({ _id: _id });
    res.status(200).send();
  } catch {
    res.status(500).send();
  }
};

module.exports = {
  getUsers,
  getUsersSafely,
  updateUser,
  updatePassword,
  updatePrivileges,
  deleteUser,
};

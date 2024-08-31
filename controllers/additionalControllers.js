const User = require("../models/user.model");
const SubProject = require("../models/subProject.model");
const Documentation = require("../models/documentation.model");

const getProjectsManagedByUser = async (userId) => {
    const user = await User.findOne({ _id: userId })
    .populate('projects')
    .populate('subProjects');
    if(user){
    if(user.role === "admin"){
      try {
        const result = await Project.find();
        return result;
      } catch (err) {
        console.log(err);
      }
    }else if(user.role === "user"){
      try {
        const projectsManaged = user.projects.filter(project => !user.subProjects.some(subProject => subProject.idProject.toString() === project._id.toString()));
        return projectsManaged;
      } catch (err) {
        console.log(err);
      }
      }
    } 
  };

const getSubProjectsManagedByUser = async (userId) => {
    let user;
    try{
        user = await User.findOne({ _id: userId })
            .populate('subProjects');
    }
    catch(err){
        console.log(err);
        return
    }
    if (user) {
        const subProjects = await SubProject.find()
        .populate("idProject");
        if (user.role === "admin") {
            try{
                return subProjects;
            }
            catch(err){
                console.log(err);
            }
        } else if (user.role === "user") {
            const userSubprojects = user.subProjects;
            const projectsManaged = await getProjectsManagedByUser(userId);
            const subProjectsUnderUserProjects = await SubProject.find({ idProject : { $in : projectsManaged }})
            .populate("idProject");
            const allSubProjects = [...userSubprojects, ...subProjectsUnderUserProjects];
            return allSubProjects;
        }
    }
}

const getDocumentationsSafely = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if(user){
      if(user.role === "admin"){
        try {
          const result = await Documentation.find()
            .populate("idSubProject");
          return result;
        } catch (err) {
          console.log(err);
        }
      }else if(user.role === "user"){
        try {
          const subProjects = await getSubProjectsManagedByUser(userId);
          const documents = await Documentation.find({ idSubProject: { $in: subProjects } })
          .populate("idSubProject");
          return documents;
        } catch (err) {
          console.log(err);
        }
      }
    } 
}

module.exports = { 
    getSubProjectsManagedByUser ,
    getDocumentationsSafely,
    getProjectsManagedByUser};
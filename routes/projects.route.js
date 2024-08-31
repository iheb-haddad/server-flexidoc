const express = require("express");
const router = express.Router();

const  {
    createProject,
    getProjects,
    getProjectsManagedByUser,
    getUserProjects,
    getProject,
    getProjectByName,
    updateProject,
    deleteProject,
} = require("../controllers/projects.controller");

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:user", getProjectsManagedByUser);
router.get("/userProjects/:user", getUserProjects);
router.get("/:_id", getProject);
router.get("/name/:name", getProjectByName);
router.put("/:_id", updateProject);
router.delete("/:_id", deleteProject);

module.exports = router;
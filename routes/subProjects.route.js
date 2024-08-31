const express = require('express');
const router = express.Router();

const {
    createSubProject,
    createSubProjectWithUpload,
    getSubProjects,
    getSubProjectsManagedByUser,
    getSubProject,
    updateSubProject,
    deleteSubProject
} = require('../controllers/subProjects.controller');

router.post('/', createSubProject);
router.post('/upload', createSubProjectWithUpload);
router.get('/', getSubProjects);
router.get('/:user', getSubProjectsManagedByUser);
router.get('/:_id', getSubProject);
router.put('/:_id', updateSubProject);
router.delete('/:_id', deleteSubProject);   

module.exports = router;
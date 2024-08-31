const express = require('express');
const router = express.Router();

const {
    getErrors,
    createError,
    getErrorsSafely,
    getErrorsBySubProject,
    deleteError,
    getError,
    updateError
} = require('../controllers/errors.controller');

router.get('/', getErrors);
router.post('/', createError);
router.get('/:user', getErrorsSafely);
router.get('/subProject/:subProject', getErrorsBySubProject);
router.get('/:id', getError);
router.delete('/:id', deleteError);
router.put('/:id', updateError);

module.exports = router;
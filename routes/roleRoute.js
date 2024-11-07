const express = require('express');
const {addRole, addPermission, assignRolePermission, getAllRoles, getAllPermissions } = require('../controllers/roleController');

const router = express.Router();

// Routes for roles and permissions
router.post('/add', addRole); 
router.post('/permissions/add', addPermission); 
router.post('/assign-permission', assignRolePermission); 
router.get('/list', getAllRoles); 
router.get('/permissions/list', getAllPermissions); 

module.exports = router;

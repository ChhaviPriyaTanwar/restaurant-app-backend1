const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { getUserById, getAllUsers, getUserByEmail, updateUserProfile, deleteUserProfile, userAccess, adminAccess, staffAccess, getUserBySlugId } = require('../controllers/userController');
const { validateUpdateUser } = require('../validations/validation');
const { checkPermission } = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.get('/:id', verifyToken, getUserById);
router.get('/slugId/:slugId', getUserBySlugId);
router.get('/get/list', verifyToken, getAllUsers);
router.get('/get/email', verifyToken, getUserByEmail);
router.put('/', verifyToken, validateUpdateUser, updateUserProfile);
router.delete('/:id', verifyToken, deleteUserProfile);

//check role and permission
router.get('/users/view_orders', verifyToken, checkPermission('view_orders'), userAccess);

router.get('/admin/manage_users',verifyToken, checkPermission('manage_users'), adminAccess);

router.get('/staff/update_menu',verifyToken, checkPermission('update_menu'), staffAccess);


module.exports = router;
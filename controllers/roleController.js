const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');
const Role = require('../models/role');
const Permission = require('../models/permission');
const RolePermission = require('../models/rolePermission');
const logger = require('../utils/logger');


// Add a new role
const addRole = async (req, res) => {
    const { role_name, description } = req.body;

    try {
        const existingRole = await Role.findOne({ role_name });
        if (existingRole) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.ROLE_EXISTS,null);
        }

        if(!role_name || !description){
            console.log(` role_name: ${role_name} \n description: ${description} `.bgGreen);
            logger.warn(`Role failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS,null);
        }

        const newRole = new Role({ role_name, description });
        await newRole.save();
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.ROLE_ADDED, newRole);
    } catch (error) {
        console.error('Error adding role:', error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Add a new permission
const addPermission = async (req, res) => {
    const { permission_name, description } = req.body;

    try {
        const existingPermission = await Permission.findOne({ permission_name });
        if (existingPermission) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.PERMISSION_EXISTS,null);
        }

        if(!permission_name || !description){
            console.log(` permission_name: ${permission_name} \n description: ${description} `.bgGreen);
            logger.warn(`Permission failed: Required field are missing`);
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.REQUIRED_FIELDS,null);
        }

        const newPermission = new Permission({ permission_name, description });
        await newPermission.save();
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.PERMISSION_ADDED, newPermission);
    } catch (error) {
        console.error('Error adding permission:', error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Assign a permission to a role
const assignRolePermission = async (req, res) => {
    const { role, permission } = req.body;

    try {
        const existingRole = await Role.findOne({ role_name: role });
        const existingPermission = await Permission.findOne({ permission_name: permission });

        if (!existingRole) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.ROLE_NOT_FOUND,null);
        }

        if (!existingPermission) {
            return responseHandler(res, STATUS_CODE.NOT_FOUND, MESSAGE.PERMISSION_NOT_FOUND,null);
        }

        const existingRolePermission = await RolePermission.findOne({ permission });
        if (existingRolePermission) {
            return responseHandler(res, STATUS_CODE.BAD_REQUEST, MESSAGE.PERMISSION_EXISTS,null);
        }

        const rolePermission = new RolePermission({ role, permission });
        await rolePermission.save();
        return responseHandler(res, STATUS_CODE.CREATED, MESSAGE.ROLE_PERMISSION_ASSIGNED, rolePermission);
    } catch (error) {
        console.error('Error assigning role permission:', error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return responseHandler(res, STATUS_CODE.SUCCESS, 'Roles fetched successfully', roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get all permissions
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        return responseHandler(res, STATUS_CODE.SUCCESS, 'Permissions fetched successfully', permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    addRole,
    addPermission,
    assignRolePermission,
    getAllRoles,
    getAllPermissions,
};

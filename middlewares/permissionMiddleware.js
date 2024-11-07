const RolePermission = require('../models/rolePermission');
const Permission = require('../models/permission');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');


const checkPermission = (requiredPermissionName) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.role; 
            if (!userRole) {
                return responseHandler(res, STATUS_CODE.FORBIDDEN, MESSAGE.NO_ROLE_FOUND,null);
            }

            // Find the required permission
            const permission = await Permission.findOne({ permission_name: requiredPermissionName });
            if (!permission) {
                return responseHandler(res, STATUS_CODE.FORBIDDEN, MESSAGE.PERMISSION_NOT_FOUND,null);
            }

            // Check if the role has the permission
            const hasPermission = await RolePermission.findOne({
                role: userRole,
                permission: permission.permission_name,
            });

            if (!hasPermission) {
                return responseHandler(res, STATUS_CODE.FORBIDDEN, MESSAGE.INSUFFICIENT_PERMISSIONS,null);
            }

            next();
        } catch (error) {
            console.error('Error in permission middleware:', error);
            return responseHandler(res, STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGE.INTERNAL_SERVER_ERROR, error.message);
        }
    };
};

module.exports = { checkPermission };

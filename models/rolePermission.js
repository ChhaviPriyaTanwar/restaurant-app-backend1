const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
    role: { type: String, ref: 'Role', required: true },
    permission: { type: String, ref: 'Permission', required: true },
});

const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
module.exports = RolePermission;

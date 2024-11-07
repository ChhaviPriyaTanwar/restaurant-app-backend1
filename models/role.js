const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String
    },
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;

// config/imageConfig.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        // Ensure the uploads directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Ensure recursive directory creation
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const menuId = req.body.menuId; // Get the menu ID from the request body
        const fileName = `menu_${menuId}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

// Initialize multer
const upload = multer({ storage });

module.exports = upload;

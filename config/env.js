require('dotenv').config();

module.exports = {
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/restaurant-app',
    PORT : process.env.PORT || 3000
};
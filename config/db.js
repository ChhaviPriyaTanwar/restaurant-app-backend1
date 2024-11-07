// const mongoose = require('mongoose');
// const colors = require("colors");

// const { MONGO_URL } = require('./env');

// const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URL);  // Simplified connection without deprecated options

//         // await mongoose.connect(MONGO_URL, {
//         //     useNewUrlParser: true, //Prevents deprecation warning
//         //     useUnifiedTopology: true // Ensure proper connection handling
//         // });
//         console.log(`MongoDB connected successfully : ${mongoose.connection.host}`.bgBrightYellow);
//     } catch (error) {
//         console.error(`MongoDB connection failed: ${error.message}`.bgBrightRed);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
const colors = require("colors");

const { MONGO_URL } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);  // Simplified connection without deprecated options
        console.log(`MongoDB connected successfully : ${mongoose.connection.host}`.bgBrightYellow);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`.bgBrightRed);
        process.exit(1);
    }
};

module.exports = connectDB;

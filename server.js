const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const roleRoutes = require('./routes/roleRoute');
const otpRoutes = require('./routes/otpRoute');
const menuRoutes = require('./routes/menuRoute');
const categoryRoutes = require('./routes/categoryRoute');
const cartRoutes = require('./routes/cartRoute');
const orderRoutes = require('./routes/orderRoute');
const billRoutes = require('./routes/billRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
const favoriteRoutes = require('./routes/favoriteRoute');
const staffRoutes = require('./routes/staffRoute');
const performanceMetricsRoute = require('./routes/performanceMetricsRoute');


// Initialize express app
const app = express();

app.use(cors());

// Connect to MongoDB
connectDB();

app.use(express.json()); // For parsing application/json

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/roles', roleRoutes);
app.use('/v1/otp', otpRoutes);
app.use('/v1/menu', menuRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/cart', cartRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/v1/bills', billRoutes);
app.use('/v1/feedback', feedbackRoutes);
app.use('/v1/favorites', favoriteRoutes);
app.use('/v1/staff', staffRoutes);
app.use('/v1/performance-metrics', performanceMetricsRoute);





// Basic route for testing
app.get("/", (req, res) => {
    res.send('Restaurant App Backend');
});

// Listen on the post from env.js
const { PORT } = require('./config/env');
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// npm start server
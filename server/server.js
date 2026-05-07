const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler'); 
const { startCronJobs } = require('./services/cronJobs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: false }));

// CORS - Allow frontend to make requests
app.use(
  cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true,
  })
);

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));



// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Momentum API is running...' });
});

// Error handler middleware 
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`); 
   startCronJobs();
}); 


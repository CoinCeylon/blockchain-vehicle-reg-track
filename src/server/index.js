const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const officerRoutes = require('./routes/officerRoutes');
const {
  authenticateJWT
} = require('./middleware/authMiddleware');
// Load environment variables
dotenv.config();
// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vcrypt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', authenticateJWT, vehicleRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/documents', authenticateJWT, documentRoutes);
app.use('/api/transactions', authenticateJWT, transactionRoutes);
app.use('/api/admin', authenticateJWT, adminRoutes);
app.use('/api/officer', authenticateJWT, officerRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Server is running'
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
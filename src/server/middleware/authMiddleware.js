const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header missing'
    });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: 'Token missing'
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vcrypt_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Invalid or expired token'
    });
  }
};
// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
// Middleware to check if user is an officer
const isOfficer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    if (user.role !== 'officer' && user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Officer role required'
      });
    }
    if (user.role === 'officer' && !user.officerVerified) {
      return res.status(403).json({
        message: 'Your officer account is pending verification'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
// Middleware to check if user is authorized for a vehicle
const isVehicleOwner = async (req, res, next) => {
  try {
    const vehicleId = req.params.id || req.body.vehicleId;
    const userId = req.user.id;
    const vehicle = await Vehicle.findById(vehicleId).populate('owner');
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    // Check if user is the owner or an admin/officer
    const user = await User.findById(userId);
    if (vehicle.owner._id.toString() === userId || user.role === 'admin' || user.role === 'officer' && user.officerVerified) {
      next();
    } else {
      return res.status(403).json({
        message: 'Access denied. Not authorized for this vehicle'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
module.exports = {
  authenticateJWT,
  isAdmin,
  isOfficer,
  isVehicleOwner
};
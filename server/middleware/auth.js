import jwt from 'jsonwebtoken';
import db from '../db/database.js';

// Authentication middleware
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    
    await db.read();
    const user = db.data.users.find(u => u.id === decoded.userId);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Account is not active. Please contact administrator.'
      });
    }

    // Add user to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
    }
    if (!user || user.status !== 'active') {
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      locationId: user.locationId,
      classIds: user.classIds
    };
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Authorization middleware
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Please authenticate.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};
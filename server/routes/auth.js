import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { auth, authorize } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .isIn(['admin', 'teacher', 'student', 'parent'])
    .withMessage('Invalid role specified'),
  body('phoneNumber')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  body('parentEmail')
    .if(body('role').equals('student'))
    .isEmail()
    .normalizeEmail()
    .withMessage('Parent email is required for students and must be valid')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, role, phoneNumber, parentEmail, locationId } = req.body;

    // Check if user already exists
    await db.read();
    const existingUser = db.data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create user data object
    const userData = {
      firstName,
      lastName,
      email,
    const user = {
      id: uuidv4(),
      role,
      phoneNumber,
      status: 'pending' // All registrations require admin approval
    };

    // Add role-specific fields
    if (role === 'student' && parentEmail) {
      userData.parentEmail = parentEmail;
    }
      status: role === 'admin' ? 'active' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const user = new User(userData);
    db.data.users.push(user);
    await db.write();

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please wait for admin approval.',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: user.status === 'pending' 
          ? 'Your account is pending approval. Please contact an administrator.'
          : 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = user.generateAuthTokens();

    // Save refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          phoneNumber: user.phoneNumber,
          locationId: user.locationId,
          classIds: user.classIds,
          parentEmail: user.parentEmail,
          lastLogin: user.lastLogin
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login'
    });
  }
});

// @route   GET /api/auth/pending
// @desc    Get all pending users
// @access  Private (Admin only)
router.get('/pending', auth, authorize(['admin']), async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .populate('locationId', 'name')
      .sort({ createdAt: -1 });

    // Format the response
    const formattedUsers = pendingUsers.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      locationName: user.locationId ? user.locationId.name : null,
      parentEmail: user.parentEmail,
      createdAt: user.createdAt
    }));
        id: user.id,
    res.json({
      status: 'success',
      data: {
        pendingUsers: formattedUsers
      }
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken)) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    // Check if user is still active
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Account is not active'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = user.generateAuthTokens();

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
          id: user.id,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user.id);

    if (refreshToken && user) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
      await user.save();
    }

    res.json({
      status: 'success',
      message: 'Logout successful'
    });

    await db.read();
    const pendingUsers = db.data.users
      .filter(user => user.status === 'pending')
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      status: 'error',
      message: 'Internal server error during logout'
    });
  }
});

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post('/logout-all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      // Remove all refresh tokens
      user.refreshTokens = [];
      await user.save();
    }

    res.json({
      status: 'success',
      message: 'Logged out from all devices successfully'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during logout'
    await db.read();
    const user = db.data.users.find(u => u.id === decoded.userId);
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('locationId', 'name address')
      { userId: user.id, email: user.email, role: user.role },
    await db.read();
    const user = db.data.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      { userId: user.id, email: user.email, role: user.role },
      message: 'Internal server error'
    });
  }
});

export default router;
      { userId: user.id },
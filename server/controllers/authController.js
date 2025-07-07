import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber, parentEmail, locationId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
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
      password,
      role,
      phoneNumber,
      status: 'pending', // All registrations require admin approval
      locationId
    };

    // Add role-specific fields
    if (role === 'student' && parentEmail) {
      userData.parentEmail = parentEmail;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

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
};

// Login user
export const login = async (req, res) => {
  try {
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
};

// Get pending users
export const getPendingUsers = async (req, res) => {
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
};
import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../db/database.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      status, 
      location, 
      search 
    } = req.query;

    await db.read();
    let users = db.data.users;

    // Apply filters
    if (role) users = users.filter(user => user.role === role);
    if (status) users = users.filter(user => user.status === status);
    if (location) users = users.filter(user => user.locationId === location);
    
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    // Sort by creation date (newest first)
    usersWithoutPasswords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate pagination
    const total = usersWithoutPasswords.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedUsers = usersWithoutPasswords.slice(skip, skip + parseInt(limit));

    res.json({
      status: 'success',
      data: {
        users: paginatedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          hasNext: skip + paginatedUsers.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check authorization - users can only view their own profile unless admin
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      status: 'success',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/:id/approve
// @desc    Approve pending user (admin only)
// @access  Private (Admin)
router.put('/:id/approve', auth, authorize(['admin']), async (req, res) => {
  try {
    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const user = db.data.users[userIndex];

    if (user.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'User is not in pending status'
      });
    }

    db.data.users[userIndex].status = 'active';
    db.data.users[userIndex].updatedAt = new Date().toISOString();
    await db.write();

    const { password, ...userWithoutPassword } = db.data.users[userIndex];

    res.json({
      status: 'success',
      message: 'User approved successfully',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/:id/reject
// @desc    Reject pending user (admin only)
// @access  Private (Admin)
router.put('/:id/reject', auth, authorize(['admin']), async (req, res) => {
  try {
    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const user = db.data.users[userIndex];

    if (user.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'User is not in pending status'
      });
    }

    // Remove the user from the database
    db.data.users.splice(userIndex, 1);
    await db.write();

    res.json({
      status: 'success',
      message: 'User registration rejected and removed'
    });

  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address')
], async (req, res) => {
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

    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const user = db.data.users[userIndex];

    // Check authorization - users can only update their own profile unless admin
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['firstName', 'lastName', 'phoneNumber'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Admin can update additional fields
    if (req.user.role === 'admin') {
      const adminUpdates = ['email', 'role', 'status', 'locationId', 'classIds'];
      adminUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
    }

    // Check if email is being changed and if it already exists
    if (updates.email && updates.email !== user.email) {
      const existingUser = db.data.users.find(u => u.email === updates.email && u.id !== user.id);
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'Email already exists'
        });
      }
    }

    // Apply updates
    Object.assign(db.data.users[userIndex], updates, { updatedAt: new Date().toISOString() });
    await db.write();

    const { password, ...userWithoutPassword } = db.data.users[userIndex];

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const user = db.data.users[userIndex];

    // Prevent admin from deleting themselves
    if (req.user.id === user.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete your own account'
      });
    }

    db.data.users.splice(userIndex, 1);
    await db.write();

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics (admin only)
// @access  Private (Admin)
router.get('/stats/overview', auth, authorize(['admin']), async (req, res) => {
  try {
    await db.read();
    const users = db.data.users;

    const stats = {
      activeStudents: users.filter(u => u.role === 'student' && u.status === 'active').length,
      activeTeachers: users.filter(u => u.role === 'teacher' && u.status === 'active').length,
      activeParents: users.filter(u => u.role === 'parent' && u.status === 'active').length,
      pendingUsers: users.filter(u => u.status === 'pending').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length
    };

    stats.totalActiveUsers = stats.activeStudents + stats.activeTeachers + stats.activeParents;
    stats.totalUsers = users.length;

    res.json({
      status: 'success',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

export default router;
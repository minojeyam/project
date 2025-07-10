import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import Location from '../models/Location.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation rules for location
const locationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location name must be between 2 and 100 characters'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  body('phoneNumber')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('capacity')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Capacity must be between 1 and 10,000'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Please enter a valid hex color')
];

// @route   GET /api/locations
// @desc    Get all locations
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, status, search } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get locations with pagination
    const locations = await Location.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Location.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        locations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalLocations: total,
          hasNext: skip + locations.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/locations/:id
// @desc    Get location by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!location) {
      return res.status(404).json({
        status: 'error',
        message: 'Location not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        location
      }
    });

  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/locations
// @desc    Create new location (admin only)
// @access  Private (Admin)
router.post('/', auth, authorize(['admin']), locationValidation, async (req, res) => {
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

    const { name, address, phoneNumber, email, capacity, color } = req.body;

    // Check if location with same name already exists
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(409).json({
        status: 'error',
        message: 'Location with this name already exists'
      });
    }

    // Create new location
    const locationData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const location = new Location(locationData);
    await location.save();

    // Populate the created location
    await location.populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      status: 'success',
      message: 'Location created successfully',
      data: {
        location
      }
    });

  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/locations/:id
// @desc    Update location (admin only)
// @access  Private (Admin)
router.put('/:id', auth, authorize(['admin']), locationValidation, async (req, res) => {
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

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        status: 'error',
        message: 'Location not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (req.body.name && req.body.name !== location.name) {
      const existingLocation = await Location.findOne({ name: req.body.name });
      if (existingLocation) {
        return res.status(409).json({
          status: 'error',
          message: 'Location with this name already exists'
        });
      }
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    res.json({
      status: 'success',
      message: 'Location updated successfully',
      data: {
        location: updatedLocation
      }
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/locations/:id
// @desc    Delete location (admin only)
// @access  Private (Admin)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        status: 'error',
        message: 'Location not found'
      });
    }

    // Check if location has any users or classes associated
    const User = (await import('../models/User.js')).default;
    const Class = (await import('../models/Class.js')).default;
    
    const [usersCount, classesCount] = await Promise.all([
      User.countDocuments({ locationId: req.params.id }),
      Class.countDocuments({ locationId: req.params.id })
    ]);

    if (usersCount > 0 || classesCount > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete location with associated users or classes'
      });
    }

    await Location.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Location deleted successfully'
    });

  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/locations/stats/overview
// @desc    Get location statistics (admin only)
// @access  Private (Admin)
router.get('/stats/overview', auth, authorize(['admin']), async (req, res) => {
  try {
    const stats = await Promise.all([
      Location.countDocuments({ status: 'active' }),
      Location.countDocuments({ status: 'inactive' }),
      Location.countDocuments({ status: 'maintenance' }),
      Location.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, totalCapacity: { $sum: '$capacity' }, totalEnrollment: { $sum: '$currentEnrollment' } } }
      ])
    ]);

    const [activeLocations, inactiveLocations, maintenanceLocations, capacityStats] = stats;
    const { totalCapacity = 0, totalEnrollment = 0 } = capacityStats[0] || {};

    res.json({
      status: 'success',
      data: {
        stats: {
          activeLocations,
          inactiveLocations,
          maintenanceLocations,
          totalLocations: activeLocations + inactiveLocations + maintenanceLocations,
          totalCapacity,
          totalEnrollment,
          occupancyRate: totalCapacity > 0 ? Math.round((totalEnrollment / totalCapacity) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Get location stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

export default router;
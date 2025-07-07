import User from '../models/User.js';

// Approve a pending user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'User is not in pending status'
      });
    }

    user.status = 'active';
    await user.save();

    res.json({
      status: 'success',
      message: 'User approved successfully',
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
    console.error('Approve user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Reject a pending user
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'User is not in pending status'
      });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

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
};
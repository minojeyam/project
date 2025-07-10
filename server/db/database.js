import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Location from '../models/Location.js';

// Initialize MongoDB connection
export const initializeDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Initialize default data if needed
    await initializeDefaultData();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Initialize default data
const initializeDefaultData = async () => {
  try {
    // Check if locations exist
    const locationCount = await Location.countDocuments();
    
    if (locationCount === 0) {
      console.log('📊 Initializing default locations...');
      
      const defaultLocations = [
        {
          name: 'Nelliyadi',
          address: {
            street: 'Main Street',
            city: 'Nelliyadi',
            state: 'Kerala',
            zipCode: '670001',
            country: 'India'
          },
          phoneNumber: '+91 9876543210',
          email: 'nelliyadi@iospace.com',
          capacity: 500,
          createdBy: null // Will be set to first admin user
        },
        {
          name: 'Chavakacheri',
          address: {
            street: 'School Road',
            city: 'Chavakacheri',
            state: 'Kerala',
            zipCode: '670002',
            country: 'India'
          },
          phoneNumber: '+91 9876543211',
          email: 'chavakacheri@iospace.com',
          capacity: 400,
          createdBy: null // Will be set to first admin user
        }
      ];

      await Location.insertMany(defaultLocations);
      console.log('✅ Default locations created');
    }

    // Check if users exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('👥 Initializing demo users...');
      
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
      const locations = await Location.find();
      
      const demoUsers = [
        {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@school.com',
          password: await bcrypt.hash('password', saltRounds),
          role: 'admin',
          status: 'active',
          phoneNumber: '+91 9876543210',
          locationId: locations[0]?._id
        },
        {
          firstName: 'Teacher',
          lastName: 'User',
          email: 'teacher@school.com',
          password: await bcrypt.hash('password', saltRounds),
          role: 'teacher',
          status: 'active',
          phoneNumber: '+91 9876543211',
          locationId: locations[0]?._id
        },
        {
          firstName: 'Student',
          lastName: 'User',
          email: 'student@school.com',
          password: await bcrypt.hash('password', saltRounds),
          role: 'student',
          status: 'active',
          phoneNumber: '+91 9876543212',
          parentEmail: 'parent@school.com',
          locationId: locations[0]?._id
        },
        {
          firstName: 'Parent',
          lastName: 'User',
          email: 'parent@school.com',
          password: await bcrypt.hash('password', saltRounds),
          role: 'parent',
          status: 'active',
          phoneNumber: '+91 9876543213'
        }
      ];

      await User.insertMany(demoUsers);
      
      // Update locations with admin user as creator
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        await Location.updateMany(
          { createdBy: null },
          { createdBy: adminUser._id }
        );
      }
      
      console.log('✅ Demo users created');
    }

  } catch (error) {
    console.error('❌ Error initializing default data:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export default mongoose;
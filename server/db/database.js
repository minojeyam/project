import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Database structure
const defaultData = {
  users: [],
  locations: [
    {
      id: uuidv4(),
      name: 'Nelliyadi',
      address: 'Nelliyadi, Kerala',
      phone: '+91 9876543210',
      email: 'nelliyadi@ioSpace.com',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Chavakacheri',
      address: 'Chavakacheri, Kerala', 
      phone: '+91 9876543211',
      email: 'chavakacheri@ioSpace.com',
      createdAt: new Date().toISOString()
    }
  ],
  classes: []
};

// Initialize database
const adapter = new JSONFile('server/db/db.json');
const db = new Low(adapter, defaultData);

// Initialize database with default data
export const initializeDatabase = async () => {
  await db.read();
  
  // If database is empty, populate with default data
  if (!db.data || Object.keys(db.data).length === 0) {
    db.data = defaultData;
    
    // Create demo users
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    
    const demoUsers = [
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@school.com',
        password: await bcrypt.hash('password', saltRounds),
        role: 'admin',
        status: 'active',
        location: 'Nelliyadi',
        phone: '+91 9876543210',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Teacher User',
        email: 'teacher@school.com',
        password: await bcrypt.hash('password', saltRounds),
        role: 'teacher',
        status: 'active',
        location: 'Nelliyadi',
        phone: '+91 9876543211',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Student User',
        email: 'student@school.com',
        password: await bcrypt.hash('password', saltRounds),
        role: 'student',
        status: 'active',
        location: 'Chavakacheri',
        phone: '+91 9876543212',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Parent User',
        email: 'parent@school.com',
        password: await bcrypt.hash('password', saltRounds),
        role: 'parent',
        status: 'active',
        location: 'Chavakacheri',
        phone: '+91 9876543213',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    db.data.users = demoUsers;
    await db.write();
  }
};

export default db;
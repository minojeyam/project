// API utility functions
// Mock API for frontend-only operation
const MOCK_DELAY = 1000; // Simulate network delay

// API Base URL (not used in mock mode)
const API_BASE_URL = 'http://localhost:5000/api';

// Mock users for demo purposes
const DEMO_USERS = [
  { 
    id: '1', 
    email: 'admin@iospace.com', 
    password: 'admin123', 
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phoneNumber: '+1234567890',
    isActive: true
  },
  { 
    id: '2', 
    email: 'teacher@iospace.com', 
    password: 'teacher123', 
    firstName: 'Teacher',
    lastName: 'User',
    role: 'teacher',
    phoneNumber: '+1234567891',
    isActive: true
  },
  { 
    id: '3', 
    email: 'parent@iospace.com', 
    password: 'parent123', 
    firstName: 'Parent',
    lastName: 'User',
    role: 'parent',
    phoneNumber: '+1234567892',
    isActive: true
  },
  { 
    id: '4', 
    email: 'student@iospace.com', 
    password: 'student123', 
    firstName: 'Student',
    lastName: 'User',
    role: 'student',
    phoneNumber: '+1234567893',
    isActive: true
  },
];

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Create headers with auth token
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Mock API delay function
const mockDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: createAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem('accessToken', refreshData.data.tokens.accessToken);
              localStorage.setItem('refreshToken', refreshData.data.tokens.refreshToken);
              
              // Retry original request with new token
              const retryConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  'Authorization': `Bearer ${refreshData.data.tokens.accessToken}`,
                },
              };
              
              const retryResponse = await fetch(url, retryConfig);
              return await retryResponse.json();
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.clear();
            window.location.href = '/';
            return;
          }
        } else {
          // No refresh token, redirect to login
          localStorage.clear();
          window.location.href = '/';
          return;
        }
      }
      
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<any> => {
    await mockDelay();
    
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      status: 'success',
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
  },
  register: async (userData: any): Promise<any> => {
    await mockDelay();
    
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    return {
      status: 'success',
      message: 'Registration successful'
    };
  },
  logout: async (): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Logout successful'
    };
  },
  refreshToken: async (refreshToken: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      accessToken: 'new-mock-access-token'
    };
  },
  
  getProfile: () => apiRequest('/auth/me'),
  
  getPendingUsers: () => apiRequest('/auth/pending'),
};

export const usersAPI = {
  getAll: async (params?: any): Promise<any> => {
    await mockDelay();
    
    // Combine all users and add missing fields
    let allUsers = [
      ...DEMO_USERS.map(user => ({
        ...user,
        status: user.status || 'active',
        createdAt: user.createdAt || '2024-01-01T00:00:00.000Z',
        locationId: user.locationId || '1',
        locationName: user.locationId === '2' ? 'Chavakacheri Campus' : 'Nelliyadi Campus'
      })),
      ...ACTIVE_USERS.map(user => ({
        ...user,
        locationName: user.locationId === '2' ? 'Chavakacheri Campus' : 'Nelliyadi Campus'
      }))
    ];
    
    // Apply filters if provided
    if (params?.role) {
      allUsers = allUsers.filter(user => user.role === params.role);
    }
    
    if (params?.status) {
      allUsers = allUsers.filter(user => user.status === params.status);
    }
    
    if (params?.location) {
      allUsers = allUsers.filter(user => user.locationId === params.location);
    }
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      allUsers = allUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Add more sample students for testing unassigned functionality
    const additionalStudents = [
      {
        id: '5',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@student.com',
        role: 'student',
        status: 'active',
        phoneNumber: '+94 77 234 5678',
        locationId: '1',
        locationName: 'Nelliyadi Campus',
        createdAt: '2024-01-15T00:00:00.000Z'
      },
      {
        id: '6',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@student.com',
        role: 'student',
        status: 'active',
        phoneNumber: '+94 77 345 6789',
        locationId: '2',
        locationName: 'Chavakacheri Campus',
        createdAt: '2024-01-16T00:00:00.000Z'
      },
      {
        id: '7',
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol.davis@student.com',
        role: 'student',
        status: 'active',
        phoneNumber: '+94 77 456 7890',
        locationId: '1',
        locationName: 'Nelliyadi Campus',
        createdAt: '2024-01-17T00:00:00.000Z'
      },
      {
        id: '8',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@student.com',
        role: 'student',
        status: 'active',
        phoneNumber: '+94 77 567 8901',
        locationId: '2',
        locationName: 'Chavakacheri Campus',
        createdAt: '2024-01-18T00:00:00.000Z'
      },
      {
        id: '9',
        firstName: 'Emma',
        lastName: 'Brown',
        email: 'emma.brown@student.com',
        role: 'student',
        status: 'active',
        phoneNumber: '+94 77 678 9012',
        locationId: '1',
        locationName: 'Nelliyadi Campus',
        createdAt: '2024-01-19T00:00:00.000Z'
      }
    ];
    
    // Add additional students if role filter is student or no role filter
    if (!params?.role || params.role === 'student') {
      allUsers = [...allUsers, ...additionalStudents];
    }
    
    // Remove password from response
    const usersWithoutPassword = allUsers.map(({ password, ...user }) => user);
    
    return {
      status: 'success',
      data: {
        users: usersWithoutPassword,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalUsers: usersWithoutPassword.length,
          hasNext: false,
          hasPrev: false
        }
      }
    };
  },
  getUsers: async (params?: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      data: {
        users: DEMO_USERS.map(({ password, ...user }) => user),
        totalPages: 1,
        totalUsers: DEMO_USERS.length,
        hasPrev: false
      }
    };
  },
  getUserById: async (id: string): Promise<any> => {
    await mockDelay();
    const user = DEMO_USERS.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return {
      status: 'success',
      data: { user: userWithoutPassword }
    };
  },
  createUser: async (userData: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'User created successfully',
      data: { user: { ...userData, id: Date.now().toString() } }
    };
  },
  updateUser: async (id: string, userData: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'User updated successfully',
      data: { user: { ...userData, id } }
    };
  },
  deleteUser: async (id: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'User deleted successfully'
    };
  },
  
  getById: (id: string) => apiRequest(`/users/${id}`),
  
  approve: (id: string) =>
    apiRequest(`/users/${id}/approve`, { method: 'PUT' }),
  
  reject: (id: string) =>
    apiRequest(`/users/${id}/reject`, { method: 'PUT' }),
  
  update: (id: string, userData: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  delete: (id: string) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

export const locationsAPI = {
  getLocations: async (params?: any): Promise<any> => {
    await mockDelay();
    
    // Mock locations data
    const mockLocations = [
      {
        id: '1',
        name: 'Nelliyadi Campus',
        address: {
          street: 'Main Street',
          city: 'Nelliyadi',
          state: 'Northern Province',
          zipCode: '40000',
          country: 'Sri Lanka'
        },
        phoneNumber: '+94 9876543210',
        email: 'nelliyadi@iospace.com',
        capacity: 500,
        currentEnrollment: 387,
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        name: 'Chavakacheri Campus',
        address: {
          street: 'School Road',
          city: 'Chavakacheri',
          state: 'Northern Province',
          zipCode: '40002',
          country: 'Sri Lanka'
        },
        phoneNumber: '+94 9876543211',
        email: 'chavakacheri@iospace.com',
        capacity: 400,
        currentEnrollment: 298,
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    
    return {
      status: 'success',
      data: {
        locations: mockLocations,
        totalPages: 1,
        totalLocations: mockLocations.length,
        hasPrev: false
      }
    };
  },
  getLocationById: async (id: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      data: { location: null }
    };
  },
  createLocation: async (locationData: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Location created successfully',
      data: { location: { ...locationData, id: Date.now().toString() } }
    };
  },
  updateLocation: async (id: string, locationData: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Location updated successfully',
      data: { location: { ...locationData, id } }
    };
  },
  deleteLocation: async (id: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Location deleted successfully'
    };
  },
  
  getById: (id: string) => apiRequest(`/locations/${id}`),
  
  create: (locationData: any) =>
    apiRequest('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    }),
  
  update: (id: string, locationData: any) =>
    apiRequest(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    }),
  
  delete: (id: string) =>
    apiRequest(`/locations/${id}`, { method: 'DELETE' }),
};

export const classesAPI = {
  getClasses: async (params?: any): Promise<any> => {
    await mockDelay();
    
    // Mock classes data
    const mockClasses = [
      {
        id: '1',
        title: 'Advanced Mathematics',
        level: 'Grade 10',
        subject: 'Mathematics',
        description: 'Advanced mathematical concepts including algebra and geometry',
        locationId: '1',
        locationName: 'Nelliyadi Campus',
        teacherId: '2',
        teacherName: 'Teacher User',
        schedule: {
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:30',
          duration: 90
        },
        capacity: 30,
        currentEnrollment: 25,
        monthlyFee: {
          amount: 45000,
          currency: 'LKR'
        },
        fees: [
          { name: 'Monthly Tuition', amount: 45000, frequency: 'monthly', category: 'tuition' },
          { name: 'Lab Fee', amount: 7500, frequency: 'semester', category: 'lab' }
        ],
        status: 'active',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-15T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        title: 'Physics Fundamentals',
        level: 'Grade 9',
        subject: 'Physics',
        description: 'Introduction to physics concepts and laboratory work',
        locationId: '2',
        locationName: 'Chavakacheri Campus',
        teacherId: '2',
        teacherName: 'Teacher User',
        schedule: {
          dayOfWeek: 2,
          startTime: '11:00',
          endTime: '12:30',
          duration: 90
        },
        capacity: 25,
        currentEnrollment: 22,
        monthlyFee: {
          amount: 52000,
          currency: 'LKR'
        },
        fees: [
          { name: 'Monthly Tuition', amount: 52000, frequency: 'monthly', category: 'tuition' },
          { name: 'Lab Fee', amount: 10000, frequency: 'semester', category: 'lab' }
        ],
        status: 'active',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-15T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '3',
        title: 'Chemistry Lab',
        level: 'Grade 11',
        subject: 'Chemistry',
        description: 'Hands-on chemistry experiments and theory',
        locationId: '1',
        locationName: 'Nelliyadi Campus',
        teacherId: '2',
        teacherName: 'Teacher User',
        schedule: {
          dayOfWeek: 3,
          startTime: '14:00',
          endTime: '15:30',
          duration: 90
        },
        capacity: 20,
        currentEnrollment: 18,
        monthlyFee: {
          amount: 60000,
          currency: 'LKR'
        },
        fees: [
          { name: 'Monthly Tuition', amount: 60000, frequency: 'monthly', category: 'tuition' },
          { name: 'Lab Fee', amount: 15000, frequency: 'semester', category: 'lab' },
          { name: 'Equipment Fee', amount: 5000, frequency: 'annual', category: 'other' }
        ],
        status: 'active',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-15T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    
    return {
      status: 'success',
      data: {
        classes: mockClasses,
        totalPages: 1,
        totalClasses: mockClasses.length,
        hasPrev: false
      }
    };
  },
  getClassById: async (id: string): Promise<any> => {
    await mockDelay();
    
    // Find the class by ID
    const mockClasses = [
      {
        _id: '1',
        title: 'Advanced Mathematics',
        level: 'Grade 10',
        subject: 'Mathematics',
        description: 'Advanced mathematical concepts including algebra and geometry',
        locationId: { _id: '1', name: 'Nelliyadi Campus' },
        teacherId: { _id: '2', firstName: 'Teacher', lastName: 'User', email: 'teacher@iospace.com' },
        schedule: { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', duration: 90 },
        capacity: 30,
        currentEnrollment: 25,
        monthlyFee: { amount: 45000, currency: 'LKR' },
        status: 'active',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-15T00:00:00.000Z',
        enrolledStudents: [
          { studentId: '5', enrollmentDate: '2024-01-15T00:00:00.000Z', status: 'active' },
          { studentId: '6', enrollmentDate: '2024-01-16T00:00:00.000Z', status: 'active' },
          { studentId: '7', enrollmentDate: '2024-01-17T00:00:00.000Z', status: 'active' },
          { studentId: '8', enrollmentDate: '2024-01-18T00:00:00.000Z', status: 'active' },
          { studentId: '9', enrollmentDate: '2024-01-19T00:00:00.000Z', status: 'active' }
        ]
      },
      {
        _id: '2',
        title: 'Physics Fundamentals',
        level: 'Grade 9',
        subject: 'Physics',
        description: 'Introduction to physics concepts and laboratory work',
        locationId: { _id: '2', name: 'Chavakacheri Campus' },
        teacherId: { _id: '2', firstName: 'Teacher', lastName: 'User', email: 'teacher@iospace.com' },
        schedule: { dayOfWeek: 2, startTime: '11:00', endTime: '12:30', duration: 90 },
        capacity: 25,
        currentEnrollment: 22,
        monthlyFee: { amount: 52000, currency: 'LKR' },
        status: 'active',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-15T00:00:00.000Z',
        enrolledStudents: [
          { studentId: '6', enrollmentDate: '2024-01-16T00:00:00.000Z', status: 'active' },
          { studentId: '8', enrollmentDate: '2024-01-18T00:00:00.000Z', status: 'active' }
        ]
      },
      {
        _id: '3',
        title: 'Chemistry Lab',
        level: 'Grade 11',
        subject: 'Chemistry',
        description: 'Hands-on chemistry experiments and theory',
        locationId: { _id: '1', name: 'Nelliyadi Campus' },
        teacherId: { _id: '2', firstName: 'Teacher', lastName: 'User', email: 'teacher@iospace.com' },
        schedule: { dayOfWeek: 3, startTime: '14:00', endTime: '15:30', duration: 90 },
        capacity: 20,
        currentEnrollment: 18,
        monthlyFee: { amount: 60000, currency: 'LKR' },
        status: 'active',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-15T00:00:00.000Z',
        enrolledStudents: [
          { studentId: '7', enrollmentDate: '2024-01-17T00:00:00.000Z', status: 'active' },
          { studentId: '9', enrollmentDate: '2024-01-19T00:00:00.000Z', status: 'active' }
        ]
      }
    ];
    
    const foundClass = mockClasses.find(c => c._id === id);
    
    return {
      status: 'success',
      data: { class: foundClass || null }
    };
  },
  createClass: async (classData: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Class created successfully',
      data: { class: { ...classData, id: Date.now().toString() } }
    };
  },
  updateClass: async (id: string, classData: any): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Class updated successfully',
      data: { class: { ...classData, id } }
    };
  },
  deleteClass: async (id: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Class deleted successfully'
    };
  },
  enrollStudent: async (classId: string, studentId: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Student enrolled successfully'
    };
  },

  enrollStudent: async (classId: string, studentId: string, token?: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Student enrolled successfully'
    };
  },
  
  assignTeacher: async (classId: string, teacherId: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Teacher assigned successfully'
    };
  },
  
  removeStudent: async (classId: string, studentId: string): Promise<any> => {
    await mockDelay();
    return {
      status: 'success',
      message: 'Student removed successfully'
    };
  },
  
  getById: (id: string) => apiRequest(`/classes/${id}`),
  
  create: (classData: any) =>
    apiRequest('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    }),
  
  update: (id: string, classData: any) =>
    apiRequest(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    }),
  
  delete: (id: string) =>
    apiRequest(`/classes/${id}`, { method: 'DELETE' }),
};
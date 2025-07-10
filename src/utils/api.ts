// API utility functions
const API_BASE_URL = 'http://localhost:5000/api';

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
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: (refreshToken: string) =>
    apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  
  getProfile: () => apiRequest('/auth/me'),
  
  getPendingUsers: () => apiRequest('/auth/pending'),
};

export const usersAPI = {
  getAll: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/users${queryString}`);
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
  getAll: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/locations${queryString}`);
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
  getAll: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/classes${queryString}`);
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
  
  enrollStudent: (id: string, studentId: string) =>
    apiRequest(`/classes/${id}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    }),
};
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance that includes credentials
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Data Interfaces
export interface DataItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  registrationLink?: string;
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
}

// Data API Functions
export const fetchAllData = async (): Promise<DataItem[]> => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const createData = async (data: { title: string; description: string }): Promise<DataItem | null> => {
  try {
    const response = await api.post('/data', data);
    return response.data;
  } catch (error) {
    console.error('Error creating data:', error);
    return null;
  }
};

// Event API Functions
export const fetchAllEvents = async (params?: { past?: boolean; upcoming?: boolean }): Promise<Event[]> => {
  try {
    const response = await api.get('/events', { params });
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchEventById = async (id: string): Promise<Event | null> => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    return null;
  }
};

export const createEvent = async (eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>): Promise<Event | null> => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
};

export const updateEvent = async (id: string, eventData: Partial<Omit<Event, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Event | null> => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with id ${id}:`, error);
    return null;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/events/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    return false;
  }
};

// Authentication API Functions
export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse | null> => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const registerAdmin = async (userData: { name: string; email: string; password: string }): Promise<AuthResponse | null> => {
  try {
    const response = await api.post('/auth/register-admin', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering admin:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

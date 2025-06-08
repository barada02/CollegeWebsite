import { loginUser, getCurrentUser } from './api';

// Check if we're on the client side
const isBrowser = typeof window !== 'undefined';

// Save token to both localStorage and cookies for middleware compatibility
export const setToken = (token: string): void => {
  if (isBrowser) {
    // Save to localStorage for client-side access
    localStorage.setItem('token', token);
    
    // Save to cookies for middleware access
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (isBrowser) {
    return localStorage.getItem('token');
  }
  return null;
};

// Remove token from both localStorage and cookies
export const removeToken = (): void => {
  if (isBrowser) {
    // Remove from localStorage
    localStorage.removeItem('token');
    
    // Remove from cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};

// Login user and save token
export const login = async (email: string, password: string): Promise<boolean> => {
  const response = await loginUser({ email, password });
  
  if (response && response.token) {
    setToken(response.token);
    return true;
  }
  
  return false;
};

// Logout user
export const logout = (): void => {
  removeToken();
  // If using next/router or similar for client-side navigation
  // you could redirect here
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// Check if user is admin (requires server check)
export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user && user.role === 'admin';
  } catch (error) {
    return false;
  }
};

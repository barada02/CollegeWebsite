import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// About API interface types
export interface AboutStats {
  students: number;
  faculty: number;
  programs: number;
  yearsOfExcellence: number;
}

export interface Achievement {
  _id?: string;
  title: string;
  description: string;
  year: number;
  date?: string;
}

export interface LeadershipMember {
  _id?: string;
  name: string;
  position: string;
  bio: string;
  image?: string;
  email?: string;
}

export interface AboutData {
  _id?: string;
  mission: string;
  vision: string;
  values: string;
  history: string;
  stats: AboutStats;
  achievements: Achievement[];
  leadership: LeadershipMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// About API service
export class AboutApiService {
  // Get about information
  static async getAbout(): Promise<AboutData> {
    try {
      const response = await api.get<ApiResponse<AboutData>>('/about');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch about data');
    } catch (error) {
      console.error('Error fetching about data:', error);
      throw error;
    }
  }

  // Update complete about information
  static async updateAbout(data: Partial<AboutData>): Promise<AboutData> {
    try {
      const response = await api.put<ApiResponse<AboutData>>('/about', data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update about data');
    } catch (error) {
      console.error('Error updating about data:', error);
      throw error;
    }
  }

  // Update only statistics
  static async updateStats(stats: AboutStats): Promise<AboutStats> {
    try {
      const response = await api.put<ApiResponse<AboutStats>>('/about/stats', stats);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update statistics');
    } catch (error) {
      console.error('Error updating statistics:', error);
      throw error;
    }
  }

  // Add achievement
  static async addAchievement(achievement: Omit<Achievement, '_id'>): Promise<Achievement> {
    try {
      const response = await api.post<ApiResponse<Achievement>>('/about/achievements', achievement);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to add achievement');
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  }

  // Add leadership member
  static async addLeadershipMember(member: Omit<LeadershipMember, '_id'>): Promise<LeadershipMember> {
    try {
      const response = await api.post<ApiResponse<LeadershipMember>>('/about/leadership', member);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to add leadership member');
    } catch (error) {
      console.error('Error adding leadership member:', error);
      throw error;
    }
  }

  // Delete achievement
  static async deleteAchievement(achievementId: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/about/achievements/${achievementId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete achievement');
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  }

  // Delete leadership member
  static async deleteLeadershipMember(memberId: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/about/leadership/${memberId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete leadership member');
      }
    } catch (error) {
      console.error('Error deleting leadership member:', error);
      throw error;
    }
  }

  // Initialize about data (development only)
  static async initializeAbout(): Promise<AboutData> {
    try {
      const response = await api.post<ApiResponse<AboutData>>('/about/initialize');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to initialize about data');
    } catch (error) {
      console.error('Error initializing about data:', error);
      throw error;
    }
  }
}

export default AboutApiService;

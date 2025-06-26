import { useState, useEffect } from 'react';
import AboutApiService from '../services/aboutApi';
import type { AboutData, AboutStats, Achievement, LeadershipMember } from '../services/aboutApi';

export const useAboutData = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch about data
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AboutApiService.getAbout();
      setAboutData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch about data');
      console.error('Error fetching about data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update complete about information
  const updateAbout = async (data: Partial<AboutData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = await AboutApiService.updateAbout(data);
      setAboutData(updatedData);
      return updatedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update about data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update statistics only
  const updateStats = async (stats: AboutStats) => {
    try {
      setLoading(true);
      setError(null);
      const updatedStats = await AboutApiService.updateStats(stats);
      if (aboutData) {
        setAboutData({ ...aboutData, stats: updatedStats });
      }
      return updatedStats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add achievement
  const addAchievement = async (achievement: Omit<Achievement, '_id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newAchievement = await AboutApiService.addAchievement(achievement);
      if (aboutData) {
        setAboutData({
          ...aboutData,
          achievements: [...aboutData.achievements, newAchievement]
        });
      }
      return newAchievement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add leadership member
  const addLeadershipMember = async (member: Omit<LeadershipMember, '_id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newMember = await AboutApiService.addLeadershipMember(member);
      if (aboutData) {
        setAboutData({
          ...aboutData,
          leadership: [...aboutData.leadership, newMember]
        });
      }
      return newMember;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add leadership member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete achievement
  const deleteAchievement = async (achievementId: string) => {
    try {
      setLoading(true);
      setError(null);
      await AboutApiService.deleteAchievement(achievementId);
      if (aboutData) {
        setAboutData({
          ...aboutData,
          achievements: aboutData.achievements.filter(achievement => achievement._id !== achievementId)
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete leadership member
  const deleteLeadershipMember = async (memberId: string) => {
    try {
      setLoading(true);
      setError(null);
      await AboutApiService.deleteLeadershipMember(memberId);
      if (aboutData) {
        setAboutData({
          ...aboutData,
          leadership: aboutData.leadership.filter(leader => leader._id !== memberId)
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete leadership member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize about data
  const initializeAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AboutApiService.initializeAbout();
      setAboutData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize about data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAboutData();
  }, []);

  return {
    aboutData,
    loading,
    error,
    fetchAboutData,
    updateAbout,
    updateStats,
    addAchievement,
    addLeadershipMember,
    deleteAchievement,
    deleteLeadershipMember,
    initializeAbout,
  };
};

import React, { useState } from 'react';
import Button from '../../components/shared/Button';
import { useAboutData } from '../../hooks/useAboutData';
import type { AboutStats, Achievement, LeadershipMember } from '../../services/aboutApi';
import './ManageAbout.css';

export const ManageAbout: React.FC = () => {
  const {
    aboutData,
    loading,
    error,
    updateAbout,
    updateStats,
    addAchievement,
    deleteAchievement,
    addLeadershipMember,
    deleteLeadershipMember,
    initializeAbout
  } = useAboutData();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingStats, setEditingStats] = useState<AboutStats | null>(null);
  const [editingBasicInfo, setEditingBasicInfo] = useState<{[key: string]: string}>({});
  const [showAddAchievement, setShowAddAchievement] = useState<boolean>(false);
  const [showAddLeader, setShowAddLeader] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, '_id'>>({
    title: '',
    description: '',
    year: new Date().getFullYear()
  });
  const [newLeader, setNewLeader] = useState<Omit<LeadershipMember, '_id'>>({
    name: '',
    position: '',
    bio: '',
    email: ''
  });

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle basic information update
  const handleUpdateBasicInfo = async (field: string, value: string) => {
    try {
      await updateAbout({ [field]: value });
      setEditingSection(null);
      setEditingBasicInfo({});
      showSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
    } catch (error) {
      console.error('Error updating basic info:', error);
    }
  };

  // Start editing basic info
  const startEditingBasicInfo = (field: string, currentValue: string) => {
    setEditingSection(field);
    setEditingBasicInfo({ [field]: currentValue });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null);
    setEditingBasicInfo({});
    setEditingStats(null);
    setShowAddAchievement(false);
    setShowAddLeader(false);
  };

  // Handle stats update
  const handleStatsUpdate = async () => {
    if (!editingStats) return;
    
    try {
      await updateStats(editingStats);
      setEditingStats(null);
      showSuccess('Statistics updated successfully!');
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  // Start editing stats
  const startEditingStats = () => {
    if (aboutData?.stats) {
      setEditingStats({ ...aboutData.stats });
    }
  };

  // Handle achievement addition
  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.description) return;
    
    try {
      await addAchievement(newAchievement);
      setNewAchievement({
        title: '',
        description: '',
        year: new Date().getFullYear()
      });
      setShowAddAchievement(false);
      showSuccess('Achievement added successfully!');
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  // Handle leadership member addition
  const handleAddLeader = async () => {
    if (!newLeader.name || !newLeader.position || !newLeader.bio) return;
    
    try {
      await addLeadershipMember(newLeader);
      setNewLeader({
        name: '',
        position: '',
        bio: '',
        email: ''
      });
      setShowAddLeader(false);
      showSuccess('Leadership member added successfully!');
    } catch (error) {
      console.error('Error adding leader:', error);
    }
  };

  // Handle initialization
  const handleInitialize = async () => {
    try {
      await initializeAbout();
    } catch (error) {
      console.error('Error initializing about data:', error);
    }
  };

  // Handle achievement deletion
  const handleDeleteAchievement = async (achievementId: string) => {
    if (!achievementId) return;
    
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await deleteAchievement(achievementId);
        showSuccess('Achievement deleted successfully!');
      } catch (error) {
        console.error('Error deleting achievement:', error);
      }
    }
  };

  // Handle leadership member deletion
  const handleDeleteLeader = async (leaderId: string) => {
    if (!leaderId) return;
    
    if (window.confirm('Are you sure you want to delete this leadership member?')) {
      try {
        await deleteLeadershipMember(leaderId);
        showSuccess('Leadership member deleted successfully!');
      } catch (error) {
        console.error('Error deleting leader:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="manage-about-page">
        <div className="loading-state">
          <div className="loading-spinner">Loading...</div>
          <p>Loading about information...</p>
        </div>
      </div>
    );
  }

  if (error && !aboutData) {
    return (
      <div className="manage-about-page">
        <div className="error-state">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <div className="error-actions">
            <Button variant="admin" size="md" onClick={handleInitialize}>
              Initialize About Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="manage-about-page">
        <div className="empty-state">
          <h2>No About Data Found</h2>
          <p>Initialize the about section to get started.</p>
          <Button variant="admin" size="md" onClick={handleInitialize}>
            Initialize About Data
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="manage-about-page">
      <div className="page-header">
        <h1 className="page-title">About Management</h1>
        <p className="page-subtitle">Manage college information, mission, vision, and statistics</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* College Information */}
      <section className="content-section">
        <div className="section-header">
          <h2>College Information</h2>
        </div>
        <div className="info-grid">
          {/* Mission Statement */}
          <div className="info-card">
            <h3>Mission Statement</h3>
            {editingSection === 'mission' ? (
              <div className="edit-form">
                <textarea
                  value={editingBasicInfo.mission || ''}
                  onChange={(e) => setEditingBasicInfo({ ...editingBasicInfo, mission: e.target.value })}
                  rows={4}
                  className="edit-textarea"
                />
                <div className="form-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => handleUpdateBasicInfo('mission', editingBasicInfo.mission || '')}
                  >
                    Save
                  </Button>
                  <Button variant="admin" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p>{aboutData?.mission}</p>
                <div className="card-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => startEditingBasicInfo('mission', aboutData?.mission || '')}
                  >
                    Edit
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Vision Statement */}
          <div className="info-card">
            <h3>Vision Statement</h3>
            {editingSection === 'vision' ? (
              <div className="edit-form">
                <textarea
                  value={editingBasicInfo.vision || ''}
                  onChange={(e) => setEditingBasicInfo({ ...editingBasicInfo, vision: e.target.value })}
                  rows={4}
                  className="edit-textarea"
                />
                <div className="form-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => handleUpdateBasicInfo('vision', editingBasicInfo.vision || '')}
                  >
                    Save
                  </Button>
                  <Button variant="admin" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p>{aboutData?.vision}</p>
                <div className="card-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => startEditingBasicInfo('vision', aboutData?.vision || '')}
                  >
                    Edit
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* College Values */}
          <div className="info-card">
            <h3>College Values</h3>
            {editingSection === 'values' ? (
              <div className="edit-form">
                <textarea
                  value={editingBasicInfo.values || ''}
                  onChange={(e) => setEditingBasicInfo({ ...editingBasicInfo, values: e.target.value })}
                  rows={4}
                  className="edit-textarea"
                />
                <div className="form-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => handleUpdateBasicInfo('values', editingBasicInfo.values || '')}
                  >
                    Save
                  </Button>
                  <Button variant="admin" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p>{aboutData?.values}</p>
                <div className="card-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => startEditingBasicInfo('values', aboutData?.values || '')}
                  >
                    Edit
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* History */}
          <div className="info-card full-width">
            <h3>College History</h3>
            {editingSection === 'history' ? (
              <div className="edit-form">
                <textarea
                  value={editingBasicInfo.history || ''}
                  onChange={(e) => setEditingBasicInfo({ ...editingBasicInfo, history: e.target.value })}
                  rows={6}
                  className="edit-textarea"
                />
                <div className="form-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => handleUpdateBasicInfo('history', editingBasicInfo.history || '')}
                  >
                    Save
                  </Button>
                  <Button variant="admin" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p>{aboutData?.history}</p>
                <div className="card-actions">
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => startEditingBasicInfo('history', aboutData?.history || '')}
                  >
                    Edit
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="content-section">
        <div className="section-header">
          <h2>College Statistics</h2>
          {!editingStats && (
            <Button variant="admin" size="sm" onClick={startEditingStats}>
              Edit Stats
            </Button>
          )}
        </div>
        {editingStats ? (
          <div className="stats-edit-form">
            <div className="stats-grid">
              <div className="stat-edit-item">
                <label>Total Students</label>
                <input
                  type="number"
                  value={editingStats.students}
                  onChange={(e) => setEditingStats({ ...editingStats, students: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="stat-edit-item">
                <label>Faculty Members</label>
                <input
                  type="number"
                  value={editingStats.faculty}
                  onChange={(e) => setEditingStats({ ...editingStats, faculty: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="stat-edit-item">
                <label>Academic Programs</label>
                <input
                  type="number"
                  value={editingStats.programs}
                  onChange={(e) => setEditingStats({ ...editingStats, programs: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="stat-edit-item">
                <label>Years of Service</label>
                <input
                  type="number"
                  value={editingStats.yearsOfExcellence}
                  onChange={(e) => setEditingStats({ ...editingStats, yearsOfExcellence: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="form-actions">
              <Button variant="admin" size="sm" onClick={handleStatsUpdate}>
                Save Statistics
              </Button>
              <Button variant="admin" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="stats-display">
            <div className="stat-item">
              <label>Total Students</label>
              <span className="stat-value">{aboutData?.stats.students?.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <label>Faculty Members</label>
              <span className="stat-value">{aboutData?.stats.faculty?.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <label>Academic Programs</label>
              <span className="stat-value">{aboutData?.stats.programs}</span>
            </div>
            <div className="stat-item">
              <label>Years of Service</label>
              <span className="stat-value">{aboutData?.stats.yearsOfExcellence}</span>
            </div>
          </div>
        )}
      </section>

      {/* Achievements */}
      <section className="content-section">
        <div className="section-header">
          <h2>Achievements</h2>
          {!showAddAchievement && (
            <Button variant="admin" size="sm" onClick={() => setShowAddAchievement(true)}>
              Add Achievement
            </Button>
          )}
        </div>

        {showAddAchievement && (
          <div className="add-form">
            <h3>Add New Achievement</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Achievement title"
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={newAchievement.year}
                  onChange={(e) => setNewAchievement({ ...newAchievement, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  placeholder="Year"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                rows={3}
                placeholder="Achievement description"
              />
            </div>
            <div className="form-actions">
              <Button variant="admin" size="sm" onClick={handleAddAchievement}>
                Add Achievement
              </Button>
              <Button variant="admin" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="achievements-list">
          {aboutData?.achievements.map((achievement, index) => (
            <div key={index} className="achievement-item">
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <span className="achievement-date">{achievement.year}</span>
              </div>
              <div className="achievement-actions">
                {achievement._id && (
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => handleDeleteAchievement(achievement._id!)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="content-section">
        <div className="section-header">
          <h2>Leadership Team</h2>
          {!showAddLeader && (
            <Button variant="admin" size="sm" onClick={() => setShowAddLeader(true)}>
              Add Leader
            </Button>
          )}
        </div>

        {showAddLeader && (
          <div className="add-form">
            <h3>Add New Leadership Member</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newLeader.name}
                  onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={newLeader.position}
                  onChange={(e) => setNewLeader({ ...newLeader, position: e.target.value })}
                  placeholder="Position/Title"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                value={newLeader.email}
                onChange={(e) => setNewLeader({ ...newLeader, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={newLeader.bio}
                onChange={(e) => setNewLeader({ ...newLeader, bio: e.target.value })}
                rows={4}
                placeholder="Leadership member bio"
              />
            </div>
            <div className="form-actions">
              <Button variant="admin" size="sm" onClick={handleAddLeader}>
                Add Leader
              </Button>
              <Button variant="admin" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="leadership-list">
          {aboutData?.leadership.map((leader, index) => (
            <div key={index} className="leader-item">
              <div className="leader-content">
                <h3>{leader.name}</h3>
                <h4>{leader.position}</h4>
                <p>{leader.bio}</p>
                {leader.email && (
                  <div className="leader-contact">
                    <span>Email: {leader.email}</span>
                  </div>
                )}
              </div>
              <div className="leader-actions">
                {leader._id && (
                  <Button 
                    variant="admin" 
                    size="sm" 
                    onClick={() => handleDeleteLeader(leader._id!)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManageAbout;

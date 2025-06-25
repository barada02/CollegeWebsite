import React from 'react';
import Button from '../../components/shared/Button';
import './ManageEvents.css';

export const ManageEvents: React.FC = () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Annual Science Fair',
      date: '2025-03-15',
      time: '9:00 AM',
      location: 'Main Auditorium',
      status: 'upcoming',
      attendees: 250
    },
    {
      id: 2,
      title: 'Career Development Workshop',
      date: '2025-02-28',
      time: '2:00 PM',
      location: 'Conference Hall',
      status: 'upcoming',
      attendees: 150
    },
    {
      id: 3,
      title: 'Alumni Reunion',
      date: '2025-01-20',
      time: '6:00 PM',
      location: 'Campus Grounds',
      status: 'completed',
      attendees: 500
    }
  ];

  return (
    <div className="manage-events-page">
      <div className="page-header">
        <h1 className="page-title">Events Management</h1>
        <p className="page-subtitle">Create, edit, and manage college events and activities</p>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-section">
          <input type="text" placeholder="Search events..." className="search-input" />
          <select className="filter-select">
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <Button variant="admin" size="md">Create New Event</Button>
      </div>

      {/* Events Overview */}
      <section className="events-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Total Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">8</div>
            <div className="stat-label">Upcoming</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1,250</div>
            <div className="stat-label">Total Attendees</div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="events-list">
        <div className="list-header">
          <h2>Recent Events</h2>
        </div>
        <div className="events-table">
          <div className="table-header">
            <div className="col-title">Event Title</div>
            <div className="col-date">Date & Time</div>
            <div className="col-location">Location</div>
            <div className="col-status">Status</div>
            <div className="col-attendees">Attendees</div>
            <div className="col-actions">Actions</div>
          </div>
          {mockEvents.map(event => (
            <div key={event.id} className="table-row">
              <div className="col-title">
                <h3 className="event-title">{event.title}</h3>
              </div>
              <div className="col-date">
                <div className="date-info">
                  <span className="date">{event.date}</span>
                  <span className="time">{event.time}</span>
                </div>
              </div>
              <div className="col-location">{event.location}</div>
              <div className="col-status">
                <span className={`status-badge ${event.status}`}>
                  {event.status}
                </span>
              </div>
              <div className="col-attendees">{event.attendees}</div>
              <div className="col-actions">
                <div className="action-buttons">
                  <Button variant="admin" size="sm">Edit</Button>
                  <Button variant="admin" size="sm">View</Button>
                  <Button variant="admin" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManageEvents;

/* eslint-disable react/prop-types */
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/components.css';

const EventCard = ({ event, onRegister, onUnregister, isRegistered }) => {
  const { user } = useAuth();

  const handleRegister = async () => {
    try {
      await api.post(`/registrations/${event._id}`);
      // The parent component should handle the state update
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleUnregister = async () => {
    try {
      await api.delete(`/registrations/${event._id}`);
      // The parent component should handle the state update
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unregister');
    }
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <span className={`event-status status-${event.status || 'default'}`}>
          {event.status}
        </span>
      </div>
      
      <p className="event-description">{event.description}</p>
      
      <div className="event-details">
        <div className="event-info">
          <span className="event-date">
            {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="event-time">{event.time}</span>
          <span className="event-location">{event.location}</span>
        </div>
        
        <div className="event-volunteers">
          <span>{event.currentVolunteers || 0}/{event.maxVolunteers || 'N/A'} volunteers</span>
        </div>
      </div>
      
      {user && user.role === 'volunteer' && (
        <div className="event-actions">
          {isRegistered ? (
            <button onClick={handleUnregister} className="btn btn-secondary">
              Unregister
            </button>
          ) : (
            <button 
              onClick={handleRegister}
              className="btn btn-primary"
              disabled={event.currentVolunteers >= event.maxVolunteers}
            >
              {event.currentVolunteers >= event.maxVolunteers ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard; 
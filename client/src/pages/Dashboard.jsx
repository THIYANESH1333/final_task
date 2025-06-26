import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // ✅ Ensure Dashboard.css exists in same folder

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Volunteer Dashboard</h1>

      <div className="dashboard-welcome-card">
        <h2>Hello, Volunteer!</h2>
        <p>Thank you for contributing your time and effort. You make a difference!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Events Joined</h3>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h3>Total Hours</h3>
          <p>48 hrs</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Events</h3>
          <p>2</p>
        </div>
      </div>

      <div className="recent-events">
        <h2>Recent Events</h2>
        <ul>
          <li>🌿 Tree Plantation Drive – June 15</li>
          <li>📚 Book Donation Camp – June 22</li>
          <li>🧹 Clean City Campaign – July 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

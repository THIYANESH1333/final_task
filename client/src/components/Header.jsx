import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Volunteer Management
          </Link>
          
          <nav className="nav">
            {user.role === 'admin' ? (
              <>
                <Link to="/admin" className="nav-link">Dashboard</Link>
                <Link to="/admin/events" className="nav-link">Events</Link>
                <Link to="/admin/users" className="nav-link">Users</Link>
                <Link to="/admin/registrations" className="nav-link">Registrations</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/events" className="nav-link">Events</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
              </>
            )}
          </nav>
          
          <div className="user-menu">
            <span className="user-name">Hello, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
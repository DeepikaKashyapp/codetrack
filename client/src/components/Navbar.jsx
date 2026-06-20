import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Code2, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo flex-center">
          <Code2 size={28} className="logo-icon" />
          <span className="text-gradient font-bold">CodeTrack++</span>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/problems" className="nav-item">Problems</Link>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <button className="logout-btn flex-center" onClick={handleLogout}>
                <LogOut size={16} style={{ marginRight: '6px' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register">
                <button className="primary-btn">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

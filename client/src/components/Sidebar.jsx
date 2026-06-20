import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Trophy, BarChart2, Settings, LogOut, Code2, GraduationCap, ChevronDown, Star, ClipboardList, Lock, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Code2 className="logo-icon" size={24} />
          <span className="logo-text">CodeTrack<span className="text-gradient">++</span></span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} /> Problems
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Trophy size={20} /> Leaderboard
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BarChart2 size={20} /> Analytics
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} /> Explore
        </NavLink>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="section-title">My Lists</span>
          <div className="section-actions">
            <Plus size={16} className="action-icon" />
            <ChevronDown size={16} className="action-icon" />
          </div>
        </div>
        <div className="sidebar-list">
          <div className="list-item">
            <div className="list-item-left">
              <div className="list-icon-wrapper bg-white">
                <Star size={14} color="#FF5500" fill="#FF5500" />
              </div>
              <span>Favorite</span>
            </div>
            <Lock size={14} className="lock-icon" />
          </div>
          <div className="list-item">
            <div className="list-item-left">
              <div className="list-icon-wrapper bg-white">
                <ClipboardList size={14} color="#4A90E2" />
              </div>
              <span>to do</span>
            </div>
            <Lock size={14} className="lock-icon" />
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;

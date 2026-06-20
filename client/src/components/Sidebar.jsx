import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Trophy, BarChart2, Settings, LogOut, Code2, GraduationCap, ChevronDown, Star, ClipboardList, Lock, Plus, List as ListIcon, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (token) {
      fetchLists();
    }
  }, [token]);

  const fetchLists = async () => {
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLists(data.data);
      }
    } catch (err) {
      console.error('Error fetching lists', err);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/lists', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newListName })
      });
      if (response.ok) {
        setNewListName('');
        setIsCreatingList(false);
        fetchLists();
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to create list');
      }
    } catch (err) {
      alert('Error creating list');
    }
  };

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
            <Plus size={16} className="action-icon" onClick={() => setIsCreatingList(!isCreatingList)} style={{ cursor: 'pointer' }} />
            <ChevronDown size={16} className="action-icon" />
          </div>
        </div>
        
        {isCreatingList && (
          <form onSubmit={handleCreateList} className="create-list-form" style={{ padding: '0 12px 12px 12px', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="List name..." 
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '13px' }}
              autoFocus
            />
            <button type="submit" style={{ background: 'var(--success)', border: 'none', borderRadius: '4px', padding: '0 8px', color: '#fff', cursor: 'pointer' }}>
              <CheckCircle size={14} />
            </button>
          </form>
        )}

        <div className="sidebar-list">
          {lists.map(list => (
            <div 
              className="list-item" 
              key={list.id} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              <div className="list-item-left">
                <div className="list-icon-wrapper bg-white">
                  {list.name === 'Favorite' ? (
                    <Star size={14} color="#FF5500" fill="#FF5500" />
                  ) : list.name === 'To Do' ? (
                    <ClipboardList size={14} color="#4A90E2" />
                  ) : (
                    <ListIcon size={14} color="#8E8E93" />
                  )}
                </div>
                <span>{list.name}</span>
              </div>
              {list.is_default && <Lock size={14} className="lock-icon" />}
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;

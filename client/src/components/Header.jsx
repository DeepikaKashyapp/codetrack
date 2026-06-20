import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flame, Bell, Settings, LogOut, User as UserIcon, Megaphone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import SettingsModal from './SettingsModal';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const notifications = [
    { id: 1, type: 'system', text: 'Weekly Contest 507 is approaching. Join here!', time: '2 hours ago' },
    { id: 2, type: 'alert', text: 'You have successfully completed the 14-day study plan.', time: '2 days ago' },
    { id: 3, type: 'alert', text: 'New problem added to your favorite list.', time: '3 days ago' },
    { id: 4, type: 'system', text: 'Scheduled maintenance this weekend.', time: '10 days ago' }
  ];
  
  // Mapping paths to titles
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Command Center';
      case '/problems': return 'Problems Library';
      case '/leaderboard': return 'Global Leaderboard';
      case '/analytics': return 'Analytics & Insights';
      case '/profile': return 'My Profile';
      default: return 'CodeTrack++';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <header className="top-header">
        <div className="header-left">
          <h1>{getPageTitle()}</h1>
          <span className="date-subtext font-mono">{currentDate}</span>
        </div>
        
        <div className="header-right">
          <div className="streak-badge font-mono">
            <Flame size={16} color="var(--accent-primary)" />
            <span>12 day streak</span>
          </div>
          
          <div className="notification-container" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <Bell size={20} color="var(--text-secondary)" />
              <span className="notification-dot"></span>
            </button>
            
            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notification-list">
                  {notifications.map(notif => (
                    <div key={notif.id} className="notification-item">
                      <div className="notification-icon">
                        {notif.type === 'system' ? (
                          <Megaphone size={16} color="var(--accent-primary)" />
                        ) : (
                          <Bell size={16} color="var(--text-secondary)" />
                        )}
                      </div>
                      <div className="notification-content">
                        <p className="notification-text">{notif.text}</p>
                        <span className="notification-time font-mono">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button className="icon-btn" style={{padding: '4px'}}>
                    <Settings size={16} color="var(--text-secondary)" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-container" style={{ position: 'relative' }}>
            <div 
              className="profile-circle font-mono" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ cursor: 'pointer' }}
            >
              YC
            </div>
            
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <div className="dropdown-name">{user?.username === 'you_coder' ? 'You Coder' : user?.username}</div>
                  <div className="dropdown-username font-mono">@{user?.username}</div>
                  <div className="dropdown-rank font-mono"><span style={{color: 'var(--accent-primary)'}}>#347</span> Global Rank</div>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                >
                  <UserIcon size={16} /> View Profile
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsSettingsOpen(true);
                  }}
                >
                  <Settings size={16} /> Settings
                </button>
                <button className="dropdown-item" onClick={logout}><LogOut size={16} /> Log Out</button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default Header;

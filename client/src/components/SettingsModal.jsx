import React, { useState } from 'react';
import { X, Trash2, Link as LinkIcon, Shield, Bell } from 'lucide-react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('account');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <button 
              className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <Shield size={16} /> Account Security
            </button>
            <button 
              className={`settings-tab ${activeTab === 'linked' ? 'active' : ''}`}
              onClick={() => setActiveTab('linked')}
            >
              <LinkIcon size={16} /> Linked Accounts
            </button>
            <button 
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={16} /> Notifications
            </button>
            <button 
              className={`settings-tab danger ${activeTab === 'danger' ? 'active' : ''}`}
              onClick={() => setActiveTab('danger')}
            >
              <Trash2 size={16} /> Danger Zone
            </button>
          </div>

          <div className="settings-body">
            {activeTab === 'account' && (
              <div className="settings-panel">
                <h3>Account Security</h3>
                <p className="text-muted mb-4">Manage your password and security settings.</p>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <button className="save-btn">Update Password</button>
              </div>
            )}

            {activeTab === 'linked' && (
              <div className="settings-panel">
                <h3>Linked Accounts</h3>
                <p className="text-muted mb-4">Connect your profiles for easy login and data sync.</p>
                
                <div className="linked-account-item">
                  <div className="linked-account-info">
                    <strong>GitHub</strong>
                    <span className="text-muted text-sm">Not connected</span>
                  </div>
                  <button className="action-btn connect">Connect</button>
                </div>
                
                <div className="linked-account-item mt-4">
                  <div className="linked-account-info">
                    <strong>Google</strong>
                    <span className="text-muted text-sm">Connected as you_coder@gmail.com</span>
                  </div>
                  <button className="action-btn disconnect">Disconnect</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-panel">
                <h3>Notification Preferences</h3>
                <p className="text-muted mb-4">Choose what we email you about.</p>
                
                <label className="checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Weekly Contest Reminders</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Daily Streak Alerts</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" />
                  <span>Marketing & Offers</span>
                </label>
                
                <button className="save-btn mt-4">Save Preferences</button>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="settings-panel">
                <h3 className="text-error">Danger Zone</h3>
                <p className="text-muted mb-4">Irreversible destructive actions.</p>
                
                <div className="danger-box">
                  <div className="danger-text">
                    <strong>Delete Account</strong>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <button className="delete-btn">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

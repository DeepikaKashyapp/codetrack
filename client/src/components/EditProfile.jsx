import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Save, User as UserIcon, Code, MapPin, GitBranch, Link as LinkIcon } from 'lucide-react';
import './EditProfile.css';

const EditProfile = ({ isOpen, onClose }) => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    github_url: '',
    leetcode_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        location: user.location || '',
        github_url: user.github_url || '',
        leetcode_url: user.leetcode_url || ''
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        updateUser(data.data);
        showToast('Profile updated successfully!');
        setTimeout(onClose, 1500); // Close after a brief delay
      } else {
        showToast(data.error?.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred while saving.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <span className="subtext font-mono">Changes saved via PUT /api/users/profile</span>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label><Code size={14}/> Username</label>
            <input 
              type="text" 
              className="input-field readonly font-mono" 
              value={user?.username || ''} 
              readOnly 
            />
          </div>

          <div className="form-group">
            <label><UserIcon size={14}/> Bio</label>
            <textarea 
              name="bio"
              className="input-field" 
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label><MapPin size={14}/> Location</label>
            <input 
              type="text" 
              name="location"
              className="input-field" 
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className="form-group">
            <label><GitBranch size={14}/> GitHub URL</label>
            <input 
              type="url" 
              name="github_url"
              className="input-field font-mono" 
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label><LinkIcon size={14}/> LeetCode URL</label>
            <input 
              type="url" 
              name="leetcode_url"
              className="input-field font-mono" 
              value={formData.leetcode_url}
              onChange={handleChange}
              placeholder="https://leetcode.com/..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel font-mono" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save font-mono" disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;

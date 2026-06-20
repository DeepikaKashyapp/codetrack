import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapPin, GitBranch, Link as LinkIcon, Edit2, CheckCircle, XCircle, Clock, Trophy, Flame } from 'lucide-react';
import EditProfile from '../components/EditProfile';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Generate Dummy Heatmap Data (365 days)
  const heatmapData = Array.from({ length: 365 }).map(() => {
    // 0 = no activity, 1-4 = activity levels
    const rand = Math.random();
    if (rand < 0.5) return 0;
    if (rand < 0.75) return 1;
    if (rand < 0.9) return 2;
    if (rand < 0.97) return 3;
    return 4;
  });

  const recentSubmissions = [
    { id: '#2847', problem: 'Merge K Sorted Lists', difficulty: 'Hard', status: 'Accepted', language: 'Python', time: '2m ago' },
    { id: '#2846', problem: 'LRU Cache', difficulty: 'Medium', status: 'Accepted', language: 'Go', time: '18m ago' },
    { id: '#2845', problem: 'Trapping Rain Water', difficulty: 'Hard', status: 'Wrong Answer', language: 'C++', time: '1h ago' },
    { id: '#2844', problem: 'Binary Search Tree', difficulty: 'Easy', status: 'Accepted', language: 'Java', time: '3h ago' },
    { id: '#2843', problem: 'Max Sliding Window', difficulty: 'Hard', status: 'Time Limit', language: 'Python', time: '5h ago' }
  ];

  return (
    <div className="profile-page">
      {/* Top Section: User Identity */}
      <section className="profile-top-section">
        <div className="profile-banner">
          <button className="edit-profile-btn font-mono" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 size={14}/> Edit Profile
          </button>
        </div>
        <div className="profile-identity">
          <div className="identity-left">
            <div className="avatar-container font-mono">YC</div>
            <div className="identity-details">
              <div className="identity-header">
                <span className="font-mono text-muted username-tag">@{user?.username}</span>
                <div className="rank-badge font-mono"><Trophy size={14}/> #347 Global</div>
              </div>
              <p className="bio-text">{user?.bio || 'Senior SWE @ Anthropic • Competitive programmer • Coffee > Sleep • Building things that scale.'}</p>
              <div className="identity-links font-mono text-muted">
                <span><MapPin size={14}/> {user?.location || 'San Francisco, CA'}</span>
                <a href={user?.github_url || '#'} target="_blank" rel="noreferrer"><GitBranch size={14}/> GitHub ↗</a>
                <a href={user?.leetcode_url || '#'} target="_blank" rel="noreferrer"><LinkIcon size={14}/> LeetCode ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Section: Stats Cards */}
      <section className="profile-stats-section">
        <div className="stat-card">
          <div className="stat-header font-mono">TOTAL SOLVED <CheckCircle size={16} color="var(--accent-primary)"/></div>
          <div className="stat-value text-accent font-mono">134</div>
          <div className="stat-breakdown font-mono">
            <span style={{color: 'var(--success)'}}>67 <span className="text-muted">Easy</span></span>
            <span style={{color: 'var(--warning)'}}>48 <span className="text-muted">Med</span></span>
            <span style={{color: 'var(--error)'}}>19 <span className="text-muted">Hard</span></span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar easy" style={{ width: '50%' }}></div>
            <div className="progress-bar med" style={{ width: '35%' }}></div>
            <div className="progress-bar hard" style={{ width: '15%' }}></div>
          </div>
        </div>

        <div className="stat-card center-align" style={{borderLeftColor: 'var(--info)'}}>
          <div className="stat-header font-mono">ACCURACY PROFILE</div>
          <div className="gauge-container">
            {/* CSS-based semi-circle gauge */}
            <div className="gauge">
              <div className="gauge-fill" style={{transform: 'rotate(147deg)'}}></div>
              <div className="gauge-cover">
                <div className="gauge-text text-accent font-mono">82%</div>
                <div className="gauge-subtext text-muted font-mono">Acceptance Rate</div>
              </div>
            </div>
          </div>
          <div className="stat-breakdown font-mono mt-2">
            <span className="text-muted"><span style={{color: '#fff'}}>110</span> accepted / <span style={{color: '#fff'}}>134</span> attempts</span>
          </div>
        </div>

        <div className="stat-card" style={{borderLeftColor: 'var(--accent-primary)'}}>
          <div className="stat-header font-mono">STREAK <Flame size={16} color="var(--accent-primary)"/></div>
          <div className="stat-value font-mono">12</div>
          <div className="stat-subtext text-muted font-mono">day current streak</div>
          <div className="streak-stats-row mt-4">
            <div>
              <div className="font-mono font-bold">31</div>
              <div className="text-muted font-mono" style={{fontSize: '0.8rem'}}>Best streak</div>
            </div>
            <div>
              <div className="font-mono font-bold">214</div>
              <div className="text-muted font-mono" style={{fontSize: '0.8rem'}}>Total active days</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Activity & Submissions */}
      <section className="profile-bottom-section">
        <div className="activity-card">
          <div className="activity-header">
            <h3>Daily Submission Activity</h3>
            <span className="text-muted font-mono">134 submissions in the past year</span>
          </div>
          <div className="heatmap-container">
            <div className="heatmap-grid">
              {heatmapData.map((level, i) => (
                <div key={i} className={`heatmap-cell level-${level}`}></div>
              ))}
            </div>
            <div className="heatmap-months font-mono text-muted">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
          <div className="heatmap-legend font-mono text-muted">
            Less 
            <div className="heatmap-cell level-0"></div>
            <div className="heatmap-cell level-1"></div>
            <div className="heatmap-cell level-2"></div>
            <div className="heatmap-cell level-3"></div>
            <div className="heatmap-cell level-4"></div>
            More
          </div>
        </div>

        <div className="submissions-card">
          <div className="submissions-header flex justify-between">
            <h3>Recent Submissions</h3>
            <span className="text-muted font-mono" style={{fontSize: '0.85rem'}}>Last 10</span>
          </div>
          <table className="submissions-table w-full text-left">
            <thead>
              <tr className="font-mono text-muted border-b border-gray-800">
                <th className="py-3 px-4 font-normal">ID</th>
                <th className="py-3 px-4 font-normal">Problem</th>
                <th className="py-3 px-4 font-normal">Difficulty</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Language</th>
                <th className="py-3 px-4 font-normal">When</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((sub, i) => (
                <tr key={i} className="border-b border-gray-900 hover:bg-gray-900/30 transition-colors">
                  <td className="py-4 px-4 font-mono text-muted">{sub.id}</td>
                  <td className="py-4 px-4 font-semibold">{sub.problem}</td>
                  <td className="py-4 px-4">
                    <span className={`diff-tag ${sub.difficulty.toLowerCase()}`}>{sub.difficulty}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm flex items-center gap-2">
                    {sub.status === 'Accepted' && <CheckCircle size={14} color="var(--success)"/>}
                    {sub.status === 'Wrong Answer' && <XCircle size={14} color="var(--error)"/>}
                    {sub.status === 'Time Limit' && <Clock size={14} color="var(--warning)"/>}
                    <span style={{
                      color: sub.status === 'Accepted' ? 'var(--success)' : sub.status === 'Wrong Answer' ? 'var(--error)' : 'var(--warning)'
                    }}>{sub.status}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-muted text-sm">{sub.language}</td>
                  <td className="py-4 px-4 font-mono text-muted text-sm">{sub.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <EditProfile isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default Profile;

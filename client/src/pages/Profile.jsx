import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapPin, GitBranch, Link as LinkIcon, Edit2, CheckCircle, XCircle, Clock, Trophy, Flame } from 'lucide-react';
import EditProfile from '../components/EditProfile';
import './Profile.css';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, dailyRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/analytics/profile', { headers: { Authorization: `Bearer ${token}` } }),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/analytics/daily', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }
        if (dailyRes.ok) {
          const dailyData = await dailyRes.json();
          // Map daily submissions to heatmap array (365 days)
          // Simplified heatmap logic for demo
          const dummyHeatmap = Array.from({ length: 365 }).fill(0);
          dailyData.data.forEach(d => {
            // Randomly spread them or place at end
            dummyHeatmap[364 - Math.floor(Math.random() * 30)] = Math.min(4, d.count);
          });
          setHeatmapData(dummyHeatmap);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading || !stats) return <div style={{ color: 'white', padding: '40px' }}>Loading Profile...</div>;

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
          <div className="stat-value text-accent font-mono">{stats.totalSolved}</div>
          <div className="stat-breakdown font-mono">
            <span style={{color: 'var(--success)'}}>{stats.breakdown.easy} <span className="text-muted">Easy</span></span>
            <span style={{color: 'var(--warning)'}}>{stats.breakdown.medium} <span className="text-muted">Med</span></span>
            <span style={{color: 'var(--error)'}}>{stats.breakdown.hard} <span className="text-muted">Hard</span></span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar easy" style={{ width: `${stats.totalSolved > 0 ? (stats.breakdown.easy / stats.totalSolved) * 100 : 0}%` }}></div>
            <div className="progress-bar med" style={{ width: `${stats.totalSolved > 0 ? (stats.breakdown.medium / stats.totalSolved) * 100 : 0}%` }}></div>
            <div className="progress-bar hard" style={{ width: `${stats.totalSolved > 0 ? (stats.breakdown.hard / stats.totalSolved) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="stat-card center-align" style={{borderLeftColor: 'var(--info)'}}>
          <div className="stat-header font-mono">ACCURACY PROFILE</div>
          <div className="gauge-container">
            <div className="gauge">
              <div className="gauge-fill" style={{transform: `rotate(${(stats.acceptanceRate / 100) * 180}deg)`}}></div>
              <div className="gauge-cover">
                <div className="gauge-text text-accent font-mono">{stats.acceptanceRate}%</div>
                <div className="gauge-subtext text-muted font-mono">Acceptance Rate</div>
              </div>
            </div>
          </div>
          <div className="stat-breakdown font-mono mt-2">
            <span className="text-muted"><span style={{color: '#fff'}}>{stats.totalSolved}</span> accepted / <span style={{color: '#fff'}}>{stats.attempts}</span> attempts</span>
          </div>
        </div>

        <div className="stat-card" style={{borderLeftColor: 'var(--accent-primary)'}}>
          <div className="stat-header font-mono">STREAK <Flame size={16} color="var(--accent-primary)"/></div>
          <div className="stat-value font-mono">{stats.streak}</div>
          <div className="stat-subtext text-muted font-mono">day current streak</div>
          <div className="streak-stats-row mt-4">
            <div>
              <div className="font-mono font-bold">{stats.bestStreak}</div>
              <div className="text-muted font-mono" style={{fontSize: '0.8rem'}}>Best streak</div>
            </div>
            <div>
              <div className="font-mono font-bold">{stats.activeDays}</div>
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
            <span className="text-muted font-mono">{stats.totalSolved} submissions in the past year</span>
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
              {stats.recentSubmissions.map((sub, i) => (
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
              {stats.recentSubmissions.length === 0 && (
                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent submissions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <EditProfile isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default Profile;

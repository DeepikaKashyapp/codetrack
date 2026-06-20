import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import './Leaderboard.css';

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard');
        const data = await response.json();
        if (response.ok) {
          // Add some mock data for streak/country to match UI
          const enriched = data.data.map(u => ({
            ...u,
            streak: Math.floor(Math.random() * 200) + 10,
            country: ['IN', 'US', 'JP', 'DE', 'CN'][Math.floor(Math.random() * 5)],
            solved: Math.floor(u.score / 20) // mock solved count
          }));
          setLeaderboard(enriched);
        }
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading Leaderboard...</div>;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="leaderboard-wrapper">
      <div className="live-status font-mono">
        <span className="live-dot"></span> LIVE_RANKINGS
      </div>

      <div className="podium-grid">
        {top3.map((user) => (
          <div key={user.userId} className={`podium-card rank-${user.rank}`}>
            <div className="podium-header">
              <span className="rank-badge">★ {user.rank}</span>
              <span className="country-code font-mono">{user.country}</span>
            </div>
            <div className="podium-user">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{user.username}</h3>
              <span className="subtext font-mono">@{user.username.toLowerCase().replace(' ', '_')}</span>
            </div>
            <div className="podium-score text-gradient font-mono">
              {user.score.toLocaleString()}
            </div>
            <div className="podium-stats subtext">
              {user.solved} solved • {user.streak}d streak
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 0 }}>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>USER</th>
              <th>SCORE</th>
              <th>SOLVED</th>
              <th>STREAK</th>
              <th>COUNTRY</th>
            </tr>
          </thead>
          <tbody>
            {top3.map((user) => (
              <tr key={user.userId}>
                <td className="font-mono" style={{ color: user.rank === 1 ? '#fbbf24' : user.rank === 2 ? '#94a3b8' : '#b45309' }}>
                  ★ {user.rank}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar-circle">{user.username.substring(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user.username}</div>
                      <div className="subtext font-mono" style={{ fontSize: '0.8em' }}>@{user.username.toLowerCase().replace(' ', '_')}</div>
                    </div>
                  </div>
                </td>
                <td className="font-mono text-gradient" style={{ fontWeight: 700 }}>{user.score.toLocaleString()}</td>
                <td className="font-mono subtext">{user.solved}</td>
                <td className="font-mono subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={14} color="var(--accent-primary)"/> {user.streak}d
                </td>
                <td className="font-mono subtext">{user.country}</td>
              </tr>
            ))}
            {rest.map((user) => (
              <tr key={user.userId}>
                <td className="font-mono subtext">#{user.rank}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar-circle">{user.username.substring(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user.username}</div>
                      <div className="subtext font-mono" style={{ fontSize: '0.8em' }}>@{user.username.toLowerCase().replace(' ', '_')}</div>
                    </div>
                  </div>
                </td>
                <td className="font-mono" style={{ fontWeight: 700 }}>{user.score.toLocaleString()}</td>
                <td className="font-mono subtext">{user.solved}</td>
                <td className="font-mono subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={14} color="var(--accent-primary)"/> {user.streak}d
                </td>
                <td className="font-mono subtext">{user.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;

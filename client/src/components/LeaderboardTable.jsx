import React, { useState, useEffect } from 'react';

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard');
        const data = await response.json();
        if (response.ok) {
          setLeaderboard(data.data);
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

  return (
    <div className="glass-panel" style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>Global Leaderboard</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Rank</th>
            <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Username</th>
            <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user) => (
            <tr key={user.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '12px 8px' }}>
                {user.rank <= 3 ? (
                  <span style={{ color: user.rank === 1 ? '#fbbf24' : user.rank === 2 ? '#94a3b8' : '#b45309', fontWeight: 'bold' }}>
                    #{user.rank}
                  </span>
                ) : (
                  `#${user.rank}`
                )}
              </td>
              <td style={{ padding: '12px 8px', fontWeight: '500' }}>{user.username}</td>
              <td style={{ padding: '12px 8px', color: 'var(--accent-secondary)' }}>{user.score}</td>
            </tr>
          ))}
          {leaderboard.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No data yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;

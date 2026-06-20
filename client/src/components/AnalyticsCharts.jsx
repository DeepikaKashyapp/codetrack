import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AnalyticsCharts = () => {
  const { token } = useContext(AuthContext);
  const [dailyData, setDailyData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dailyRes, topicRes] = await Promise.all([
          fetch('http://localhost:5000/api/analytics/daily', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/analytics/topics', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (dailyRes.ok) setDailyData((await dailyRes.json()).data);
        if (topicRes.ok) setTopicData((await topicRes.json()).data);
      } catch (error) {
        console.error('Error fetching analytics', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchAnalytics();
  }, [token]);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <div className="glass-panel">
        <h3 style={{ marginBottom: '16px', color: 'var(--accent-secondary)' }}>Topic Breakdown</h3>
        {topicData.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {topicData.map(topic => (
              <li key={topic.topic} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ textTransform: 'capitalize' }}>{topic.topic}</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.9em' }}>{topic.count} solved</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No topics solved yet.</p>
        )}
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '16px', color: 'var(--success)' }}>Daily Activity</h3>
        {dailyData.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {dailyData.map(day => (
              <li key={day.date} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{new Date(day.date).toLocaleDateString()}</span>
                <span style={{ color: 'var(--success)' }}>+{day.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No activity yet.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;

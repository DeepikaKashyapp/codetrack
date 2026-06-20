import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, AlertCircle, Code2 } from 'lucide-react';
import './Analytics.css';

const AnalyticsCharts = () => {
  const { token } = useContext(AuthContext);
  const [dailyData, setDailyData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data to exactly match Figma
  const difficultyData = [
    { name: 'Easy', count: 120 },
    { name: 'Medium', count: 180 },
    { name: 'Hard', count: 80 }
  ];

  const weeklyData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 9 },
    { day: 'Fri', count: 5 },
    { day: 'Sat', count: 12 },
    { day: 'Sun', count: 4 }
  ];

  const COLORS = ['#FF5500', '#D97706', '#3B82F6', '#10B981', '#6B7280'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dailyRes, topicRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/analytics/daily', { headers: { Authorization: `Bearer ${token}` } }),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/analytics/topics', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        // Use real data where available, otherwise fallback
        if (topicRes.ok) {
          const tData = (await topicRes.json()).data;
          setTopicData(tData.length > 0 ? tData : [
            { topic: 'Arrays', count: 38 },
            { topic: 'DP', count: 22 },
            { topic: 'Graphs', count: 15 },
            { topic: 'Trees', count: 25 },
            { topic: 'Others', count: 10 }
          ]);
        }
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
    <div className="analytics-wrapper">
      {/* Top 4 Stat Cards */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="subtext">Avg. Time / Problem</div>
          <div className="stat-val font-mono">24.3m</div>
        </div>
        <div className="analytics-stat-card">
          <div className="subtext">Submission Rate</div>
          <div className="stat-val font-mono">82.4%</div>
        </div>
        <div className="analytics-stat-card">
          <div className="subtext">Best Streak</div>
          <div className="stat-val font-mono">31 days</div>
        </div>
        <div className="analytics-stat-card">
          <div className="subtext">Contest Rank</div>
          <div className="stat-val font-mono">Top 8%</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="glass-panel chart-card">
          <h3>Topic Breakdown</h3>
          <span className="subtext">Problems solved by category</span>
          <div className="chart-container" style={{ height: '250px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {topicData.map((t, i) => (
              <span key={t.topic}><span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }}></span> {t.topic}</span>
            ))}
          </div>
        </div>

        <div className="glass-panel chart-card">
          <h3>Difficulty Breakdown</h3>
          <span className="subtext">Solved vs total per difficulty level</span>
          <div className="chart-container" style={{ height: '250px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                <YAxis stroke="#888" tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }} />
                <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Cadence */}
      <div className="glass-panel chart-card">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3>Weekly Cadence</h3>
            <span className="subtext">Problems solved per day this week</span>
          </div>
          <div className="font-mono" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>↗ +34% vs last week</div>
        </div>
        <div className="chart-container" style={{ height: '200px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#888" tickLine={false} axisLine={false} />
              <YAxis stroke="#888" tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }} />
              <Bar dataKey="count" fill="#9c3f00" radius={[4, 4, 0, 0]} activeBar={<div style={{fill: 'var(--accent-primary)'}}/>} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Insights Row */}
      <div className="insights-grid">
        <div className="insight-card border-orange">
          <div className="insight-icon"><Cpu size={20} color="var(--accent-primary)" /></div>
          <div className="insight-info">
            <span className="subtext">Strongest Topic</span>
            <h4>Arrays</h4>
            <span className="subtext font-mono">38 problems solved</span>
          </div>
        </div>

        <div className="insight-card border-red">
          <div className="insight-icon bg-red"><AlertCircle size={20} color="var(--error)" /></div>
          <div className="insight-info">
            <span className="subtext">Weakest Topic</span>
            <h4>Dynamic Programming</h4>
            <span className="subtext font-mono">Only 22 solved</span>
          </div>
        </div>

        <div className="insight-card border-blue">
          <div className="insight-icon bg-blue"><Code2 size={20} color="#3b82f6" /></div>
          <div className="insight-info">
            <span className="subtext">Preferred Language</span>
            <h4>Python</h4>
            <span className="subtext font-mono">61% of submissions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;

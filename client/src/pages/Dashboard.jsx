import React, { useContext } from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's how you're stacking up.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <section>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-primary)' }}>|</span> Global Rankings
          </h2>
          <LeaderboardTable />
        </section>

        <section>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-secondary)' }}>|</span> Your Analytics
          </h2>
          <AnalyticsCharts />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

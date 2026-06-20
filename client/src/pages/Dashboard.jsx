import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Trophy, Target, ArrowUp } from 'lucide-react';
import './Dashboard.css';

const generateMockHeatmap = () => {
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      // Randomly assign a tier (0 to 4) where 0 is empty, 4 is darkest orange
      const hasActivity = Math.random() > 0.4;
      const tier = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
      days.push(tier);
    }
    weeks.push(days);
  }
  return weeks;
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Using mock data for the heatmap to match the dense Figma design
    setHeatmapData(generateMockHeatmap());
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card border-orange">
          <div className="stat-header">
            <span>TOTAL SOLVED</span>
            <CheckCircle2 size={16} color="var(--accent-primary)" />
          </div>
          <div className="stat-value text-gradient font-mono">134</div>
          <div className="stat-subtext">/ 1,247 problems</div>
          <div className="stat-trend trend-orange font-mono">+7 this week</div>
        </div>

        <div className="stat-card border-blue">
          <div className="stat-header">
            <span>GLOBAL RANK</span>
            <Trophy size={16} color="#3b82f6" />
          </div>
          <div className="stat-value font-mono">#347</div>
          <div className="stat-subtext">Top 0.74%</div>
          <div className="stat-trend trend-blue font-mono flex-center-start">
            <ArrowUp size={12} /> 12 spots
          </div>
        </div>

        <div className="stat-card border-green">
          <div className="stat-header">
            <span>ACCURACY</span>
            <Target size={16} color="var(--success)" />
          </div>
          <div className="stat-value font-mono">82.4%</div>
          <div className="stat-subtext">Submission rate</div>
          <div className="stat-trend trend-green font-mono">+2.1% this month</div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="glass-panel heatmap-section">
        <div className="section-header">
          <div>
            <h3>Daily Activity</h3>
            <span className="subtext">134 submissions in the last year</span>
          </div>
          <div className="heatmap-legend">
            <span className="subtext">Less</span>
            <div className="legend-blocks">
              <div className="heat-block tier-1"></div>
              <div className="heat-block tier-2"></div>
              <div className="heat-block tier-3"></div>
              <div className="heat-block tier-4"></div>
            </div>
            <span className="subtext">More</span>
          </div>
        </div>

        <div className="heatmap-grid">
          {heatmapData.map((week, wIndex) => (
            <div key={wIndex} className="heatmap-col">
              {week.map((tier, dIndex) => (
                <div key={`${wIndex}-${dIndex}`} className={`heat-block tier-${tier}`}></div>
              ))}
            </div>
          ))}
        </div>
        <div className="heatmap-months font-mono">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="glass-panel">
        <div className="section-header">
          <h3>Recent Submissions</h3>
          <a href="/problems" className="view-all text-gradient">View all &rarr;</a>
        </div>
        <table className="recent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Problem</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Lang</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-mono subtext">#2847</td>
              <td style={{ fontWeight: 500 }}>Merge K Sorted Lists</td>
              <td><span className="diff-badge hard">Hard</span></td>
              <td><span className="status-badge success"><CheckCircle2 size={12}/> Accepted</span></td>
              <td className="subtext">Python</td>
              <td className="subtext">2m ago</td>
            </tr>
            <tr>
              <td className="font-mono subtext">#124</td>
              <td style={{ fontWeight: 500 }}>Two Sum</td>
              <td><span className="diff-badge easy">Easy</span></td>
              <td><span className="status-badge success"><CheckCircle2 size={12}/> Accepted</span></td>
              <td className="subtext">JavaScript</td>
              <td className="subtext">4h ago</td>
            </tr>
            <tr>
              <td className="font-mono subtext">#983</td>
              <td style={{ fontWeight: 500 }}>Minimum Cost For Tickets</td>
              <td><span className="diff-badge medium">Medium</span></td>
              <td><span className="status-badge error">Wrong Answer</span></td>
              <td className="subtext">C++</td>
              <td className="subtext">1d ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

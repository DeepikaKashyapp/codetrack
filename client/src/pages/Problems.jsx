import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/problems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setProblems(data.data);
        }
      } catch (error) {
        console.error('Error fetching problems', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProblems();
  }, [token]);

  const handleSolve = async (problemId) => {
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ problemId, notes: 'Solved via frontend!' })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Problem solved! You earned ${data.data.pointsEarned} points.`);
        // In a real app we'd update UI state to show it's solved, but we just alert for now.
      } else {
        alert(data.error?.message || 'Failed to submit problem');
      }
    } catch (err) {
      alert('Error submitting problem');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading Problems...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>DSA Problems</h1>
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Difficulty</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Tags</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((prob) => (
              <tr key={prob.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px' }}>{prob.id}</td>
                <td style={{ padding: '12px 8px', fontWeight: '500' }}>{prob.title}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ 
                    color: prob.difficulty === 'Easy' ? 'var(--success)' : 
                           prob.difficulty === 'Medium' ? 'var(--warning)' : 'var(--error)' 
                  }}>
                    {prob.difficulty}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                  {prob.tags?.join(', ') || 'N/A'}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <button 
                    onClick={() => handleSolve(prob.id)} 
                    disabled={submitting}
                    style={{ padding: '6px 12px', fontSize: '0.9em' }}
                  >
                    Mark Solved
                  </button>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No problems available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;

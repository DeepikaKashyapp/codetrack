import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Search, ChevronDown } from 'lucide-react';
import './Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  // For demonstration, let's inject a mock 'acceptance rate' and 'status' since backend doesn't have it explicitly right now
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/problems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          const formatted = data.data.map(p => ({
            ...p,
            acceptance: (Math.random() * (70 - 20) + 20).toFixed(1) + '%', // Mock 20-70%
            isSolved: Math.random() > 0.6 // Mock solved status
          }));
          setProblems(formatted);
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
        setProblems(problems.map(p => p.id === problemId ? { ...p, isSolved: true } : p));
      } else {
        alert(data.error?.message || 'Failed to submit problem');
      }
    } catch (err) {
      alert('Error submitting problem');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading Problems Library...</div>;

  return (
    <div className="problems-wrapper">
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} color="var(--text-secondary)" />
          <input type="text" placeholder="Search problems..." className="search-input" />
        </div>
        <div className="dropdowns">
          <button className="dropdown-btn">Difficulty: All <ChevronDown size={14} /></button>
          <button className="dropdown-btn">Tags: All <ChevronDown size={14} /></button>
          <button className="dropdown-btn">Status: All <ChevronDown size={14} /></button>
          <span className="results-count font-mono">{problems.length} results</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 0 }}>
        <table className="problems-table">
          <thead>
            <tr>
              <th>#</th>
              <th>TITLE</th>
              <th>DIFFICULTY</th>
              <th>TAGS</th>
              <th>ACCEPTANCE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((prob, index) => (
              <tr key={prob.id}>
                <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>{index + 1}</td>
                <td style={{ fontWeight: '500' }}>{prob.title}</td>
                <td>
                  <span className={`diff-badge ${prob.difficulty.toLowerCase()}`}>
                    {prob.difficulty}
                  </span>
                </td>
                <td>
                  <div className="tags-container">
                    {prob.tags?.slice(0,2).map(tag => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="font-mono subtext">{prob.acceptance}</td>
                <td>
                  {prob.isSolved ? (
                    <span className="status-badge success"><CheckCircle size={14}/> Solved</span>
                  ) : (
                    <button 
                      className="mark-solved-btn"
                      onClick={() => handleSolve(prob.id)} 
                      disabled={submitting}
                    >
                      Mark Solved
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No problems available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Search, ChevronDown } from 'lucide-react';
import './Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { token } = useContext(AuthContext);

  // For demonstration, let's inject a mock 'acceptance rate' and 'status' since backend doesn't have it explicitly right now
  useEffect(() => {
    const fetchProblemsAndLists = async () => {
      try {
        const [probRes, listsRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/problems', { headers: { Authorization: `Bearer ${token}` } }),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/lists', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (probRes.ok) {
          const probData = await probRes.json();
          setProblems(probData.data);
        }
        if (listsRes.ok) {
          const listsData = await listsRes.json();
          setLists(listsData.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProblemsAndLists();
  }, [token]);

  const handleSolve = async (problemId) => {
    setSubmitting(true);
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/submissions', {
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

  const handleAddToList = async (problemId, listId) => {
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/lists/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ problemId, listId })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Added to list!');
        setOpenDropdownId(null);
      } else {
        alert(data.error || 'Failed to add to list');
      }
    } catch (err) {
      alert('Error adding to list');
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
                <td className="font-mono subtext">{prob.acceptance || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
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
                    
                    <button 
                      className="mark-solved-btn" 
                      style={{ padding: '4px 8px', background: 'var(--bg-card)' }}
                      onClick={() => setOpenDropdownId(openDropdownId === prob.id ? null : prob.id)}
                    >
                      <ChevronDown size={14} />
                    </button>
                    
                    {openDropdownId === prob.id && (
                      <div className="list-dropdown" style={{
                        position: 'absolute', top: '100%', right: '0', background: 'var(--bg-card)', 
                        border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 0', zIndex: 10,
                        minWidth: '120px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}>
                        {lists.map(list => (
                          <div 
                            key={list.id} 
                            onClick={() => handleAddToList(prob.id, list.id)}
                            style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            {list.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

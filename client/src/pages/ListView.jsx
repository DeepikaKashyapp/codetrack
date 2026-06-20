import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Search, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import './Problems.css'; // Reusing problem styles for the list

const ListView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + `/api/lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setList(data.data);
        } else {
          alert(data.error || 'List not found');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching list', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchListDetails();
  }, [id, token, navigate]);

  if (loading) return <div style={{ color: 'white', padding: '40px' }}><Loader2 className="spin" /> Loading List...</div>;
  if (!list) return null;

  return (
    <div className="problems-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-mono text-gradient" style={{ fontSize: '2rem', margin: 0 }}>{list.name}</h1>
        <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>
          {list.problems.length} problems
        </span>
      </div>

      <div className="glass-panel" style={{ padding: 0 }}>
        <table className="problems-table">
          <thead>
            <tr>
              <th>#</th>
              <th>TITLE</th>
              <th>DIFFICULTY</th>
              <th>TAGS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {list.problems.map((prob, index) => (
              <tr key={prob.id} className="problem-row">
                <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>{index + 1}</td>
                <td 
                  style={{ fontWeight: '500', cursor: 'pointer', color: 'var(--accent-primary)' }}
                  onClick={() => navigate(`/problems/${prob.id}`)}
                >
                  {prob.title}
                </td>
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
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                    {prob.isSolved ? (
                      <span className="status-badge success"><CheckCircle size={14}/> Solved</span>
                    ) : (
                      <button 
                        className="mark-solved-btn"
                        onClick={() => navigate(`/problems/${prob.id}`)} 
                      >
                        Solve Problem
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {list.problems.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  This list is empty. Go to the Explore page to add problems to this list!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;

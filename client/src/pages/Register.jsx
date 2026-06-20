import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.data.token, data.data.user);
        navigate('/dashboard');
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            className="input-field"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ width: '100%', marginTop: '12px' }}>Sign Up</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

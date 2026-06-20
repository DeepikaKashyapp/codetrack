import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.data.token, data.data.user);
        navigate('/dashboard');
      } else {
        setError(data.error?.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="font-mono" style={{ marginBottom: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <LogIn color="var(--accent-primary)" /> SYSTEM.LOGIN
        </h2>
        {error && <div className="font-mono" style={{ color: 'var(--error)', marginBottom: '16px', textAlign: 'center', fontSize: '0.9em' }}>[ERROR]: {error}</div>}
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="user@domain.com" 
            className="input-field font-mono"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="********" 
            className="input-field font-mono"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="font-mono" style={{ width: '100%', marginTop: '12px', textTransform: 'uppercase' }}>Authenticate</button>
        </form>
        <p className="font-mono" style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
          No access? <Link to="/register">Create token</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

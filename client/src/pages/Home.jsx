import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container flex-center" style={{ flexDirection: 'column', height: '80vh', textAlign: 'center' }}>
      <h1 className="font-mono" style={{ fontSize: '4rem', marginBottom: '20px' }}>
        MASTER <span className="text-gradient">ALGORITHMS</span>.<br/> RULE THE LEADERBOARD.
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px' }}>
        CodeTrack++ is the ultimate platform to track your DSA progress, analyze your performance, and compete with other developers globally.
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/register">
          <button className="font-mono" style={{ padding: '16px 32px', fontSize: '1.2rem', textTransform: 'uppercase' }}>Initialize</button>
        </Link>
        <Link to="/login">
          <button className="font-mono" style={{ padding: '16px 32px', fontSize: '1.2rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Authenticate
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

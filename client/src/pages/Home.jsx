import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container flex-center" style={{ flexDirection: 'column', height: '80vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>
        Master <span className="text-gradient">Algorithms</span>. <br/> Rule the Leaderboard.
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px' }}>
        CodeTrack++ is the ultimate platform to track your DSA progress, analyze your performance, and compete with other developers globally.
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/register">
          <button style={{ padding: '16px 32px', fontSize: '1.2rem' }}>Start Tracking Now</button>
        </Link>
        <Link to="/login">
          <button style={{ padding: '16px 32px', fontSize: '1.2rem', background: 'transparent', border: '1px solid var(--border-color)' }}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

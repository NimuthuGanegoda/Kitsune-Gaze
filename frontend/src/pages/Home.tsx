import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GlobalBreach {
  name: string;
  title: string;
  breach_date: string;
  pwn_count: number;
  description: string;
}

const Home = () => {
  const [breaches, setBreaches] = useState<GlobalBreach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/breaches')
      .then(res => res.json())
      .then(data => {
        setBreaches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>KITSUNE GAZE</h1>
        <p className="hero-subtitle">Comprehensive digital security for the public.</p>
        <div className="hero-description">
          <p>
            Kitsune-Gaze is a professional-grade security platform designed to identify data breaches 
            and reveal where your information has been compromised.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/scan" className="cta-button">Launch Security Scan</Link>
        </div>
      </section>

      <section className="live-breaches">
        <h2>Latest Global Breaches</h2>
        {loading ? (
          <p>Connecting to global threat intelligence...</p>
        ) : (
          <div className="breach-grid">
            {breaches.map((b, i) => (
              <div key={i} className="breach-card">
                <h3>{b.title}</h3>
                <p className="breach-meta">
                  <span>📅 {b.breach_date}</span>
                  <span>👥 {b.pwn_count.toLocaleString()} exposed</span>
                </p>
                <div 
                  className="breach-desc" 
                  dangerouslySetInnerHTML={{ __html: b.description }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

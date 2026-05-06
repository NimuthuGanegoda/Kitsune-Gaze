import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero-section">
      <h1>KITSUNE GAZE</h1>
      <p className="hero-subtitle">Comprehensive digital security for the public.</p>
      <div className="hero-description">
        <p>
          In an age where data is the new currency, your personal information is constantly at risk. 
          Kitsune-Gaze is a public service designed to identify data breaches and reveal where 
          your information has been compromised.
        </p>
        <p>
          Born from a commitment to privacy and ethical protection, we provide a free, stateless, 
          and secure way to scan for breaches without ever storing your information.
        </p>
      </div>
      <div className="hero-actions">
        <Link to="/scan" className="cta-button">Start Scanning</Link>
      </div>
    </div>
  );
};

export default Home;

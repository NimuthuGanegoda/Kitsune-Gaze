import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">KITSUNE GAZE</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/scan">Scanner</Link></li>
        <li><Link to="/ethics">Ethics</Link></li>
        <li><Link to="/privacy">Privacy</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

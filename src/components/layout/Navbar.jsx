import { Outlet, Link } from 'react-router-dom';
import { Home, Search, ShoppingBag, MessageSquare, LayoutDashboard, User } from 'lucide-react';
import './Navbar.css';

export function Navbar() {
  return (
    <nav className="navbar glass-panel">
      <div className="container flex-between nav-content">
        <Link to="/" className="logo">
          <span className="text-gradient">FixLink</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
          <Link to="/discovery" className="nav-link"><Search size={18} /> Services</Link>
          <Link to="/marketplace" className="nav-link"><ShoppingBag size={18} /> Marketplace</Link>
        </div>

        <div className="nav-actions flex-center">
          <Link to="/messages" className="icon-btn"><MessageSquare size={20} /></Link>
          <Link to="/dashboard" className="icon-btn"><LayoutDashboard size={20} /></Link>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <User size={18} /> Login
          </button>
        </div>
      </div>
    </nav>
  );
}

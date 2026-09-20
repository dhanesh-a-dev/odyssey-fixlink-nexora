import { Link } from 'react-router-dom';
import { Home, Search, ShoppingBag, MessageSquare, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

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
          <Link to="/messages" className="icon-btn" title="Messages"><MessageSquare size={20} /></Link>
          <Link to="/dashboard" className="icon-btn" title="Dashboard"><LayoutDashboard size={20} /></Link>

          {isAuthenticated ? (
            <div className="user-profile-menu flex-center" style={{ gap: '0.75rem' }}>
              <div
                className="user-badge flex-center"
                style={{
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--primary-color, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    background: user.role === 'PROVIDER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: user.role === 'PROVIDER' ? '#34d399' : '#60a5fa',
                  }}
                >
                  {user.role === 'PROVIDER' ? 'Pro' : 'User'}
                </span>
              </div>

              <button
                className="icon-btn"
                onClick={logout}
                title="Sign Out"
                style={{ padding: '0.4rem', color: '#f87171' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem' }}
              onClick={openAuthModal}
            >
              <User size={18} /> Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

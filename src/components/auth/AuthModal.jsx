import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import './AuthModal.css';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' or 'PROVIDER'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={closeAuthModal} aria-label="Close">
          <X size={20} />
        </button>

        <div className="auth-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Join FixLink'}</h2>
          <p>
            {mode === 'login'
              ? 'Enter your credentials to access your account.'
              : 'Connect with trusted local experts or grow your business.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <>
              {/* Role Selection */}
              <div className="role-selector">
                <label className="input-label">Account Type</label>
                <div className="role-options">
                  <button
                    type="button"
                    className={`role-btn ${role === 'CUSTOMER' ? 'active' : ''}`}
                    onClick={() => setRole('CUSTOMER')}
                  >
                    <User size={16} /> Customer
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === 'PROVIDER' ? 'active' : ''}`}
                    onClick={() => setRole('PROVIDER')}
                  >
                    <Briefcase size={16} /> Service Provider
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          {mode === 'login' && (
            <div className="demo-credentials">
              <span>💡 Quick Demo:</span>
              <button
                type="button"
                className="demo-btn"
                onClick={() => {
                  setFormData({ email: 'rajesh@example.com', password: 'Password123!' });
                }}
              >
                Fill Provider (Rajesh)
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => {
                  setFormData({ email: 'anjali@example.com', password: 'Password123!' });
                }}
              >
                Fill Customer (Anjali)
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

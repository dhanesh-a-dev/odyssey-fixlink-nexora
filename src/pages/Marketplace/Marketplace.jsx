import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Tag, Plus, X, RefreshCw } from 'lucide-react';
import { productApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Marketplace.css';

export function Marketplace() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // New item modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Furniture',
    price: '',
    location: '',
    description: '',
    image: '',
  });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    const data = await productApi.getAll({ search: searchTerm || undefined });
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostError(null);
    setPosting(true);

    try {
      await productApi.create({
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        location: formData.location,
        description: formData.description,
        images: formData.image
          ? [formData.image]
          : ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800'],
      });

      setIsModalOpen(false);
      setFormData({
        title: '',
        category: 'Furniture',
        price: '',
        location: '',
        description: '',
        image: '',
      });
      fetchItems();
    } catch (err) {
      setPostError(err.message || 'Failed to post item');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="marketplace-page animate-fade-in">
      <div className="page-header flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Local Marketplace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Buy and sell second-hand items in your neighborhood.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal();
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          <Plus size={18} /> Post an Ad
        </button>
      </div>

      <div className="search-bar glass-panel" style={{ margin: '0 0 2rem 0', maxWidth: '100%' }}>
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search for furniture, appliances, tools, electronics..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 1rem' }} />
          Loading marketplace items...
        </div>
      ) : (
        <div className="products-grid grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="product-card glass-panel">
              <div className="product-image-container">
                <img src={item.image} alt={item.title} className="product-image" />
                <div className="product-condition badge">{item.condition || 'Used - Good'}</div>
              </div>
              <div className="product-info">
                <div className="product-category">
                  <Tag size={12} /> {item.category}
                </div>
                <h3 className="product-title">{item.title}</h3>
                <h2 className="product-price">₹{Number(item.price).toLocaleString()}</h2>

                <div className="product-meta">
                  <span>
                    <MapPin size={14} /> {item.location}
                  </span>
                  <span>
                    <Clock size={14} /> {item.postedAt}
                  </span>
                </div>

                <div className="product-footer flex-between">
                  <span className="product-seller">By {item.seller}</span>
                  <Link to="/messages" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No items found matching your search.
        </div>
      )}

      {/* Post Product Modal */}
      {isModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="auth-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            <div className="auth-header">
              <h2>Post Marketplace Ad</h2>
              <p>Sell your pre-owned items locally on FixLink.</p>
            </div>

            {postError && (
              <div className="auth-alert error">
                <span>{postError}</span>
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="auth-form">
              <div className="input-group">
                <label className="input-label">Item Title</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Almost New Office Chair"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Category</label>
                  <select
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Furniture" style={{ background: '#1a2035' }}>Furniture</option>
                    <option value="Appliances" style={{ background: '#1a2035' }}>Appliances</option>
                    <option value="Tools" style={{ background: '#1a2035' }}>Tools</option>
                    <option value="Electronics" style={{ background: '#1a2035' }}>Electronics</option>
                    <option value="Vehicles" style={{ background: '#1a2035' }}>Vehicles</option>
                    <option value="Other" style={{ background: '#1a2035' }}>Other</option>
                  </select>
                </div>

                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Price (₹)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="1500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Location</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 21, Downtown"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Image URL (Optional)</label>
                <div className="input-wrapper">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe condition, usage duration, and pickup details..."
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontFamily: 'inherit',
                  }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={posting}>
                {posting ? 'Publishing...' : 'List Item Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

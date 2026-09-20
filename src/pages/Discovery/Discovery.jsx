import { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, MapPin, Star, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '../../data/mockData';
import { providerApi } from '../../services/api';

export function Discovery() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'All');
  const [professionalsList, setProfessionalsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPros = async () => {
      setLoading(true);
      const data = await providerApi.getAll({
        profession: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchTerm || undefined,
      });
      if (isMounted) {
        setProfessionalsList(data);
        setLoading(false);
      }
    };

    fetchPros();
    return () => {
      isMounted = false;
    };
  }, [activeCategory, searchTerm]);

  return (
    <div className="discovery-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Professionals</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover skilled and verified professionals in your area.</p>
      </div>

      <div className="discovery-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="search-bar glass-panel" style={{ margin: 0, flex: 1, maxWidth: 'none' }}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by name or skill (e.g., Wiring, Leak)"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="btn btn-outline glass-panel"
          onClick={() => {
            setSearchTerm('');
            setActiveCategory('All');
          }}
          title="Reset Filters"
        >
          <Filter size={18} /> Reset
        </button>
      </div>

      <div
        className="categories-filter"
        style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}
      >
        <button
          className={`badge ${activeCategory === 'All' ? 'active' : ''}`}
          style={{
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            background: activeCategory === 'All' ? 'var(--primary-color)' : 'var(--glass-bg)',
            color: activeCategory === 'All' ? 'white' : 'var(--text-primary)',
          }}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`badge ${activeCategory === cat.name ? 'active' : ''}`}
            style={{
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              background: activeCategory === cat.name ? 'var(--primary-color)' : 'var(--glass-bg)',
              color: activeCategory === cat.name ? 'white' : 'var(--text-primary)',
            }}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 1rem' }} />
          Loading verified professionals...
        </div>
      ) : (
        <div className="professionals-grid grid-cols-3">
          {professionalsList.map((pro) => (
            <div key={pro.id} className="pro-card glass-panel">
              <div className="pro-header">
                <img src={pro.avatar} alt={pro.name} className="pro-avatar" />
                <div>
                  <h3 className="pro-name">
                    {pro.name} {pro.verified && <ShieldCheck size={16} className="verified-icon" />}
                  </h3>
                  <p className="pro-category">{pro.category}</p>
                </div>
              </div>
              <div className="pro-stats">
                <div className="stat">
                  <Star size={14} className="star-icon" /> {pro.rating} ({pro.reviews})
                </div>
                <div className="stat">
                  <MapPin size={14} /> {pro.location}
                </div>
              </div>
              <div className="pro-skills">
                {pro.skills &&
                  pro.skills.map((skill, idx) => (
                    <span key={idx} className="badge">
                      {skill}
                    </span>
                  ))}
              </div>
              <div className="pro-footer">
                <div className="pro-price">
                  ₹{pro.hourlyRate}
                  <span>/hr</span>
                </div>
                <Link to={`/profile/${pro.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && professionalsList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No professionals found matching your search.
        </div>
      )}
    </div>
  );
}

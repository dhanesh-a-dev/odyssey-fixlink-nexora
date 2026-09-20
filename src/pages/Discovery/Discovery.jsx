import { useState } from 'react';
import { Search, Filter, ShieldCheck, MapPin, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { professionals, categories } from '../../data/mockData';

export function Discovery() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'All');

  const filteredPros = professionals.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pro.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || pro.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            placeholder="Search by name or skill (e.g., Wiring)"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline glass-panel"><Filter size={18} /> Filters</button>
      </div>

      <div className="categories-filter" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <button 
          className={`badge ${activeCategory === 'All' ? 'active' : ''}`}
          style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1rem', background: activeCategory === 'All' ? 'var(--primary-color)' : 'var(--glass-bg)', color: activeCategory === 'All' ? 'white' : 'var(--text-primary)' }}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`badge ${activeCategory === cat.name ? 'active' : ''}`}
            style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1rem', background: activeCategory === cat.name ? 'var(--primary-color)' : 'var(--glass-bg)', color: activeCategory === cat.name ? 'white' : 'var(--text-primary)' }}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="professionals-grid grid-cols-3">
        {filteredPros.map(pro => (
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
              <div className="stat"><Star size={14} className="star-icon" /> {pro.rating} ({pro.reviews})</div>
              <div className="stat"><MapPin size={14} /> {pro.location}</div>
            </div>
            <div className="pro-skills">
              {pro.skills.map((skill, idx) => (
                <span key={idx} className="badge">{skill}</span>
              ))}
            </div>
            <div className="pro-footer">
              <div className="pro-price">₹{pro.hourlyRate}<span>/hr</span></div>
              <Link to={`/profile/${pro.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Book Now</Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPros.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No professionals found matching your search.
        </div>
      )}
    </div>
  );
}

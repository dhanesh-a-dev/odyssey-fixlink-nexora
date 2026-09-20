import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Tag } from 'lucide-react';
import { marketplaceItems } from '../../data/mockData';
import './Marketplace.css';

export function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = marketplaceItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="marketplace-page animate-fade-in">
      <div className="page-header flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Local Marketplace</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Buy and sell second-hand items in your neighborhood.</p>
        </div>
        <button className="btn btn-primary">+ Post an Ad</button>
      </div>

      <div className="search-bar glass-panel" style={{ margin: '0 0 2rem 0', maxWidth: '100%' }}>
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search for furniture, appliances, hobbies..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-grid grid-cols-3">
        {filteredItems.map(item => (
          <div key={item.id} className="product-card glass-panel">
            <div className="product-image-container">
              <img src={item.image} alt={item.title} className="product-image" />
              <div className="product-condition badge">{item.condition}</div>
            </div>
            <div className="product-info">
              <div className="product-category"><Tag size={12} /> {item.category}</div>
              <h3 className="product-title">{item.title}</h3>
              <h2 className="product-price">₹{item.price.toLocaleString()}</h2>
              
              <div className="product-meta">
                <span><MapPin size={14} /> {item.location}</span>
                <span><Clock size={14} /> {item.postedAt}</span>
              </div>
              
              <div className="product-footer flex-between">
                <span className="product-seller">By {item.seller}</span>
                <Link to="/messages" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Contact</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          No items found matching your search.
        </div>
      )}
    </div>
  );
}

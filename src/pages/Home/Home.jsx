import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, MapPin, Star } from 'lucide-react';
import { categories, professionals } from '../../data/mockData';
import './Home.css';

export function Home() {
  const featuredPros = professionals.slice(0, 3);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Local Services,<br />
            <span className="text-gradient">Fixed & Linked.</span>
          </h1>
          <p className="hero-subtitle">
            Find trusted professionals in your neighborhood instantly. From plumbers to painters, we've got you covered.
          </p>
          
          <div className="search-bar glass-panel">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="What do you need help with? e.g. AC Repair"
              className="search-input"
            />
            <button className="btn btn-primary">Find Pro</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header flex-between">
          <h2>Top Services</h2>
          <Link to="/discovery" className="view-all">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="categories-grid grid-cols-4">
          {categories.map(cat => (
            <Link to={`/discovery?category=${cat.name}`} key={cat.id} className="category-card glass-panel">
              <div className="category-icon-wrapper">
                <span className="material-icon">{cat.name.charAt(0)}</span>
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="featured-section">
        <div className="section-header flex-between">
          <h2>Featured Locals</h2>
          <Link to="/discovery" className="view-all">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="professionals-grid grid-cols-3">
          {featuredPros.map(pro => (
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
      </section>
    </div>
  );
}

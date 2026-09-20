import { useParams, Link } from 'react-router-dom';
import { professionals } from '../../data/mockData';
import { ShieldCheck, Star, MapPin, Clock, Briefcase, Calendar, ChevronLeft, MessageSquare } from 'lucide-react';
import './Profile.css';

export function Profile() {
  const { id } = useParams();
  const pro = professionals.find(p => p.id === id);

  if (!pro) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Professional not found.</div>;
  }

  return (
    <div className="profile-page animate-fade-in">
      <Link to="/discovery" className="back-link"><ChevronLeft size={20} /> Back to Search</Link>

      <div className="profile-grid">
        {/* Left Column: Info & Booking */}
        <div className="profile-sidebar">
          <div className="glass-panel profile-card">
            <img src={pro.avatar} alt={pro.name} className="profile-avatar-large" />
            <h1 className="profile-name">
              {pro.name} {pro.verified && <ShieldCheck size={24} className="verified-icon" />}
            </h1>
            <p className="profile-category">{pro.category}</p>
            
            <div className="profile-stats flex-center">
              <div className="stat-box">
                <Star size={18} className="star-icon" />
                <span className="stat-value">{pro.rating}</span>
                <span className="stat-label">{pro.reviews} reviews</span>
              </div>
              <div className="stat-box">
                <Briefcase size={18} style={{ color: 'var(--primary-color)' }} />
                <span className="stat-value">{pro.jobsCompleted}</span>
                <span className="stat-label">Jobs Done</span>
              </div>
              <div className="stat-box">
                <Calendar size={18} style={{ color: 'var(--secondary-color)' }} />
                <span className="stat-value">{pro.yearsOfExperience}</span>
                <span className="stat-label">Years Exp.</span>
              </div>
            </div>

            <div className="profile-price">
              <h2>₹{pro.hourlyRate}<span>/hr</span></h2>
            </div>

            <div className="profile-actions">
              <Link to={`/booking/${pro.id}`} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Book Now</Link>
              <Link to="/messages" className="btn btn-outline" style={{ width: '100%' }}><MessageSquare size={18} /> Message</Link>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="profile-content">
          <div className="glass-panel content-section">
            <h2>About {pro.name.split(' ')[0]}</h2>
            <p className="about-text">{pro.about}</p>
            
            <div className="details-grid grid-cols-2" style={{ marginTop: '2rem' }}>
              <div className="detail-item">
                <MapPin size={20} />
                <div>
                  <strong>Service Area</strong>
                  <p>{pro.serviceArea}</p>
                </div>
              </div>
              <div className="detail-item">
                <Clock size={20} />
                <div>
                  <strong>Availability</strong>
                  <p>{pro.availability}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel content-section">
            <h2>Skills & Expertise</h2>
            <div className="skills-wrap">
              {pro.skills.map((skill, idx) => (
                <span key={idx} className="badge profile-badge">{skill}</span>
              ))}
            </div>
          </div>

          <div className="glass-panel content-section">
            <h2>Client Reviews ({pro.reviews})</h2>
            {pro.recentReviews.length > 0 ? (
              <div className="reviews-list">
                {pro.recentReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header flex-between">
                      <strong>{review.user}</strong>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "star-icon" : "star-empty"} />
                      ))}
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

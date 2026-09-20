import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Clock, Briefcase, Calendar, ChevronLeft, MessageSquare, Send, RefreshCw } from 'lucide-react';
import { providerApi, reviewApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export function Profile() {
  const { id } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  const fetchProvider = async () => {
    setLoading(true);
    const data = await providerApi.getById(id);
    setPro(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    setReviewMessage(null);

    try {
      await reviewApi.create({
        providerId: pro.id,
        rating,
        comment: comment.trim(),
      });

      setComment('');
      setReviewMessage({ type: 'success', text: 'Review submitted successfully!' });
      fetchProvider();
    } catch (err) {
      setReviewMessage({ type: 'error', text: err.message || 'Failed to submit review' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 1rem' }} />
        Loading professional profile...
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        Professional not found.
      </div>
    );
  }

  return (
    <div className="profile-page animate-fade-in">
      <Link to="/discovery" className="back-link">
        <ChevronLeft size={20} /> Back to Search
      </Link>

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
              <h2>
                ₹{pro.hourlyRate}
                <span>/hr</span>
              </h2>
            </div>

            <div className="profile-actions">
              <Link to={`/booking/${pro.id}`} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                Book Now
              </Link>
              <Link to="/messages" className="btn btn-outline" style={{ width: '100%' }}>
                <MessageSquare size={18} /> Message
              </Link>
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
                  <p>{pro.location || 'Within city limits'}</p>
                </div>
              </div>
              <div className="detail-item">
                <Clock size={20} />
                <div>
                  <strong>Availability</strong>
                  <p>{pro.availability || 'Mon - Sat, 9 AM - 6 PM'}</p>
                </div>
              </div>
            </div>
          </div>

          {pro.portfolioImages && pro.portfolioImages.length > 0 && (
            <div className="glass-panel content-section">
              <h2>Completed Work & Portfolio</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {pro.portfolioImages.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Portfolio ${i + 1}`}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel content-section">
            <h2>Skills & Expertise</h2>
            <div className="skills-wrap">
              {pro.skills &&
                pro.skills.map((skill, idx) => (
                  <span key={idx} className="badge profile-badge">
                    {skill}
                  </span>
                ))}
            </div>
          </div>

          <div className="glass-panel content-section">
            <h2>Client Reviews ({pro.reviews})</h2>

            {/* Leave a review form */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Write a Review</h3>

              {reviewMessage && (
                <div
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    fontSize: '0.85rem',
                    background: reviewMessage.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: reviewMessage.type === 'success' ? '#86efac' : '#fca5a5',
                  }}
                >
                  {reviewMessage.text}
                </div>
              )}

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.1rem',
                        }}
                      >
                        <Star
                          size={20}
                          fill={star <= rating ? '#eab308' : 'none'}
                          color={star <= rating ? '#eab308' : '#64748b'}
                        />
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      required
                      placeholder={`Share your experience with ${pro.name.split(' ')[0]}...`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submittingReview}
                      style={{ padding: '0.7rem 1.2rem' }}
                    >
                      <Send size={16} /> {submittingReview ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Please{' '}
                  <button
                    onClick={openAuthModal}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-color)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    log in
                  </button>{' '}
                  to leave a rating and review for this provider.
                </div>
              )}
            </div>

            {pro.recentReviews && pro.recentReviews.length > 0 ? (
              <div className="reviews-list">
                {pro.recentReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header flex-between">
                      <strong>{review.user}</strong>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars" style={{ display: 'flex', gap: '2px', margin: '0.4rem 0' }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

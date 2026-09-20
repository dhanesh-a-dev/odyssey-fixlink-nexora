import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { professionals } from '../../data/mockData';
import { Calendar, Clock, PenTool, ChevronLeft, CheckCircle } from 'lucide-react';
import './Booking.css';

export function Booking() {
  const { id } = useParams();
  const pro = professionals.find(p => p.id === id);
  
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    description: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!pro) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Professional not found.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="booking-page animate-fade-in flex-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel success-card">
          <CheckCircle size={64} className="success-icon animate-pulse-glow" />
          <h1>Booking Confirmed!</h1>
          <p>Your request has been sent to <strong>{pro.name}</strong>.</p>
          <p className="success-details">
            Service: {formData.service} <br />
            Date: {formData.date} at {formData.time}
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn btn-primary">View Dashboard</Link>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page animate-fade-in">
      <Link to={`/profile/${pro.id}`} className="back-link"><ChevronLeft size={20} /> Back to Profile</Link>
      
      <div className="booking-layout">
        <div className="booking-form-section glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>Book {pro.category}</h2>
          
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>Service Required</label>
              <select name="service" required onChange={handleChange} value={formData.service} className="form-input">
                <option value="">Select a service...</option>
                {pro.skills.map((skill, idx) => (
                  <option key={idx} value={skill}>{skill}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label><Calendar size={16} /> Date</label>
                <input type="date" name="date" required onChange={handleChange} value={formData.date} className="form-input" />
              </div>
              <div className="form-group">
                <label><Clock size={16} /> Time</label>
                <input type="time" name="time" required onChange={handleChange} value={formData.time} className="form-input" />
              </div>
            </div>
            
            <div className="form-group">
              <label><PenTool size={16} /> Description of Work</label>
              <textarea 
                name="description" 
                rows="4" 
                placeholder="Describe the issue or what needs to be done..." 
                required 
                onChange={handleChange} 
                value={formData.description}
                className="form-input"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem', padding: '1rem' }}>
              Confirm Booking
            </button>
          </form>
        </div>
        
        <div className="booking-summary-section">
          <div className="glass-panel summary-card">
            <h3>Booking Summary</h3>
            
            <div className="summary-pro">
              <img src={pro.avatar} alt={pro.name} />
              <div>
                <strong>{pro.name}</strong>
                <span>{pro.category}</span>
              </div>
            </div>
            
            <div className="summary-details">
              <div className="summary-row flex-between">
                <span>Estimated Rate</span>
                <strong>₹{pro.hourlyRate}/hr</strong>
              </div>
              <div className="summary-row flex-between">
                <span>Platform Fee</span>
                <strong>₹50</strong>
              </div>
              <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
              <div className="summary-row flex-between" style={{ fontSize: '1.25rem' }}>
                <strong>Total Estimate</strong>
                <strong className="text-gradient">₹{pro.hourlyRate + 50}/hr</strong>
              </div>
            </div>
            
            <p className="summary-note">
              * Final price may vary based on actual work required. You will pay the professional directly after the job is completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

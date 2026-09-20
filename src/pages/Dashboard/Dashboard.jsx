import { useState } from 'react';
import { dashboardJobs, professionals } from '../../data/mockData';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  // Simulating the logged-in professional (Rajesh Kumar for demo)
  const myProfile = professionals[0]; 
  const [jobs, setJobs] = useState(dashboardJobs);

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const activeJobs = jobs.filter(j => j.status === 'active');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const handleAction = (id, newStatus) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {myProfile.name.split(' ')[0]}</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Summary Sidebar */}
        <div className="dashboard-sidebar">
          <div className="glass-panel profile-summary">
            <img src={myProfile.avatar} alt={myProfile.name} className="summary-avatar" />
            <h3>{myProfile.name}</h3>
            <p className="summary-category">{myProfile.category}</p>
            <div className="summary-stats">
              <div className="flex-between"><span>Rating:</span> <strong>{myProfile.rating}</strong></div>
              <div className="flex-between"><span>Jobs Done:</span> <strong>{myProfile.jobsCompleted}</strong></div>
              <div className="flex-between"><span>Earnings (Mtd):</span> <strong>₹12,400</strong></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main">
          
          {/* Pending Requests */}
          <section className="dashboard-section">
            <h2>Incoming Requests ({pendingJobs.length})</h2>
            <div className="jobs-list">
              {pendingJobs.length === 0 ? <p className="empty-state">No new requests.</p> : 
                pendingJobs.map(job => (
                  <div key={job.id} className="job-card glass-panel pending-border">
                    <div className="job-info">
                      <h4>{job.service} for {job.client}</h4>
                      <div className="job-meta">
                        <span><Clock size={14} /> {job.date} at {job.time}</span>
                        <span className="job-amount">Est: ₹{job.amount}</span>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button className="btn btn-outline" style={{ color: 'var(--secondary-color)', borderColor: 'var(--secondary-color)' }} onClick={() => handleAction(job.id, 'active')}>
                        <CheckCircle size={16} /> Accept
                      </button>
                      <button className="btn btn-outline" style={{ color: '#EF4444', borderColor: '#EF4444' }} onClick={() => handleAction(job.id, 'rejected')}>
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </section>

          {/* Active Jobs */}
          <section className="dashboard-section">
            <h2>Active Jobs ({activeJobs.length})</h2>
            <div className="jobs-list">
              {activeJobs.length === 0 ? <p className="empty-state">No active jobs.</p> : 
                activeJobs.map(job => (
                  <div key={job.id} className="job-card glass-panel active-border">
                    <div className="job-info">
                      <h4>{job.service} for {job.client}</h4>
                      <div className="job-meta">
                        <span><Clock size={14} /> {job.date} at {job.time}</span>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button className="btn btn-primary" onClick={() => handleAction(job.id, 'completed')}>
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </section>

          {/* Completed Jobs */}
          <section className="dashboard-section">
            <h2>Job History</h2>
            <div className="jobs-list">
              {completedJobs.map(job => (
                <div key={job.id} className="job-card glass-panel completed-border" style={{ opacity: 0.8 }}>
                  <div className="job-info">
                    <h4>{job.service} for {job.client}</h4>
                    <div className="job-meta">
                      <span><CheckCircle size={14} /> Completed on {job.date}</span>
                      <span className="job-amount">Earned: ₹{job.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

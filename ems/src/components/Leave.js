import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leave.css';

// Simple thumbs up SVG icon component
const ThumbsUpIcon = () => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

function Leave() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalLeavesTaken: 0,
    remainingLeaves: 36
  });
  const [employeeInfo, setEmployeeInfo] = useState({
    name: '',
    position: '',
    avatar: 'https://ui-avatars.com/api/?name=User&background=random'
  });
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    duration: '',
    resumptionDate: '',
    reason: '',
    document: null
  });

  useEffect(() => {
    fetchLeaveData();
    fetchEmployeeInfo();
  }, []);

  const fetchLeaveData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/leaves/my-leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLeaveHistory(response.data.leaves);
      setStatistics(response.data.statistics);
      setError(null);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      setError('Failed to fetch leave history. Please try again later.');
    }
  };

  const fetchEmployeeInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/employees/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEmployeeInfo({
        name: response.data.name,
        position: response.data.position,
        avatar: response.data.avatar || 'https://ui-avatars.com/api/?name=User&background=random'
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching employee info:', error);
      setError('Failed to fetch employee information. Please try again later.');
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate dates
      const startDate = new Date(leaveForm.startDate);
      const endDate = new Date(leaveForm.endDate);
      const resumptionDate = new Date(leaveForm.resumptionDate);

      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      if (resumptionDate <= endDate) {
        throw new Error('Resumption date must be after end date');
      }

      const formData = new FormData();
      Object.keys(leaveForm).forEach(key => {
        if (key === 'document' && leaveForm[key]) {
          formData.append('document', leaveForm[key]);
        } else {
          formData.append(key, leaveForm[key]);
        }
      });

      await axios.post('http://localhost:5000/api/leaves/apply', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowForm(false);
      setShowSuccess(true);
      fetchLeaveData(); // Refresh leave history
      
      // Reset form
      setLeaveForm({
        leaveType: '',
        startDate: '',
        endDate: '',
        duration: '',
        resumptionDate: '',
        reason: '',
        document: null
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting leave application:', error);
      setError(error.message || 'Failed to submit leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm(prev => {
      const updatedForm = {
        ...prev,
        [name]: value
      };

      // Automatically calculate duration when dates change
      if (name === 'startDate' || name === 'endDate') {
        if (updatedForm.startDate && updatedForm.endDate) {
          updatedForm.duration = calculateDuration(updatedForm.startDate, updatedForm.endDate);
          
          // Set resumption date to day after end date if not already set
          if (!updatedForm.resumptionDate && name === 'endDate') {
            const nextDay = new Date(updatedForm.endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            updatedForm.resumptionDate = nextDay.toISOString().split('T')[0];
          }
        }
      }

      return updatedForm;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }
      setLeaveForm(prev => ({
        ...prev,
        document: file
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (error) {
    return (
      <div className="leave-container">
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leave-container">
      <div className="header-card">
        <div className="profile-info">
          <img 
            src={employeeInfo.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
            alt={`${employeeInfo.name || 'User'}'s profile`}
            className="profile-pic"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name=User&background=random';
            }}
          />
          <div>
            <h2>{employeeInfo.name || 'Loading...'}</h2>
            <p>{employeeInfo.position || 'Loading...'}</p>
          </div>
        </div>
      </div>

      <div className="leave-stats">
        <div className="stat-card">
          <span className="number">{statistics.totalLeavesTaken}</span>
          <span className="label">Days Taken</span>
        </div>
        <div className="stat-card">
          <span className="number">{statistics.remainingLeaves}</span>
          <span className="label">Days Remaining</span>
        </div>
      </div>

      <div className="leave-section">
        <h3>Leave History</h3>
        <div className="table-container">
          {leaveHistory.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Days</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map(leave => (
                  <tr key={leave._id}>
                    <td>{leave.duration}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-leaves">No leave history found</div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Leave Application</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Leave Type *</label>
                <select 
                  name="leaveType" 
                  value={leaveForm.leaveType} 
                  onChange={handleInputChange} 
                  required
                  disabled={loading}
                >
                  <option value="">Select leave type</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="casual">Casual Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={leaveForm.startDate}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={leaveForm.endDate}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    name="duration"
                    value={leaveForm.duration}
                    readOnly
                    disabled
                    className="readonly-input"
                  />
                </div>
                <div className="form-group">
                  <label>Resumption Date *</label>
                  <input
                    type="date"
                    name="resumptionDate"
                    value={leaveForm.resumptionDate}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    min={leaveForm.endDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Leave *</label>
                <textarea
                  name="reason"
                  value={leaveForm.reason}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="Please provide a detailed reason for your leave request"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Supporting Document (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  disabled={loading}
                />
                <small className="file-hint">Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX</small>
              </div>

              <div className="button-group">
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-modal">
          <div className="success-content">
            <ThumbsUpIcon />
            <h2>Thank you!</h2>
            <p>Your leave application has been submitted successfully.</p>
          </div>
        </div>
      )}

      <button 
        className="apply-leave-btn" 
        onClick={() => setShowForm(true)}
        disabled={loading}
      >
        Apply for Leave
      </button>
    </div>
  );
}

export default Leave;

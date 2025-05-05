import React, { useState, useEffect } from 'react';
import './FamilyDetails.css'; // Import the new CSS file

const FamilyDetails = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: '',
    phoneNo: '',
    address: '',
    occupation: '',
  });

  const [familyDetails, setFamilyDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit this form.');
      return;
    }

    try {
      const response = await fetch('/api/employees/me/family-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update family details');
        } else {
          throw new Error(`Unexpected response: ${response.statusText}`);
        }
      }

      alert('Family details updated successfully!');
      setIsEditing(false);
      fetchFamilyDetails();
    } catch (error) {
      console.error('Error updating family details:', error.message);
      alert('Failed to update family details. Please try again.');
    }
  };

  const fetchFamilyDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view family details.');
      return;
    }

    try {
      const response = await fetch('/api/employees/me/family-details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setFamilyDetails(data.familyDetails || []);
    } catch (error) {
      console.error('Error fetching family details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  if (loading) return <div className="loading-message">Loading family details...</div>;

  return (
    <div className="family-details-container">
      <h2 className="title">Family Details</h2>

      {!isEditing && familyDetails.length > 0 ? (
        <div className="details-card">
          <p><strong>Name:</strong> {familyDetails[0].fullName || 'N/A'}</p>
          <p><strong>Occupation:</strong> {familyDetails[0].occupation || 'N/A'}</p>
          <p><strong>Phone:</strong> {familyDetails[0].phoneNo || 'N/A'}</p>
          <p><strong>Relationship:</strong> {familyDetails[0].relationship || 'N/A'}</p>
          <p><strong>Address:</strong> {familyDetails[0].address || 'N/A'}</p>
          <button
            className="btn btn-edit"
            onClick={() => {
              setIsEditing(true);
              setFormData({
                fullName: familyDetails[0].fullName || '',
                relationship: familyDetails[0].relationship || '',
                phoneNo: familyDetails[0].phoneNo || '',
                address: familyDetails[0].address || '',
                occupation: familyDetails[0].occupation || '',
              });
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Relationship</label>
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-save">Save Family Details</button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default FamilyDetails;

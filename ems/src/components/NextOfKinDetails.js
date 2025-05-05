import React, { useEffect, useState } from 'react';
import './NextOfKinDetails.css';

function NextOfKinDetails() {
    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        phone: '',
        relationship: 'Relative',
        address: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch existing data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/employees/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data?.nextOfKin) {
                    setFormData(data.nextOfKin);
                }
            } catch (error) {
                console.error('Failed to fetch next of kin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/employees/me/next-of-kin-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save next of kin details');
            }

            alert('Next of kin details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving next of kin details:', error);
            alert('Error saving next of kin details');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="next-of-kin-container">
            <div className="next-of-kin-content">
                <h2>Next of Kin Details</h2>

                {!isEditing ? (
                    <div className="view-mode">
                        <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
                        <p><strong>Occupation:</strong> {formData.occupation || 'N/A'}</p>
                        <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                        <p><strong>Relationship:</strong> {formData.relationship || 'N/A'}</p>
                        <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
                        <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
                    </div>
                ) : (
                    <form className="next-of-kin-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Occupation</label>
                            <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Relationship</label>
                            <select name="relationship" value={formData.relationship} onChange={handleChange}>
                                <option value="Relative">Relative</option>
                                <option value="Friend">Friend</option>
                                <option value="Colleague">Colleague</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="update-button">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default NextOfKinDetails;

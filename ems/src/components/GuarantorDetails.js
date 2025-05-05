import React, { useState, useEffect, useCallback } from 'react';
import './GuarantorDetails.css';

const GuarantorDetails = () => {
    const [guarantor, setGuarantor] = useState({
        name: '',
        occupation: '',
        phone: ''
    });

    const [editMode, setEditMode] = useState(false); // 🔁 Toggle view/edit

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuarantor({ ...guarantor, [name]: value });
    };

    const fetchGuarantorDetails = useCallback(async () => {
        try {
            const response = await fetch('/api/employees/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log("Fetched:", data); // 🔍 Debugging

            const guar = data.guarantorDetails || data.guarantor; // ✅ Use correct key
            if (guar) {
                setGuarantor(guar);
            }
        } catch (error) {
            console.error('Failed to load guarantor details:', error);
        }
    }, [token]);

    const handleUpdate = async () => {
        try {
            const response = await fetch('/api/employees/me/guarantor-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(guarantor)
            });

            if (!response.ok) {
                throw new Error('Failed to save guarantor details');
            }

            await response.json();
            alert('Guarantor details updated successfully!');
            setEditMode(false); // ✅ Exit edit mode after saving
        } catch (error) {
            console.error('Error saving guarantor details:', error);
            alert('Error saving guarantor details');
        }
    };
    

    useEffect(() => {
        fetchGuarantorDetails();
    }, [fetchGuarantorDetails]);

    return (
        <div className="container">
            <h2>Guarantor Details</h2>

            {!editMode ? (
                <div>
                    <p><strong>Name:</strong> {guarantor.name || '-'}</p>
                    <p><strong>Occupation:</strong> {guarantor.occupation || '-'}</p>
                    <p><strong>Phone:</strong> {guarantor.phone || '-'}</p>
                    <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
                </div>
            ) : (
                <>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={guarantor.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label>Occupation</label>
                        <input
                            type="text"
                            name="occupation"
                            value={guarantor.occupation}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={guarantor.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="update-button" onClick={handleUpdate}>Save</button>
                    <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
                </>
            )}
        </div>
    );
};

export default GuarantorDetails;

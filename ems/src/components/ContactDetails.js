import React, { useState, useEffect } from 'react';
import './ContactDetails.css';

const ContactDetails = () => {
    const [formData, setFormData] = useState({
        phone1: '',
        phone2: '',
        personalEmail: '',
        city: '',
        address: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch existing contact details when component mounts
    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const response = await fetch('/api/employees/me/contact-details', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch contact details');
                }

                const data = await response.json();
                setFormData({
                    phone1: data.phone1 || '',
                    phone2: data.phone2 || '',
                    personalEmail: data.personalEmail || '',
                    city: data.city || '',
                    address: data.address || '',
                });
            } catch (error) {
                console.error(error.message);
                alert('Could not load contact details');
            } finally {
                setLoading(false);
            }
        };

        fetchContactDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { phone1, personalEmail, city, address } = formData;
        if (!phone1 || !personalEmail || !city || !address) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/employees/me/contact-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save contact details');
            }

            alert('Contact details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error:', error.message);
            alert(error.message);
        }
    };

    if (loading) return <div>Loading contact details...</div>;

    return (
        <div className="contact-details">
            <h2>Contact Details</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Phone Number 1</label>
                        <input
                            type="text"
                            name="phone1"
                            value={formData.phone1}
                            onChange={handleChange}
                            placeholder="Phone Number 1"
                        />
                    </div>
                    <div>
                        <label>Phone Number 2</label>
                        <input
                            type="text"
                            name="phone2"
                            value={formData.phone2}
                            onChange={handleChange}
                            placeholder="Phone Number 2"
                        />
                    </div>
                    <div>
                        <label>Personal E-mail Address</label>
                        <input
                            type="email"
                            name="personalEmail"
                            value={formData.personalEmail}
                            onChange={handleChange}
                            placeholder="Personal Email Address"
                        />
                    </div>
                    <div>
                        <label>City of Residence</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City of Residence"
                        />
                    </div>
                    <div>
                        <label>Residential Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Residential Address"
                        ></textarea>
                    </div>
                    <button type="submit">Save</button>
                </form>
            ) : (
                <>
                    <div className="saved-data">
                        <p><strong>Phone Number 1:</strong> {formData.phone1}</p>
                        <p><strong>Phone Number 2:</strong> {formData.phone2}</p>
                        <p><strong>Personal Email:</strong> {formData.personalEmail}</p>
                        <p><strong>City:</strong> {formData.city}</p>
                        <p><strong>Address:</strong> {formData.address}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </>
            )}
        </div>
    );
};

export default ContactDetails;

import React, { useState, useEffect } from 'react';
import './FinancialDetails.css';

const FinancialDetails = () => {
    const [formData, setFormData] = useState({
        bankName: '',
        ifsc: '',
        accountNo: '',
        accountName: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchFinancialDetails = async () => {
        try {
            const response = await fetch('/api/employees/me/financial-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch financial details');

            const data = await response.json();

            setFormData({
                bankName: data.financialDetails?.bankName || '',
                ifsc: data.financialDetails?.ifsc || '',
                accountNo: data.financialDetails?.accountNo || '',
                accountName: data.financialDetails?.accountName || '',
            });
        } catch (error) {
            console.error('Error:', error.message);
            alert('Could not load financial details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancialDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { bankName, ifsc, accountNo, accountName } = formData;
        if (!bankName || !ifsc || !accountNo || !accountName) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/employees/me/financial-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save financial details');
            }

            alert('Financial details updated successfully!');
            setIsEditing(false);
            fetchFinancialDetails(); // Refresh data
        } catch (error) {
            console.error('Error:', error.message);
            alert(error.message);
        }
    };

    const toggleEditMode = () => {
        if (!isEditing) {
            fetchFinancialDetails(); // Refresh data when switching to Show/View mode
        }
        setIsEditing(!isEditing);
    };

    if (loading) return <div>Loading financial details...</div>;

    return (
        <div className="financial-details">
            <h2>Financial Details</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            placeholder="Bank Name"
                        />
                    </div>
                    <div>
                        <label>IFSC Code</label>
                        <input
                            type="text"
                            name="ifsc"
                            value={formData.ifsc}
                            onChange={handleChange}
                            placeholder="IFSC Code"
                        />
                    </div>
                    <div>
                        <label>Account Number</label>
                        <input
                            type="text"
                            name="accountNo"
                            value={formData.accountNo}
                            onChange={handleChange}
                            placeholder="Account Number"
                        />
                    </div>
                    <div>
                        <label>Account Holder Name</label>
                        <input
                            type="text"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleChange}
                            placeholder="Account Holder Name"
                        />
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={toggleEditMode} className="cancel-btn">
                        Cancel
                    </button>
                </form>
            ) : (
                <>
                <div className="card financial-card">
                    <h3>Financial Details</h3>
                    <p><strong>Bank Name:</strong> {formData.bankName}</p>
                    <p><strong>IFSC:</strong> {formData.ifsc}</p>
                    <p><strong>Account No:</strong> {'********' + formData.accountNo.slice(-4)}</p>
                    <p><strong>Account Name:</strong> {formData.accountName}</p>
            
                    <button className="edit-btn" onClick={toggleEditMode}>Edit</button>
                </div>
            </>
                        )}
        </div>
    );
};

export default FinancialDetails;

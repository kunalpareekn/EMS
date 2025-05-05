import React, { useEffect, useState, useCallback } from 'react';
import './EducationQualifications.css';

const EducationQualifications = () => {
    const [academicRecords, setAcademicRecords] = useState([]);
    const [professionalQualifications, setProfessionalQualifications] = useState([]);

    const [academicInput, setAcademicInput] = useState({ institution: '', details: '' });
    const [professionalInput, setProfessionalInput] = useState({ title: '', organization: '', duration: '', description: '' });

    const [showAcademicForm, setShowAcademicForm] = useState(false);
    const [showProfessionalForm, setShowProfessionalForm] = useState(false);

    const token = localStorage.getItem('token');

    const fetchQualifications = useCallback(async () => {
        try {
            const res = await fetch('/api/employees/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setAcademicRecords(data.academicRecords || []);
            setProfessionalQualifications(data.professionalQualifications || []);
        } catch (error) {
            console.error('Error fetching qualifications:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchQualifications();
    }, [fetchQualifications]);

    const handleAddAcademic = async () => {
        if (!academicInput.institution || !academicInput.details) return;

        try {
            const res = await fetch('/api/employees/me/academic-records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(academicInput),
            });

            if (!res.ok) throw new Error('Failed to add academic record');

            const updated = await res.json();
            setAcademicRecords(updated.academicRecords || []);
            setAcademicInput({ institution: '', details: '' });
            setShowAcademicForm(false); // hide form after add
        } catch (error) {
            console.error('Error adding academic record:', error);
        }
    };

    const handleAddProfessional = async () => {
        if (!professionalInput.title || !professionalInput.duration) return;

        try {
            const res = await fetch('/api/employees/me/professional-qualifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(professionalInput),
            });

            if (!res.ok) throw new Error('Failed to add professional qualification');

            const updated = await res.json();
            setProfessionalQualifications(updated.professionalQualifications || []);
            setProfessionalInput({ title: '', organization: '', duration: '', description: '' });
            setShowProfessionalForm(false); // hide form after add
        } catch (error) {
            console.error('Error adding professional qualification:', error);
        }
    };

    return (
        <div className="edu-container">
            <h2 className="section-title">Academic Records</h2>
            <button onClick={() => setShowAcademicForm(!showAcademicForm)} className="toggle-button">
                {showAcademicForm ? 'Cancel' : 'Add Academic Record'}
            </button>

            {showAcademicForm && (
                <div className="edu-form">
                    <input
                        placeholder="Institution"
                        value={academicInput.institution}
                        onChange={(e) => setAcademicInput({ ...academicInput, institution: e.target.value })}
                    />
                    <input
                        placeholder="Details (e.g., Degree, Dates)"
                        value={academicInput.details}
                        onChange={(e) => setAcademicInput({ ...academicInput, details: e.target.value })}
                    />
                    <button onClick={handleAddAcademic} className="save-button">Save</button>
                </div>
            )}

            {academicRecords.length === 0 ? (
                <p className="empty-message">No academic records added yet.</p>
            ) : (
                academicRecords.map((record, index) => (
                    <div key={index} className="qualification-card">
                        <h3 className="qualification-title">{record.institution}</h3>
                        <p className="qualification-details">{record.details}</p>
                    </div>
                ))
            )}

            <h2 className="section-title">Professional Qualifications</h2>
            <button onClick={() => setShowProfessionalForm(!showProfessionalForm)} className="toggle-button">
                {showProfessionalForm ? 'Cancel' : 'Add Professional Qualification'}
            </button>

            {showProfessionalForm && (
                <div className="edu-form">
                    <input
                        placeholder="Title"
                        value={professionalInput.title}
                        onChange={(e) => setProfessionalInput({ ...professionalInput, title: e.target.value })}
                    />
                    <input
                        placeholder="Organization (optional)"
                        value={professionalInput.organization}
                        onChange={(e) => setProfessionalInput({ ...professionalInput, organization: e.target.value })}
                    />
                    <input
                        placeholder="Duration"
                        value={professionalInput.duration}
                        onChange={(e) => setProfessionalInput({ ...professionalInput, duration: e.target.value })}
                    />
                    <input
                        placeholder="Description (optional)"
                        value={professionalInput.description}
                        onChange={(e) => setProfessionalInput({ ...professionalInput, description: e.target.value })}
                    />
                    <button onClick={handleAddProfessional} className="save-button">Save</button>
                </div>
            )}

            {professionalQualifications.length === 0 ? (
                <p className="empty-message">No professional qualifications added yet.</p>
            ) : (
                professionalQualifications.map((qualification, index) => (
                    <div key={index} className="qualification-card">
                        <h3 className="qualification-title">{qualification.title}</h3>
                        {qualification.organization && <p className="qualification-details">{qualification.organization}</p>}
                        <p className="qualification-details">{qualification.duration}</p>
                        {qualification.description && <p className="qualification-details">{qualification.description}</p>}
                    </div>
                ))
            )}
        </div>
    );
};

export default EducationQualifications;

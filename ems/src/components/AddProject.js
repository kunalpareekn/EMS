import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProject.css';

function AddProject() {
    const [form, setForm] = useState({ name: '', status: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add project');
            }

            navigate('/dashboard1');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="add-project-container">
            <h1>Add Project</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="add-project-form">
                <input
                    name="name"
                    placeholder="Project Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="status"
                    placeholder="Project Status"
                    value={form.status}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
}

export default AddProject;

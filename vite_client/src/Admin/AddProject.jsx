import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
            
            navigate('/dashboard-admin');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">Add Project</h1>
            
            {error && <p className="mb-4 text-red-500">{error}</p>}
            
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-4">
                <input
                    name="name"
                    placeholder="Project Name"
                    value={form.name}
                    onChange={handleChange}
                    className="p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />
                
                <input
                    name="status"
                    placeholder="Project Status"
                    value={form.status}
                    onChange={handleChange}
                    className="p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />
                
                <button 
                    type="submit"
                    className="p-3 text-base font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors duration-300"
                >
                    Add Project
                </button>

                <Link 
                    to="/dashboard-admin" 
                    className="p-3 text-center text-base text-gray-700 hover:text-gray-900"
                >
                    Back to Dashboard
                </Link>
            </form>
        </div>
    );
}

export default AddProject;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        const emailDomain = form.email.split('@')[1];

        // Decide API endpoint based on email domain
        let apiEndpoint = '';
        if (emailDomain === 'gmail.com') {
            apiEndpoint = 'http://localhost:3000/api/login'; // Admin
        } else if (emailDomain === 'paarsiv.com') {
            apiEndpoint = 'http://localhost:5000/api/employees/login'; // Employee
        } else {
            setError('Invalid email domain.');
            return;
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.status === 401) {
                setError('Invalid email or password.');
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Store user data in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role || 'user');
            localStorage.setItem('userName', data.name || data.employee?.name || 'User');
            localStorage.setItem('email', form.email); // Store email in localStorage

            // Redirect based on domain
            if (emailDomain === 'gmail.com') {
                navigate('/dashboard1'); // Admin Dashboard
            } else {
                navigate('/dashboard2'); // Employee Dashboard
            }

        } catch (err) {
            console.error('Login failed:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div 
            className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('../media/Untitled-2 (2).png')" }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
                <h1 className="text-2xl font-bold text-green-500 mb-2">Login</h1>
                <p className="text-green-500 mb-5">Login to your account.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="email"
                        placeholder="E-mail Address"
                        type="email"
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span>Remember me</span>
                        </label>
                        <a 
                            href="/reset-password" 
                            className="text-blue-500 hover:text-blue-700 hover:underline"
                        >
                            Reset Password?
                        </a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Sign In
                    </button>
                </form>
                
                <p className="mt-5 text-sm">
                    Don't have an account?{' '}
                    <a 
                        href="/register" 
                        className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                        Create New
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
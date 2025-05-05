import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                <p>Login to your account.</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        placeholder="E-mail Address"
                        type="email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                        required
                    />
                    <div className="form-options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="/reset-password" className="reset-password-link">Reset Password?</a>
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                </form>
                <p className="create-account">
                    Don’t have an account? <a href="/register">Create New</a>
                </p>
            </div>
        </div>
    );
}

export default Login;

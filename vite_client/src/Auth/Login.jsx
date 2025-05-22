import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const emailDomain = form.email.split('@')[1];

        if (!form.email.includes('@') || !emailDomain) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        let apiEndpoint = '';
        let userRole = '';

        if (emailDomain === 'gmail.com') {
            apiEndpoint = 'http://localhost:5000/api/v1/admin/auth/login';
            userRole = 'admin';
        } else if (emailDomain === 'paarsiv.com') {
            apiEndpoint = 'http://localhost:5000/api/v1/employee/auth/login'; // ✅ Corrected
            userRole = 'employee';
        } else {
            setError('Invalid email domain. Only @gmail.com and @paarsiv.com are allowed.');
            setIsLoading(false);
            return;
        }

        console.log("Logging into:", apiEndpoint);

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })

            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                if (text.startsWith('<!DOCTYPE html>')) {
                    throw new Error('Server returned HTML instead of JSON. Check your API endpoint.');
                }
                throw new Error(`Unexpected response type: ${contentType}`);
            }

            if (response.status === 401) {
                setError('Invalid email or password.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', userRole);
            localStorage.setItem('userName', data.name || 'User');
            localStorage.setItem('email', form.email);

            navigate(userRole === 'admin' ? '/dashboard-admin' : '/dashboard-employee');

        } catch (err) {
            console.error('Login failed:', err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
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
                        value={form.email}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                        value={form.password}
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
                        disabled={isLoading}
                        className={`w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
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

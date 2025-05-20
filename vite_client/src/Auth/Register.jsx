import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',  // Changed from firstName/lastName to single name
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!formData.agreeToTerms) {
            setError('You must agree to the terms and privacy policy');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
console.log(data)
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('../media/Untitled-2 (2).png')" }}
        >
            <form 
                className="w-full max-w-md p-8 rounded-lg text-center"
                onSubmit={handleSubmit}
            >
                <h1 className="text-green-500 text-2xl font-bold mb-4">Welcome to Paarsiv</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}

                <div className="mb-6">
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex gap-6 mb-6">
                    <div className="flex-1">
                        <input
                            name="email"
                            placeholder="E-Mail Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            name="phone"
                            placeholder="Phone No."
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-6 mb-6">
                    <div className="flex-1">
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mb-6 text-left">
                    <label className="flex items-center">
                        <input
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span>I agree to all the Terms, Privacy Policy</span>
                    </label>
                </div>

                <button
                    className={`w-full p-4 rounded-md text-white font-medium transition-colors ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Create Account'}
                </button>

                <p className="mt-4 text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-green-500 font-medium hover:underline">
                        Log In
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Register;
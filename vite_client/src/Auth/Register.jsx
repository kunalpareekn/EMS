import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('You must agree to the terms and privacy policy');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            navigate('/login');
        } catch (error) {
            setError(error.message);
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

                <div className="flex gap-6 mb-6">
                    <div className="flex-1">
                        <input
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                        />
                    </div>
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
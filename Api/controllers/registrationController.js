const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id, user.role);
        res.status(201).json({ message: 'Registration successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, user.role);
        res.status(200).json({ message: 'Login successful22', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Export the correct implementation
module.exports = { registerUser, loginUser };
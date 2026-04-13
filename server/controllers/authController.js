const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // 2. Create new user and "Hash" (scramble) the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({ success: true, msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // 3. Create a JWT Token (The "VIP Pass")
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// File: controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


exports.signup = async (req, res) => {
    try {
        const { username, email, location, country, gender, password} = req.body;
        const newUser = new User({ username, email, location, country, gender, password});
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id,email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '4h', algorithm: 'HS256' });
        res.json({
            token,
            user: {
            id: user._id,
            email: user.email,
            role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
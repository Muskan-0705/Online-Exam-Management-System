const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, rollNo, course, semester, subject } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Normalize role
        let userRole = 'Student';
        if (role) {
            const r = role.toLowerCase();
            if (r === 'admin') userRole = 'Admin';
            else if (r === 'teacher') userRole = 'Teacher';
        }

        user = new User({ name, email, password, role: userRole, rollNo, course, semester, subject });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role } });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: identifier }, { rollNo: identifier }]
        });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been disabled. Contact administrator.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Update last login info
        user.lastLoginIP = req.ip || req.connection.remoteAddress;
        user.lastLoginTime = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                rollNo: user.rollNo,
                role: user.role,
                course: user.course,
                semester: user.semester,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /auth/profile
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const updates = req.body;
        // Prevent password update here
        delete updates.password;
        delete updates.role;

        const user = await User.findByIdAndUpdate(decoded.id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /auth/change-password
router.put('/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(decoded.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        user.password = await bcrypt.hash(newPassword, 10); // userSchema pre save might need to be explicitly called or just hash here
        // Note: The pre-save hook works on .save(), but if we manually hash we can update.
        // Let's use save() to trigger the hook if implemented, or just manual hash.
        // The current User.js has a pre-save hook. So:
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

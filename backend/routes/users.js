const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// GET /users - List all users (Admin only)
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /users/:id - Delete a user (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /users/:id/toggle-status - Enable/Disable account (Admin only)
router.put('/:id/toggle-status', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent admin from disabling themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot disable your own account' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ message: `Account ${user.isActive ? 'enabled' : 'disabled'}`, user: { ...user._doc, password: undefined } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /users/create - Create new user (Admin only)
router.post('/create', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const { name, email, password, role, rollNo, course, semester, subject } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, password, role, rollNo, course, semester, subject });
        await user.save();

        res.status(201).json({ message: 'User created successfully', user: { ...user._doc, password: undefined } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

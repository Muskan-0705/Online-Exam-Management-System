const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// ========== COURSE ROUTES ==========

// GET /courses - Get all courses
router.get('/courses', authMiddleware, async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /courses - Create course (Admin only)
router.post('/courses', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const { name, code, duration, department } = req.body;

        const existing = await Course.findOne({ $or: [{ name }, { code }] });
        if (existing) return res.status(400).json({ message: 'Course already exists' });

        const course = new Course({ name, code, duration, department });
        await course.save();

        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /courses/:id - Update course (Admin only)
router.put('/courses/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /courses/:id - Delete course (Admin only)
router.delete('/courses/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ========== SUBJECT ROUTES ==========

// GET /subjects - Get all subjects (optionally filter by course)
router.get('/subjects', authMiddleware, async (req, res) => {
    try {
        const query = req.query.course ? { course: req.query.course } : {};
        const subjects = await Subject.find(query).populate('course', 'name code');
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /subjects - Create subject (Admin only)
router.post('/subjects', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const { name, code, course, semester, credits } = req.body;

        const existing = await Subject.findOne({ code });
        if (existing) return res.status(400).json({ message: 'Subject code already exists' });

        const subject = new Subject({ name, code, course, semester, credits });
        await subject.save();

        res.status(201).json(subject);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /subjects/:id - Update subject (Admin only)
router.put('/subjects/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        res.json(subject);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /subjects/:id - Delete subject (Admin only)
router.delete('/subjects/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Create Question (Teacher/Admin)
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    console.log('=== POST /questions called ===');
    try {
        console.log('User:', JSON.stringify(req.user));
        console.log('Creating question with data:', JSON.stringify(req.body, null, 2));
        
        // Validate required fields
        if (!req.body.text) {
            console.log('Missing text field');
            return res.status(400).json({ message: 'Question text is required', error: 'Missing text' });
        }
        if (!req.body.subject) {
            console.log('Missing subject field');
            return res.status(400).json({ message: 'Subject is required', error: 'Missing subject' });
        }
        
        const question = new Question({ 
            ...req.body, 
            createdBy: req.user.id 
        });
        
        console.log('Saving question to DB...');
        const savedQuestion = await question.save();
        console.log('✅ Question created successfully:', savedQuestion._id);
        res.status(201).json(savedQuestion);
    } catch (err) {
        console.error('❌ Error creating question:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            message: 'Error creating question', 
            error: err.message,
            details: err.errors ? Object.keys(err.errors) : 'Unknown'
        });
    }
});

// Get All Questions (Teacher/Admin) - Filter by Subject/Difficulty
router.get('/', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const { subject, difficulty, type } = req.query;
        let query = {};
        if (subject) query.subject = new RegExp(subject, 'i');
        if (difficulty) query.difficulty = difficulty;
        if (type) query.type = type;

        // Teachers see their own or all? Let's show all for collaboration, or filter by createdBy if privacy needed.
        // For now showing all to facilitate "Department" sharing.
        const questions = await Question.find(query).sort({ createdAt: -1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

// Update Question
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: 'Error updating question' });
    }
});

// Delete Question
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting question' });
    }
});

module.exports = router;

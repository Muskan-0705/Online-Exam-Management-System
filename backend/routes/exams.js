const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// POST /exams -> Admin
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        console.log('Creating Exam:', req.body.title);
        const { randomize, questions: questionIds, filters, questionCount, ...examData } = req.body;
        const Question = require('../models/Question'); // Import locally or move to top if preferred

        let finalQuestions = [];

        if (randomize) {
            // Auto Mode: Fetch random questions based on filters
            const query = {};
            if (filters) {
                if (filters.subject) query.subject = new RegExp(filters.subject, 'i');
                if (filters.difficulty) query.difficulty = filters.difficulty;
            }

            // Fetch all matching questions then sample them
            // optimizations can be done for large datasets but this is fine for now
            const matchingQuestions = await Question.find(query);

            if (matchingQuestions.length < questionCount) {
                return res.status(400).json({
                    message: `Not enough questions found. Found ${matchingQuestions.length}, requested ${questionCount}`
                });
            }

            // Shuffle and slice
            const shuffled = matchingQuestions.sort(() => 0.5 - Math.random());
            finalQuestions = shuffled.slice(0, Number(questionCount));

        } else {
            // Manual Mode: Fetch by IDs
            if (!questionIds || questionIds.length === 0) {
                return res.status(400).json({ message: 'No questions selected for manual mode' });
            }
            finalQuestions = await Question.find({ _id: { $in: questionIds } });
        }

        // Map Question documents to Exam embedded schema
        const embeddedQuestions = finalQuestions.map(q => ({
            questionText: q.text,
            options: q.options,
            correctAnswer: q.correctOption,
            type: q.type,
            explanation: q.explanation,
            subject: q.subject,
            difficulty: q.difficulty
        }));

        const exam = new Exam({
            ...examData,
            questions: embeddedQuestions,
            randomizeQuestions: randomize,
            totalMarks: embeddedQuestions.length, // Assume 1 mark per question for now
            createdBy: req.user.id
        });

        await exam.save();
        console.log('Exam created successfully:', exam._id);
        res.status(201).json(exam);
    } catch (err) {
        console.error('Error creating exam:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /exams -> Admin, Student, Teacher
router.get('/', authMiddleware, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin' && req.user.role !== 'Teacher') {
            query.isPublished = true;
        }

        const exams = await Exam.find(query).select('-questions.correctAnswer');
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /exams/:id -> Admin, Student
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Students shouldn't see correct answers before submission
        const examData = exam.toObject();
        if (req.user.role !== 'Admin' && req.user.role !== 'Teacher') {
            examData.questions.forEach(q => delete q.correctAnswer);

            // Randomization Logic
            if (examData.randomizeQuestions) {
                for (let i = examData.questions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [examData.questions[i], examData.questions[j]] = [examData.questions[j], examData.questions[i]];
                }
            }
        }

        res.json(examData);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /exams/:id -> Admin
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /exams/:id -> Admin
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json({ message: 'Exam deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /results/:examId -> Admin
router.get('/results/:examId', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const Submission = require('../models/Submission');
        const results = await Submission.find({ exam: req.params.examId }).populate('student', 'name email');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

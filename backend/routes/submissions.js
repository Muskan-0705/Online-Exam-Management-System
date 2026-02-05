const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Submission = require('../models/Submission');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// POST /submit/:examId -> Student
router.post('/:examId', authMiddleware, roleMiddleware(['Student']), async (req, res) => {
    try {
        const { answers } = req.body; // Expects [{ questionId: "...", answer: "..." }]
        const exam = await Exam.findById(req.params.examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        let marks = 0;
        let isGraded = true;

        // Map exam questions for easy lookup
        const questionMap = new Map(exam.questions.map(q => [q._id.toString(), q]));

        answers.forEach(sub => {
            const q = questionMap.get(sub.questionId);
            if (q) {
                if (q.type === 'Descriptive') {
                    isGraded = false; // Needs manual check
                } else {
                    // Auto grade
                    // sub.answer might be index (MCQ) or boolean (Boolean)
                    // q.correctAnswer is stored in DB
                    if (String(sub.answer) === String(q.correctAnswer)) {
                        marks++;
                    }
                }
            }
        });

        const submission = new Submission({
            exam: req.params.examId,
            student: req.user.id,
            answers,
            marks,
            isGraded
        });

        await submission.save();
        res.status(201).json(submission);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already submitted this exam' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /pending -> Teacher (Get Ungraded Submissions)
router.get('/pending', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        // Find submissions where isGraded is false
        const submissions = await Submission.find({ isGraded: false })
            .populate('exam', 'title')
            .populate('student', 'name email rollNo');
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /grade/:id -> Teacher (Update Marks)
router.put('/grade/:id', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const { marks } = req.body; // New total marks
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { marks, isGraded: true },
            { new: true }
        );
        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /submission/:id -> Student Review (New)
router.get('/review/:id', authMiddleware, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('exam')
            .populate('student', 'name rollNo');

        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        // Ensure only the student or admin can view
        if (req.user.role !== 'Admin' && submission.student._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(submission);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /my-results -> Student
router.get('/my-results', authMiddleware, roleMiddleware(['Student']), async (req, res) => {
    try {
        const results = await Submission.find({ student: req.user.id }).populate('exam', 'title date duration totalMarks'); // totalMarks calculation?
        // We might want to compute total possible marks
        // But for now, returning submission with exam details is fine
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /analytics -> Admin/Teacher
router.get('/analytics/stats', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const User = require('../models/User');
        const Exam = require('../models/Exam'); // Ensure we have Exam model

        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'Student' });

        // 2. Total Exams
        const totalExams = await Exam.countDocuments(); // Active exams

        // 3. Global Average Score
        // We need all submissions. 
        // Note: Marks are absolute. Better to calc percentage if totalMarks is known.
        // For simplicity, let's just return avg absolute marks or try to normalize if possible.
        // The Exam model has totalMarks.
        // The Exam model has totalMarks.
        const submissions = await Submission.find().populate('exam').populate('student', 'name email');

        let totalPct = 0;
        let count = 0;
        let subjectScores = {}; // { Subject: { total: 0, count: 0 } }
        let studentScores = {}; // { studentId: { totalPct: 0, count: 0, student: ... } }

        submissions.forEach(sub => {
            if (sub.exam && sub.exam.totalMarks > 0 && sub.student) {
                const pct = (sub.marks / sub.exam.totalMarks) * 100;
                totalPct += pct;
                count++;

                // Subject Analysis
                const subj = sub.exam.category || 'General';
                if (!subjectScores[subj]) subjectScores[subj] = { total: 0, count: 0 };
                subjectScores[subj].total += pct;
                subjectScores[subj].count++;

                // Student Analysis
                const sId = sub.student._id.toString();
                if (!studentScores[sId]) studentScores[sId] = { totalPct: 0, count: 0, student: sub.student };
                studentScores[sId].totalPct += pct;
                studentScores[sId].count++;
            }
        });

        const avgScore = count ? (totalPct / count).toFixed(1) : 0;

        // Toppers (Avg % across all exams)
        const toppers = Object.values(studentScores)
            .map(s => {
                return {
                    name: s.student.name,
                    email: s.student.email,
                    avg: (s.totalPct / s.count).toFixed(1)
                };
            })
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 5);

        // We need to populate student names for toppers. 
        // Better: Populate student in find().
        // Re-run query or just populate above.

        // Weak Areas
        const weakAreas = Object.keys(subjectScores).map(subj => ({
            subject: subj,
            avg: (subjectScores[subj].total / subjectScores[subj].count).toFixed(1)
        })).sort((a, b) => a.avg - b.avg).slice(0, 5);

        res.json({
            totalStudents,
            totalExams,
            avgScore,
            toppers, // IDs only currently, fixing below
            weakAreas
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /export/:examId - Export results as CSV (Admin/Teacher only)
router.get('/export/:examId', authMiddleware, roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const submissions = await Submission.find({ exam: req.params.examId })
            .populate('student', 'name email rollNo')
            .populate('exam', 'title totalMarks');

        if (!submissions.length) {
            return res.status(404).json({ message: 'No submissions found' });
        }

        // Create CSV content
        const examTitle = submissions[0].exam.title;
        const totalMarks = submissions[0].exam.totalMarks || 100;

        let csv = 'Name,Email,Roll No,Marks,Percentage,Status,Submitted At\n';

        submissions.forEach(sub => {
            const percentage = totalMarks > 0 ? ((sub.marks / totalMarks) * 100).toFixed(2) : 0;
            const status = sub.isGraded ? 'Graded' : 'Pending';

            csv += `"${sub.student.name}","${sub.student.email}","${sub.student.rollNo || 'N/A'}",${sub.marks},${percentage}%,${status},"${new Date(sub.submittedAt).toLocaleString()}"\n`;
        });

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${examTitle.replace(/[^a-z0-9]/gi, '_')}_results.csv"`);
        res.send(csv);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

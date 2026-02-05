const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [mongoose.Schema.Types.Mixed], // index of chosen options or text answer
    marks: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    isGraded: { type: Boolean, default: true } // False if needs manual check
});

// Ensure a student can only submit once per exam
submissionSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);

const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questions: [{
        questionText: String,
        options: [String],
        correctAnswer: mongoose.Schema.Types.Mixed,
        type: { type: String, enum: ['MCQ', 'Boolean', 'Descriptive'], default: 'MCQ' },
        explanation: String,
        subject: String, // from Question Bank
        difficulty: String
    }],
    totalMarks: { type: Number, default: 0 },
    passMarks: { type: Number, default: 0 },
    randomizeQuestions: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true }, // Default true for now
    category: { type: String } // e.g. Subject or Dept
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);

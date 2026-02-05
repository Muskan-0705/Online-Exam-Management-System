const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [String], // For MCQ
    correctOption: { type: Number, default: null }, // Index for MCQ
    type: { type: String, enum: ['MCQ', 'Boolean', 'Descriptive'], default: 'MCQ' },
    explanation: String,
    subject: { type: String, required: true }, // Categorization
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);

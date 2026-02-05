const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    course: { type: String },
    semester: { type: String },
    subject: { type: String },
    profileImage: { type: String },
    role: { type: String, enum: ['Admin', 'Student', 'Teacher'], default: 'Student' },
    isActive: { type: Boolean, default: true },
    lastLoginIP: { type: String },
    lastLoginTime: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);

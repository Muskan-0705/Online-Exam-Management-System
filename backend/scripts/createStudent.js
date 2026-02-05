const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

const createStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing student if exists
        await User.deleteOne({ email: 'student@exam.com' });

        // Create student user
        const student = new User({
            name: 'Test Student',
            email: 'student@exam.com',
            password: 'student123',
            role: 'Student',
            rollNo: 'S12345',
            department: 'Computer Science',
            isActive: true
        });

        await student.save();

        console.log('✅ Student account created successfully!');
        console.log('================================');
        console.log('Email: student@exam.com');
        console.log('Password: student123');
        console.log('Role: Student');
        console.log('================================');

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

createStudent();

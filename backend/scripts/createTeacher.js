const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

const createTeacher = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing teacher and recreate
        await User.deleteOne({ email: 'teacher@exam.com' });

        // Create teacher user
        const teacher = new User({
            name: 'Teacher User',
            email: 'teacher@exam.com',
            password: 'teacher123',
            role: 'Teacher',
            subject: 'Mathematics',
            isActive: true
        });

        await teacher.save();

        console.log('✅ Teacher account created successfully!');
        console.log('================================');
        console.log('Email: teacher@exam.com');
        console.log('Password: teacher123');
        console.log('Role: Teacher');
        console.log('================================');

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

createTeacher();

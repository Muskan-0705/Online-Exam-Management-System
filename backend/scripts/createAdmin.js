const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing admin and recreate
        await User.deleteOne({ email: 'admin@exam.com' });

        // Create admin user (password will be hashed by User model)
        const admin = new User({
            name: 'Administrator',
            email: 'admin@exam.com',
            password: 'admin123',
            role: 'Admin',
            isActive: true
        });

        await admin.save();

        console.log('✅ Admin account created successfully!');
        console.log('================================');
        console.log('Email: admin@exam.com');
        console.log('Password: admin123');
        console.log('================================');

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

createAdmin();

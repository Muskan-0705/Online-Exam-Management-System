const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');

const setupTestUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete all existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create admin user
        const admin = new User({
            name: 'Administrator',
            email: 'admin@exam.com',
            password: 'admin123',
            role: 'Admin',
            isActive: true
        });
        await admin.save();
        console.log('✅ Admin created: admin@exam.com / admin123');

        // Create student user
        const student = new User({
            name: 'John Doe',
            email: 'student@exam.com',
            password: 'student123',
            role: 'Student',
            rollNo: '1001',
            course: 'B.Tech',
            semester: '5th',
            isActive: true
        });
        await student.save();
        console.log('✅ Student created: student@exam.com / student123');

        // Create teacher user
        const teacher = new User({
            name: 'Jane Smith',
            email: 'teacher@exam.com',
            password: 'teacher123',
            role: 'Teacher',
            isActive: true
        });
        await teacher.save();
        console.log('✅ Teacher created: teacher@exam.com / teacher123');

        console.log('\n================================');
        console.log('Test Users Setup Complete!');
        console.log('================================');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

setupTestUsers();

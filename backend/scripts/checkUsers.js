const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, { password: 0 });
        console.log('\n📋 All Users in Database:');
        console.log('================================');
        users.forEach(u => {
            console.log(`Email: ${u.email}`);
            console.log(`Name: ${u.name}`);
            console.log(`Role: ${u.role}`);
            console.log(`Active: ${u.isActive}`);
            console.log('---');
        });
        console.log('================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkUsers();

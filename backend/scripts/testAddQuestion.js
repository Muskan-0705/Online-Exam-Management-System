const http = require('http');
const dotenv = require('dotenv');
const User = require('./models/User');
const mongoose = require('mongoose');

dotenv.config();

const testAddQuestion = async () => {
    try {
        // Connect to DB to get a teacher user
        await mongoose.connect(process.env.MONGODB_URI);
        
        const teacher = await User.findOne({ email: 'teacher@exam.com' });
        if (!teacher) {
            console.error('❌ Teacher not found');
            process.exit(1);
        }

        // Create a JWT token manually
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: teacher._id, role: teacher.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log('🔐 Testing with:');
        console.log('  User ID:', teacher._id);
        console.log('  Role:', teacher.role);
        console.log('  Token:', token.substring(0, 20) + '...');

        // Try to add a question
        const questionData = {
            text: 'Test Question?',
            subject: 'Test Subject',
            difficulty: 'Easy',
            type: 'MCQ',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctOption: 0
        };

        console.log('\n📝 Submitting question:', JSON.stringify(questionData, null, 2));

        const postData = JSON.stringify(questionData);

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/questions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log('\n📊 Response Status:', res.statusCode);
                console.log('Response Data:', data);
                process.exit(0);
            });
        });

        req.on('error', (err) => {
            console.error('\n❌ Request Error:', err.message);
            process.exit(1);
        });

        req.write(postData);
        req.end();
        
    } catch (err) {
        console.error('\n❌ ERROR:', err.message);
        process.exit(1);
    }
};

testAddQuestion();

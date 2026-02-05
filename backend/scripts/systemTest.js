const term = require('child_process');

async function runTest() {
    console.log("🚀 Starting System Verification...");

    const BASE_URL = 'http://localhost:5000';
    let adminToken = '';
    let studentToken = '';
    let studentId = '';
    let examId = '';
    let questionId = '';

    // Helper for requests
    const request = async (endpoint, method = 'GET', body = null, token = null) => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });
            const data = await res.json();
            return { status: res.status, data };
        } catch (e) {
            console.error(`❌ Request failed: ${method} ${endpoint}`, e.message);
            return { status: 500, data: null };
        }
    };

    // 1. Login Admin
    console.log("\n1. Testing Admin Login...");
    const loginRes = await request('/auth/login', 'POST', {
        identifier: 'admin@exam.com',
        password: 'admin123'
    });

    if (loginRes.status === 200 && loginRes.data.token) {
        adminToken = loginRes.data.token;
        console.log("✅ Admin Login Successful");
    } else {
        console.error("❌ Admin Login Failed", loginRes.data);
        return;
    }

    // 2. Create Subject (Course/Academic)
    console.log("\n2. Testing Subject Creation...");
    const subjectRes = await request('/academic/subjects', 'POST', {
        name: 'Integration Testing',
        code: 'IT101'
    }, adminToken);

    if (subjectRes.status === 201 || subjectRes.status === 400) { // 400 if exists
        console.log(`✅ Subject Creation Verified (Status: ${subjectRes.status})`);
    } else {
        console.error("❌ Subject Creation Failed", subjectRes.data);
    }

    // 3. Create Question
    console.log("\n3. Testing Question Creation...");
    const questionRes = await request('/questions', 'POST', {
        text: "What represents the 'I' in API?",
        subject: "Integration Testing",
        type: "MCQ",
        options: ["Interface", "Integration", "Internet", "Interchange"],
        correctOption: 0,
        difficulty: "Easy"
    }, adminToken);

    if (questionRes.status === 201) {
        questionId = questionRes.data._id;
        console.log("✅ Question Created Successfully");
    } else {
        console.error("❌ Question Creation Failed", questionRes.data);
        return; // Critical failure
    }

    // 4. Create Exam
    console.log("\n4. Testing Exam Creation...");
    // We need a future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const examRes = await request('/exams', 'POST', {
        title: "System Test Exam",
        date: tomorrow.toISOString(),
        duration: 30,
        randomize: false,
        questions: [questionId] // Manual selection
    }, adminToken);

    if (examRes.status === 201) {
        examId = examRes.data._id;
        console.log("✅ Exam Created Successfully");
    } else {
        console.error("❌ Exam Creation Failed", examRes.data);
        return;
    }

    // 5. Publish Exam (if needed, usually auto-published or published via update)
    // Checking default status. The schema says default is published: true (in our earlier fix or view). 
    // Let's assume it is.

    // 6. Create/Login Student
    console.log("\n5. Testing Student Authentication...");
    const studentEmail = `user_${Date.now()}@test.com`;
    const signupRes = await request('/auth/signup', 'POST', {
        name: "Test Student",
        email: studentEmail,
        password: "password123",
        role: "Student",
        rollNo: `R${Date.now()}`
    });

    if (signupRes.status === 201) {
        studentToken = signupRes.data.token;
        studentId = signupRes.data.user.id;
        console.log("✅ Student Signup Successful");
    } else {
        console.error("❌ Student Signup Failed", signupRes.data);
        return;
    }

    // 7. Fetch Exam as Student (to get proper Question IDs)
    console.log("\n6. Testing Exam Retrieval (Student)...");
    const getExamsRes = await request(`/exams/${examId}`, 'GET', null, studentToken);

    if (getExamsRes.status === 200) {
        console.log("✅ Exam Visible to Student");
    } else {
        console.error("❌ Exam NOT Visible to Student", getExamsRes.data);
    }

    const examData = getExamsRes.data;
    // The question ID to answer is the one IN THE EXAM (embedded), not the global one.
    // In ExamPlayer.jsx, it uses q._id from the loaded exam.
    const examQuestionId = examData.questions[0]._id;

    // 8. Submit Exam
    console.log("\n7. Testing Exam Submission...");
    const submitRes = await request(`/submit/${examId}`, 'POST', {
        answers: [
            { questionId: examQuestionId, answer: 0 } // Correct answer 'Interface' (Index 0)
        ]
    }, studentToken);

    if (submitRes.status === 201) {
        console.log("✅ Exam Submitted Successfully");
        console.log(`   Score: ${submitRes.data.marks}`); // Should be 1
        if (submitRes.data.marks === 1) console.log("   Grading Logic: ✅ Correct");
        else console.log("   Grading Logic: ❌ Incorrect (Expected 1)");
    } else {
        console.error("❌ Submission Failed", submitRes.data);
    }

    // 9. Profile Update
    console.log("\n8. Testing Profile Update...");
    const profileRes = await request('/auth/profile', 'PUT', {
        name: "Updated Student Name",
        course: "BCA" // Testing new fields
    }, studentToken);

    if (profileRes.status === 200 && profileRes.data.course === "BCA") {
        console.log("✅ Profile Update Successful");
    } else {
        console.error("❌ Profile Update Failed", profileRes.data);
    }

    console.log("\n🎉 System Verification Complete!");
}

runTest();

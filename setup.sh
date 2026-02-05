#!/bin/bash

echo "🚀 Starting Online Examination Management System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB CLI not found, but continuing (assuming MongoDB is running)"
else
    echo "✅ MongoDB found"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Setup Instructions:"
echo "1. Make sure MongoDB is running"
echo "2. Create .env file in root and both frontend/backend folders"
echo "3. Run: npm run setup (from root)"
echo ""
echo "🎯 To start the development servers:"
echo "   Terminal 1: cd backend && npm start"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "🌐 Access the application at http://localhost:5173"

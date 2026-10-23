# QAverse 🚀

An AI-driven multi-agent software testing platform that automates website inspection, test scenario generation, execution planning, and reporting.

## 📁 Project Structure

- **`client/`**: React + Vite frontend application.
- **`server/`**: Node.js & Express backend API integrating Google GenAI (Gemini) and Playwright.

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # Configure PORT and GEMINI_API_KEY
npm run dev
```

The backend server runs on `http://localhost:3001`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend client runs on `http://localhost:5173`.

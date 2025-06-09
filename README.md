# Flappy Bird Game

This is a web-based Flappy Bird game with user authentication, score tracking, and a leaderboard.

## Features

- User authentication (Login, Register, Forgot Password, OTP Verification)
- Google OAuth integration
- Real-time score tracking
- Leaderboard to display top scores
- Responsive design

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud Project for OAuth credentials
- Gmail account for Nodemailer (or other SMTP service)

### Backend Setup

1. Navigate to the `backend` directory:
```bash
cd backend
```

2. Clone the repository
```bash
git clone https://github.com/ishitars27/Flappy-Bird.git
```

3. Navigate to the client directory
```bash
cd client
```

4. Install dependencies
```bash
npm install
```

5. Start the development server
```bash
npm run dev
```

## How to Play
- Press SPACE or CLICK/TAP to make the bird jump
- Avoid the pipes
- Try to get the highest score!

## Technologies Used
- React
- JavaScript (ES6+)
- CSS3
- Vite (Build Tool)

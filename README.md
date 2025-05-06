# MERN Authentication Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with JWT authentication and role-based access control.

## Features

- JWT-based authentication
- Role-based access control (User and Admin roles)
- User registration and login
- Admin login (no registration)
- Secure password hashing with bcrypt
- Separate dashboards for Users and Admins
- User upload history tracking
- Admin user management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/mern-auth
JWT_SECRET=your-secret-key
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Admin Account

To create an admin account, you'll need to manually insert it into the MongoDB database with the following structure:

```javascript
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "<hashed-password>",
  "role": "admin"
}
```

You can use the bcrypt hash of your chosen password.

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Users
- GET /api/users - Get all users (admin only)
- GET /api/users/:userId/history - Get user upload history (admin only)
- POST /api/users/upload - Add upload history (protected)

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Protected routes with role-based access control
- Secure password storage
- CORS enabled
- Environment variables for sensitive data 
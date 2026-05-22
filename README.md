DevPulse API

A backend REST API for managing software team issues, bug reports, and feature requests. Built with modern backend architecture using Node.js, Express.js, TypeScript, and PostgreSQL.

🚀 Live Links
Backend API

https://itift-server.vercel.app/

GitHub Repository

https://github.com/Md-Rabbi-Sarkar1/Issue-feature-tracker

📌 Features
User Registration & Login
JWT Authentication & Authorization
Role-Based Access Control (RBAC)
Create Issues (Bug / Feature Request)
Update & Delete Issues
Filter & Sort Issues
PostgreSQL Raw SQL Queries
Reusable Error Handling
Reusable Response Utility
Modular Backend Architecture
Secure Password Hashing using bcrypt
Environment Variable Configuration

🛠️ Tech Stack
Technology	Usage
Node.js	Backend Runtime
Express.js	API Framework
TypeScript	Type Safety
PostgreSQL	Database
bcrypt	Password Hashing
JSON Web Token	Authentication
pg	PostgreSQL Driver

📂 Project Structure
src/
│
│── modules
|      |──auth
|      |──issue
│── middleware/
│── types/
│── utils/
├── config/
├── db/
├── app.ts
└── server.ts

⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/Md-Rabbi-Sarkar1/Issue-feature-tracker.git
2. Move Into Project
cd devpulse
3. Install Dependencies
npm install
4. Configure Environment Variables

Create a .env file in the root directory.

PORT

DATABASE_URL

JWT_SECRET

5. Run Development Server
npm run dev

🗄️ Database Schema
Users Table
Column	Type
id	SERIAL PRIMARY KEY
name	VARCHAR(100)
email	VARCHAR(222) UNIQUE
password	TEXT
role	TEXT
created_at	TIMESTAMPTZ
updated_at	TIMESTAMPTZ
Issues Table
Column	Type
id	SERIAL PRIMARY KEY
title	VARCHAR(150)
description	TEXT
type	TEXT
status	TEXT
reporter_id	INTEGER
created_at	TIMESTAMPTZ
updated_at	TIMESTAMPTZ

🔐 Authentication Flow
Client Login
    ↓
Validate Credentials
    ↓
Generate JWT
    ↓
Client Stores Token
    ↓
Send Token in Authorization Header
    ↓
Server Verifies JWT

🌐 API Endpoints
Authentication Routes
Register User
Endpoint
POST /api/auth/signup
Request Body
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "password123",
  "role": "contributor"
}

Login User
Endpoint
POST /api/auth/login
Request Body
{
  "email": "john@gmail.com",
  "password": "password123"
}

Issues Routes
Create Issue
Endpoint
POST /api/issues
Protected Route

Requires JWT token.

Get All Issues
Endpoint
GET /api/issues
Query Parameters
Param	Values
sort	newest, oldest
type	bug, feature_request
status	open, in_progress, resolved
Example
GET /api/issues?sort=newest&type=bug

Get Single Issue
Endpoint
GET /api/issues/:id

Update Issue
Endpoint
PATCH /api/issues/:id
Access Rules
Maintainer → can update any issue
Contributor → can update only own open issues

Delete Issue
Endpoint
DELETE /api/issues/:id
Access
Maintainer only.

🧠 Authorization Logic
Role	Permissions
contributor	Create & View Issues
maintainer	Full Issue Management

🔒 Security Features
Password Hashing with bcrypt
JWT Authentication
Protected Routes
Role Verification Middleware
Environment Variables
SQL Parameterized Queries

👨‍💻 Author
Md Rabbi Sarkar

📄 License
This project is developed for academic assignment purposes.
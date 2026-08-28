Sure. Here's the complete project guidance in English only based on your Blogging Application requirement.

Blogging Application (MERN + Next.js) Architecture Guide
Project Features
Authentication Module
User Registration
User Login
JWT Authentication
Protected Routes
Role-Based Authorization (Admin/User)
Blog Module
Create Blog
Edit Blog
Delete Blog
View Blogs
Rich Text Editor
Author Information
Created Date
Last Updated Date
Dashboard Module
Display All Blogs
Search Blogs
Filter Blogs
My Blogs Section
Blog Statistics
Export Functionality
Export Blog as PDF
Export Blog as DOCX
Quality Requirements
WCAG AA Accessibility Compliance
Responsive Design (320px to Desktop)
Jest Unit Testing with 90%+ Coverage
TypeScript
Clean Code Standards
Recommended Tech Stack
Frontend
Next.js 15
TypeScript
Redux Toolkit
RTK Query
Tailwind CSS
React Hook Form
Zod
Axios
React Quill or TipTap
Jest
React Testing Library

Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
Bcrypt
Multer
PDFKit
Docx
Jest

Frontend Folder Structure
src
│
├── app
│   ├── login
│   ├── register
│   ├── dashboard
│   ├── blogs
│   ├── profile
│   └── layout.tsx
│
├── components
│   ├── common
│   ├── forms
│   ├── blog
│   └── layout
│
├── store
│   ├── store.ts
│   ├── authSlice.ts
│   └── blogSlice.ts
│
├── services
│   ├── authApi.ts
│   └── blogApi.ts
│
├── hooks
├── utils
├── constants
├── types
├── middleware.ts
│
└── tests

Backend Folder Structure
src
│
├── controllers
│   ├── authController.js
│   └── blogController.js
│
├── routes
│   ├── authRoutes.js
│   └── blogRoutes.js
│
├── models
│   ├── User.js
│   └── Blog.js
│
├── middleware
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── services
├── utils
├── config
│
└── server.js

Database Design
User Schema
{
  username: String,
  email: String,
  password: String,
  age: Number,
  address: String,
  role: String,
  createdAt: Date
}

Blog Schema
{
  title: String,
  content: String,
  authorId: ObjectId,
  authorName: String,
  createdAt: Date,
  updatedAt: Date
}

API Structure
Authentication APIs
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

Blog APIs
POST /api/blogs

GET /api/blogs

GET /api/blogs/:id

PUT /api/blogs/:id

DELETE /api/blogs/:id

Export APIs
GET /api/export/pdf/:id

GET /api/export/docx/:id

Authentication Flow
Registration
    ↓
Store User in MongoDB
    ↓
Login
    ↓
Validate Credentials
    ↓
Generate JWT Token
    ↓
Store Token in HTTP-Only Cookie
    ↓
Access Protected Pages

Authorization Logic
Admin
View All Blogs
Create Blogs
Edit Any Blog
Delete Any Blog

User
View All Blogs
Create Blogs
Edit Own Blogs
Delete Own Blogs

Redux State Example
auth
 ├─ user
 ├─ token
 └─ isAuthenticated

blogs
 ├─ blogs
 ├─ loading
 └─ error

Rich Text Editor

Use either:

TipTap


or

React Quill


Features:

Bold
Italic
Underline
Headings
Lists
Hyperlinks
Image Upload

Store the content as HTML in MongoDB.

Accessibility Requirements

The document specifically requires WCAG AA compliance.

Implement:

Semantic HTML
ARIA Labels
Keyboard Navigation
Alt Text for Images
Visible Focus Indicators
Proper Form Labels
Color Contrast Compliance
Screen Reader Support


Tools to test:

Lighthouse
Axe DevTools
WAVE

Responsive Design

Ensure support for:

320px
480px
768px
1024px
1440px


Test:

Login Page
Registration Page
Dashboard
Blog Editor
Navigation Menu
Important Security Considerations
Password Security
bcrypt.hash(password, 10)


Never store plain passwords.

JWT Security
Use HTTP-Only Cookies
Set Expiration Time
Refresh Tokens (Optional)

Input Validation

Use:

Zod
Express Validator


Prevent:

Invalid data
XSS attacks
Injection attacks
Unit Testing

Required coverage: 90%+.

Test:

Authentication
Registration Success
Registration Failure
Login Success
Login Failure
Protected Routes

Blog Features
Create Blog
Edit Blog
Delete Blog
View Blog
Export PDF
Export DOCX

UI Components
Forms
Buttons
Cards
Navbar
Blog Editor

Suggested Development Order
Phase 1
Project Setup
MongoDB Connection
Environment Variables

Phase 2
User Model
Authentication APIs
JWT Setup

Phase 3
Login Page
Registration Page
Protected Routing

Phase 4
Blog CRUD APIs
Blog Pages
Rich Text Editor

Phase 5
Dashboard
Search
Filtering
Pagination

Phase 6
PDF Export
DOCX Export

Phase 7
Accessibility Improvements
Responsive Design

Phase 8
Jest Testing
Coverage Report

Bonus Features (Good for Evaluation)
Dark Mode
User Profile Page
Blog Categories
Blog Tags
Comments System
Likes/Bookmarks
Image Upload to Cloudinary
Pagination
SEO using Next.js Metadata API
Server-Side Rendering (SSR)

These features will make the project look much closer to a production-grade application and can help significantly during your evaluation and demo.

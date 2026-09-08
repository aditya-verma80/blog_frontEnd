
# Blogging Application

A full-stack Blogging Application built with Next.js, React, Node.js, Express.js, MongoDB, and TypeScript. The application provides secure authentication, blog management, rich text editing, PDF/DOCX export functionality, role-based access control, responsive design, accessibility compliance, and comprehensive unit testing.


## Features

Authentication

This project is used by the following companies:

- User Registration
- User Login
- JWT-Based Authentication
- Protected Routes
- Role-Based Authorization
- Password Encryption using Bcrypt

## Blog Management
- Create Blog Posts
- Edit Blog Posts
- Delete Blog Posts
- View All Blogs
- View Individual Blog Details
- Rich Text Editor Support
- Blog Metadata Tracking
- Author Name
- Creation Date
- Last Updated Date
## Dashboard
- Display All Blogs
- Display User Blogs
- Search Blogs
- Filter Blogs
- Pagination Support
## Export Functionality
- Export Blog as PDF
- Export Blog as DOCX
## Quality Standards
- WCAG AA Accessibility Compliance
- Mobile Responsive Design (320px and above)
- Unit Testing with 90%+ Coverage
- TypeScript Support
- Clean Code Architecture
# Technology Stack
### Frontend
- Next.js
- React
- TypeScript
- Redux Toolkit
- RTK Query
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- TipTap / React Quill
- Jest
- React Testing Library
### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- PDFKit
- Docx
- Jest

## Project Architecture

Frontend Structure



```bash
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── blogs/
│   └── profile/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── blog/
│   └── layout/
│
├── services/
│   ├── authApi.ts
│   └── blogApi.ts
│
├── store/
│   ├── store.ts
│   ├── authSlice.ts
│   └── blogSlice.ts
│
├── hooks/
├── utils/
├── constants/
├── types/
└── middleware.ts
```
    

## Backend Structure



```bash
src/
├── controllers/
│   ├── authController.js
│   └── blogController.js
│
├── routes/
│   ├── authRoutes.js
│   └── blogRoutes.js
│
├── models/
│   ├── User.js
│   └── Blog.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── services/
├── utils/
├── config/
└── server.js
```


## Roadmap

{
  username: String,
  email: String,
  password: String,
  age: Number,
  address: String,
  role: String,
  created
}


## Database Schema

### User

```javascript
{
  username: String,
  email: String,
  password: String,
  age: Number,
  address: String,
  role: String,
  created
}
```

## Blog

```javascript
{
  title: String,
  content: String,
  authorId: ObjectId,
  authorName: String,
  createdAt: Date,
  updatedAt: Date
}
```
## API Endpoints

#### Authentication APIs
-  POST /api/auth/register

- POST /api/auth/login

- GET /api/auth/profile


#### Blog APIs

- POST   /api/blogs
- GET    /api/blogs
- GET    /api/blogs/:id
- PUT    /api/blogs/:id
- DELETE /api/blogs/:id

#### Export APIs

- GET /api/export/pdf/:id
- GET /api/export/docx/:id

## Authentication Flow

```bash
 User Registration
        ↓
Save User in MongoDB
        ↓
User Login
        ↓
Credential Validation
        ↓
JWT Token Generation
        ↓
Store Token Securely
        ↓
Access Protected Routes
```

## Authorization Roles

#### Admin
- View All Blogs
- Create Blogs
- Edit Any Blog
- Delete Any Blog
#### User
- View All Blogs
- Create Blogs
- Edit Own Blogs
- Delete Own Blogs


## Accessibility Requirements

The application follows WCAG AA accessibility standards and includes:

- Semantic HTML
- ARIA Labels
- Keyboard Navigation
- Screen Reader Compatibility
- Focus Indicators
- Accessible Forms
- Proper Color Contrast
- Alternative Text for Images

## Installation

Clone Repository

[Documentation](git clone https://github.com/your-username/blogging-application.git
)

### Frontend Setup

- cd client
- npm install
- npm run dev


### Backend Setup

- cd server
- npm install
- npm run dev

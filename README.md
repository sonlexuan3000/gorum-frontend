# Gorum - Modern Web Forum

**Student Name:** [Le Xuan Son]

A modern, feature-rich web forum application built with Go and React. Gorum provides a seamless platform for community discussions with topics, posts, comments, voting, and real-time notifications.

---

## Links

- **Live Application:** https://gorum-frontend.vercel.app
- **Backend API:** https://gorum-backend.onrender.com
- **Frontend Repository:** https://github.com/sonlexuan3000/gorum-frontend
- **Backend Repository:** https://github.com/sonlexuan3000/gorum-backend

---

## Features

The web forum is fully functional, equipped with essential features:

- **User Management:** User registration, authentication, and profile customization
- **Topics & Posts:** Organized discussion topics with rich post creation
- **Nested Comments:** Threaded comment system with reply support
- **Voting System:** Upvote/downvote posts with toggle functionality
- **Notifications:** Real-time notifications for votes, comments, and replies
- **Search & Sort:** Search posts by content, sort by recent or votes
- **User Profiles:** Activity history, statistics, and customizable avatars
- **Responsive Design:** Optimized for both desktop and mobile devices

---

## Technology Stack

**Backend:**
- Go 1.25.0 with Gin framework
- PostgreSQL database
- GORM for database operations
- JWT authentication
- bcrypt password hashing

**Frontend:**
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Zustand for state management
- Axios for API communication
- React Router for navigation

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

---

## Installation

### Backend Setup

Clone the repository:
```bash
git clone https://github.com/sonlexuan3000/gorum-backend.git
cd gorum-backend
```

Download the dependencies:
```bash
go mod download
```

Build the project:
```bash
go build -o bin/server cmd/server/main.go
```

Run the project:
```bash
./bin/server
```

### Frontend Setup

Clone the repository:
```bash
git clone https://github.com/sonlexuan3000/gorum-frontend.git
cd gorum-frontend
```

Install the dependencies:
```bash
npm install
```

Build the project:
```bash
npm run build
```

Run the project:
```bash
npm run dev
```

---

## Configuration

### Backend Configuration

Create a `.env` file in the backend root directory:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=forum_db
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

**Note:** You must configure database credentials and JWT secret. In cmd/server/main.go, you can modify the allow origins to match your frontend URL. (e.g. http://localhost:5173).

### Frontend Configuration

Create a `.env` file in the frontend root directory:
```env
VITE_API_URL=http://localhost:8080
```

For production deployment, update to your backend URL:
```env
VITE_API_URL=https://gorum-backend.onrender.com
```

---

## Usage

### Running Locally

**Backend:**

Before running the application, set up the database. Create a PostgreSQL database:
```bash
createdb forum_db
```

Run database migrations (automatic on first start):
```bash
./bin/server
```


Run the backend server:
```bash
go run cmd/server/main.go
```

The backend will be available at `http://localhost:8080`

**Frontend:**

Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

Or build for production:
```bash
npm run build
```

---


## API Documentation

The backend provides the following main endpoints:

**Authentication:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

**Topics:**
- `GET /api/topics` - List all topics
- `POST /api/topics` - Create topic (auth required)
- `PUT /api/topics/:id` - Update topic (auth required)
- `DELETE /api/topics/:id` - Delete topic (auth required)

**Posts:**
- `GET /api/topics/:id/posts` - Get posts by topic
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/vote` - Vote on post (auth required)
- `DELETE /api/posts/:id/vote` - Remove vote (auth required)

**Comments:**
- `GET /api/posts/:id/comments` - Get comments for post
- `POST /api/comments` - Create comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

**Users:**
- `GET /api/users/me` - Get current user (auth required)
- `PUT /api/users/me` - Update profile (auth required)
- `GET /api/users/:identifier` - Get user profile
- `GET /api/users/:identifier/posts` - Get user's posts
- `GET /api/users/:identifier/comments` - Get user's comments

**Notifications:**
- `GET /api/notifications` - Get notifications (auth required)
- `GET /api/notifications/unread-count` - Get unread count (auth required)
- `PUT /api/notifications/:id/read` - Mark as read (auth required)
- `PUT /api/notifications/mark-all-read` - Mark all as read (auth required)

---

## Project Structure

**Backend:**
```
gorum-backend/
├── cmd/
│   └── server/main.go      # Main application entry
├── internal/
│   ├── config/             # Configuration management
│   ├── database/           # Database connection & migrations
│   ├── handlers/           # HTTP request handlers
│   ├── middleware/         # Authentication & CORS
│   ├── models/             # Data models
│   ├── repository/         # Database operations
│   └── routes/             # Route definitions
└── go.mod
```

**Frontend:**
```
gorum-frontend/
├── src/
│   ├── api/                # API client functions
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── store/              # State management
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
└── package.json
```

---
**Developed by [Le Xuan Son]**
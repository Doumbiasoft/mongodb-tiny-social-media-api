# 📱 Tiny Social Media + MongoDB RESTFull API

## 🚀 Overview

A RESTful API for a social media platform built with Express.js, TypeScript, and MongoDB. The API provides endpoints for managing users, posts, and comments, along with the api OpenAPI doc display.

### The API is live on:

📚 **API Docs:**

- **Scalar UI:** ⚡️ https://mongodb-tiny-social-media-api.onrender.com/docs
- **Swagger UI:** ⚡️ https://mongodb-tiny-social-media-api.onrender.com/swagger

## ✨ Features

- **🔗 RESTful API**: Full CRUD operations for users, posts, and comments
- **📚 Auto Documentation**: (Scalar/Swagger)/OpenAPI documentation generation
- **🛡️ Type Safety**: Built with TypeScript
- **✅ Validation**: Request validation with detailed error messages

## 🚀 Quick Start

### 📦 Installation

```bash
npm install
```

### ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost
MONGO_URI=mongodb-url
```

**Note**: The application will use default values if no `.env` file is provided.

### ⚡️ Project Quick start

```bash
# this will compile the TypeScript and start the project at once
npm run serve
```

### OR

### 🔧 Development

```bash
npm run dev
```

### 🏗️ Build

```bash
npm run build
```

### 🚀 Production

```bash
npm start
```

## 🌐 Base URL

```
local:
http://localhost:PORT/api

live(production):
https://mongodb-tiny-social-media-api.onrender.com/api
```

## 🔗 API Endpoints

### 👥 Users (`/api/v1/users`)

#### GET `/api/v1/users`

- **Description**: Retrieve all users
- **Response**: Collection of user objects
- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "68ccb2dbee449447c92bee87",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    }
  ]
}
```

#### GET `/api/v1/users/:id`

- **Description**: Retrieve a specific user by ID
- **Parameters**:
  - `id` (string): User ID
- **Response**: User object or 404 if not found

#### GET `/api/v1/users/:id/posts`

- **Description**: Retrieve all posts created by a specific user
- **Parameters**:
  - `id` (string): User ID
- **Response**: Collection of posts created by the user

#### GET `/api/v1/users/:id/comments`

- **Description**: Retrieve all comments made by a specific user
- **Parameters**:
  - `id` (string): User ID
- **Response**: Collection of comments made by the user

#### GET `/api/v1/users/:id/comments?postId={postId}`

- **Description**: Retrieve comments by a specific user filtered by post
- **Parameters**:
  - `id` (string): User ID
- **Query Parameters**:
  - `postId` (string, required): Filter comments by specific post ID
- **Response**: Collection of comments made by the user on the specified post

#### POST `/api/v1/users`

- **Description**: Create a new user
- **Request Body**:

```json
{
  "name": "string (required, 3-50 chars)",
  "username": "string (required, 3-50 chars, unique)",
  "email": "string (required, valid email format)"
}
```

- **Response**: Created user object with generated ID

#### PATCH `/api/v1/users/:id`

- **Description**: Update an existing user
- **Parameters**:
  - `id` (string): User ID
- **Request Body**:

```json
{
  "id": "string (required, must match URL parameter)",
  "name": "string (optional)",
  "username": "string (optional)",
  "email": "string (optional)"
}
```

- **Response**: Updated user object

#### DELETE `/api/v1/users/:id`

- **Description**: Delete a user
- **Parameters**:
  - `id` (string): User ID
- **Response**: Return the deleted user

### 📝 Posts (`/api/v1/posts`)

#### GET `/api/v1/posts`

- **Description**: Retrieve all posts with user information
- **Response**: Collection of post objects

#### GET `/api/v1/posts?userId={userId}`

- **Description**: Retrieve posts filtered by specific user
- **Query Parameters**:
  - `userId` (string, required): Filter posts by specific user ID
- **Response**: Collection of post objects for the specified user
- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "68ccb2dbee449447c92bee93",
      "userId": "68ccb2dbee449447c92bee87",
      "title": "My First Post",
      "content": "This is the content of my post"
    }
  ]
}
```

#### GET `/api/v1/posts/:id`

- **Description**: Retrieve a specific post by ID
- **Parameters**:
  - `id` (string): Post ID
- **Response**: Post object

#### GET `/api/v1/posts/:id/comments`

- **Description**: Retrieve all comments for a specific post
- **Parameters**:
  - `id` (string): Post ID
- **Response**: Collection of comments for the post

#### GET `/api/v1/posts/:id/comments?userId={userId}`

- **Description**: Retrieve comments for a specific post filtered by user
- **Parameters**:
  - `id` (string): Post ID
- **Query Parameters**:
  - `userId` (string, required): Filter comments by specific user ID
- **Response**: Collection of comments for the post from the specified user

#### POST `/api/v1/posts`

- **Description**: Create a new post
- **Request Body**:

```json
{
  "userId": "string (required)",
  "title": "string (required)",
  "content": "string (required)"
}
```

- **Response**: Created post object

#### PATCH `/api/v1/posts/:id`

- **Description**: Update an existing post
- **Parameters**:
  - `id` (string): Post ID
- **Request Body**:

```json
{
  "id": "string (required, must match URL parameter)",
  "title": "string (optional)",
  "content": "string (optional)"
}
```

- **Response**: Updated post object

#### DELETE `/api/v1/posts/:id`

- **Description**: Delete a post
- **Parameters**:
  - `id` (string): Post ID
- **Response**: Success confirmation

### 💬 Comments (`/api/v1/comments`)

#### GET `/api/v1/comments`

- **Description**: Retrieve all comments with user and post information
- **Response**: Collection of comment objects with embedded user and post data

#### GET `/api/v1/comments?userId={userId}`

- **Description**: Retrieve comments filtered by specific user
- **Query Parameters**:
  - `userId` (string, required): Filter comments by specific user ID
- **Response**: Collection of comments made by the specified user

#### GET `/api/v1/comments?postId={postId}`

- **Description**: Retrieve comments filtered by specific post
- **Query Parameters**:
  - `postId` (string, required): Filter comments by specific post ID
- **Response**: Collection of comments for the specified post

#### GET `/api/v1/comments?userId={userId}&postId={postId}`

- **Description**: Retrieve comments filtered by both user and post
- **Query Parameters**:
  - `userId` (string, required): Filter comments by specific user ID
  - `postId` (string, required): Filter comments by specific post ID
- **Response**: Array of comments made by the specified user on the specified post
- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "68ccb2dbee449447c92beea3",
      "userId": "68ccb2dbee449447c92bee86",
      "postId": "68ccb2dbee449447c92bee90",
      "body": "This is a great post!"
    }
  ]
}
```

#### GET `/api/v1/comments/:id`

- **Description**: Retrieve a specific comment by ID
- **Parameters**:
  - `id` (string): Comment ID
- **Response**: Comment object with user and post information

#### POST `/api/v1/comments`

- **Description**: Create a new comment
- **Request Body**:

```json
{
  "userId": "string (required)",
  "postId": "string (required)",
  "body": "string (required)"
}
```

- **Response**: Created comment object

#### PATCH `/api/v1/comments/:id`

- **Description**: Update an existing comment
- **Parameters**:
  - `id` (string): Comment ID
- **Request Body**:

```json
{
  "id": "string (required, must match URL parameter)",
  "body": "string (required)"
}
```

- **Response**: Updated comment object

#### DELETE `/api/v1/comments/:id`

- **Description**: Delete a comment
- **Parameters**:
  - `id` (string): Comment ID
- **Response**: The deleted comment

## 📖 Documentation

### 📚 API Documentation

- **Swagger UI**: Available at baseURl + `/swagger`
- **Scalar UI**: Available at baseURl + `/docs`
- **OpenAPI Spec**: Available at baseURl + `/api-docs`

### ⚡ Features

- **🤖 Automatic Documentation**: Generated from controller decorators
- **🧪 Interactive Testing**: Test endpoints directly from the documentation
- **✅ Schema Validation**: Request/response validation with detailed error messages
- **📝 Logging**: Request logging with Morgan middleware
- **🚨 Error Handling**: Global error handler with consistent response format

## 🛠️ Technology Stack

- **⚙️ Backend**: Express.js with TypeScript
- **📖 Documentation**: @reflet/express for automatic OpenAPI generation
- **✅ Validation**: Custom validation middleware
- **🔧 Development**: tsx for development server

## 📤 Response Format

All API responses follow a consistent format:

### ✅ Success Response:

```json
{
  "success": true,
  "data": "...",
  "message": "Optional success message"
}
```

### ❌ Error Response:

```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

## ✅ Validation

- **🔍 Request Body Validation**: Automatic validation with detailed error messages
- **🔧 Type Checking**: Ensures correct data types for all fields
- **📋 Required Fields**: Enforces required field validation
- **🚨 Error Responses**: Returns 400 status with validation details

## 📂 Project Structure

```
mongodb-tiny-social-media-api/
├── package.json              # Dependencies and scripts
├── README.md                # Project documentation
├── tsconfig.json            # TypeScript configuration
└── src/
    ├── app.ts               # Express app configuration
    ├── server.ts           # Server entry point
    ├── controllers/        # Route controllers
    │   └── v1/            # API version 1 controllers
    │       ├── comment.controller.ts    # Comment CRUD operations
    │       ├── post.controller.ts       # Post CRUD operations
    │       ├── user.controller.ts       # User CRUD operations
    │       └── views.controller.ts      # Web view controllers
    ├── middlewares/        # Custom middleware
    │   ├── endpointMetadata.middleware.ts   # OpenAPI metadata
    │   ├── globalErrorHandler.middleware.ts # Error handling
    │   ├── logging.middleware.ts            # Request logging
    │   └── validation.middleware.ts         # Request validation
    ├── routes/            # Route registration
    │   ├── index.ts       # Main route registry
    │   └── v1/
    │       └── index.ts   # V1 route configuration
    ├── services/          # Business logic layer
    │   ├── comment.service.ts   # Comment business logic
    │   ├── post.service.ts      # Post business logic
    │   └── user.service.ts      # User business logic
    ├── types/             # TypeScript type definitions
    │   ├── apiResponseInterface.ts  # API response types
    │   └── httpStatus.ts           # HTTP status codes
    ├── utils/             # Utility functions
    │   ├── apiResponseFormat.ts    # Response formatting
    │   ├── AppError.ts            # Custom error class
    │   ├── logger.ts              # Winston logger setup
    │   └── openAPIDocsGenerator.ts # Auto API docs generation
    ├── config/            # Configuration files
    │   ├── apiPrefix.ts   # API route prefixes
    │   └── env.ts         # Environment variables
    └── data/              # Database (MongoDB connection)
        ├── seed/          # database seed
        │   ├── user.json  # user seed
        │   ├── post.json    # post seed
        │   ├── comment.json    # comment seed
        │   └── seed-script.ts   # script for seeding the database
        └── database-connection.ts/        # mongodb db connection

```

### Key Configuration Features:

- **🎯 Target**: ES2020 for modern JavaScript features
- **📦 Module**: CommonJS for Node.js compatibility
- **📁 Directories**: Source in `src/`, output in `dist/`
- **🔒 Strict Mode**: Full TypeScript strict checking enabled
- **🎭 Decorators**: Experimental decorators for @reflet/express
- **📋 Includes**: Only compiles files in `src/` directory

## 🤔 Project Reflection

### What would you add to or change about your application if given more time?

Given more time, I would enhance the application with:

1. **Authentication & Authorization**:

   - JWT-based authentication system
   - Role-based access control (admin, user, moderator)
   - Protected routes with middleware

2. **Enhanced Features**:
   - Like/unlike functionality for posts and comments with optimistic UI updates
   - Real-time notifications using WebSockets
   - File upload support for user avatars and post images
   - Search functionality across posts and users
   - Pagination for large datasets

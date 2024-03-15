# Blog App

Welcome to the Blog App! This is a Node.js/Express.js application with Prisma ORM for managing blogs, user authentication, and comment functionalities.

## Features

**User Authentication:** Users can sign up, log in, and log out securely.

**Blog management:** Users can create, read, update, and delete their blog posts.

**Cover image upload:** Users can upload cover images for their blog posts.

**Comment system:** Users can comment on blog posts.

**Pagination:** Blogs and comments are paginated for better user experience.

## Tech Stack

**Node.js**

**Express.js**

**Prisma ORM**

**MongoDB**

**Multer for file upload**

**Cloudinary for cloud storage**

**JSON Web Tokens (JWT) for authentication**

**bcrypt for password hashing**

## Getting Started

Clone this repository:

```bash
  git clone https://github.com/PrabeshDangi/Blog-App
```

Install dependencies:

```bash
  cd Blog-App
  npm install
```

Set up environment variables:

```bash
Create a .env file in the root directory.
Define environment variables such as PORT, DB_URL, JWT_SECRET, etc.
```

Run the application:

```bash
npm start
```

Access the application in your browser at http://localhost:<PORT>

## API Reference

**User Authentication:**

POST /api/auth/register: Register a new user.

POST /api/auth/login: Log in with existing credentials.

POST /api/auth/logout: Log out the current user.

**Blog Management:**

GET /api/blogs: Get all blogs.

GET /api/blogs/:id: Get a specific blog by ID.

POST /api/blogs: Create a new blog.

PUT /api/blogs/:id: Update an existing blog.

DELETE /api/blogs/:id: Delete a blog by ID.

**Comment System:**

GET /api/blogs/:blogId/comments: Get all comments for a blog.

POST /api/blogs/:blogId/comments: Add a new comment to a blog.

DELETE /api/comments/:id: Delete a comment by ID.

## Contributing

Contributions are always welcome!

If you have any suggestions, feature requests, or bug reports, please open an issue or submit a pull request.

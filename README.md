# WTWR (What to Wear?) — Back End (Express + MongoDB)

WTWR (“What to Wear?”) is a weather-based wardrobe application.  
This repository contains the **backend server** for WTWR, built using **Node.js, Express, and MongoDB**.

The server provides a RESTful API for managing **users**, **clothing items**, and **likes**, with proper validation, error handling, and database persistence.

This project was completed as **Sprint 13: Authentication & Authorization** in the TripleTen Software Engineering program.

---

## Overview & Functionality

At this stage, the backend focuses on building the foundation for a full-stack WTWR application by implementing:

- An Express server with a modular project structure
- A MongoDB database connection using Mongoose
- Like / unlike functionality for clothing items
- Centralized error handling with proper HTTP status codes
- JWT-based authentication and authorization middleware to protect routes

---

## Features

- User registration (`POST /signup`) with hashed passwords using bcrypt
- User login (`POST /signin`) with JWT token generation (7-day expiration)
- Protected routes using authentication middleware
- Retrieve and update current user (`GET /users/me`, `PATCH /users/me`)
- Create, fetch, and delete clothing items
- Like and unlike clothing items
- Authorization rules (users can only delete their own items)
- MongoDB schema validation
- URL validation using the `validator` package
- Centralized error handling with consistent JSON responses

---

## Technologies & Tools

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **ESLint (Airbnb Base config)**
- **Prettier**
- **validator** (URL validation)
- **nodemon** (hot reload)
- **Postman** (API testing)
- **bcryptjs** (password hashing)
- **jsonwebtoken (JWT)** (authentication tokens)
- **cors** (Cross-Origin Resource Sharing)

---

## Project Structure

```
se_project_express/
├── controllers/        # Route handler logic
├── routes/             # API route definitions
├── models/             # Mongoose schemas and models
├── middlewares/        # Authentication middleware
├── utils/              # Config and error codes
├── app.js              # Application entry point
├── package.json
├── .eslintrc.js
├── .editorconfig
├── .gitignore
├── README.md
```

---

## Database

When the server starts, it connects to the MongoDB database:

```
mongodb://localhost:127.0.0.1:27017/wtwr_db
```

---

## API Endpoints

### Authentication

- `POST /signup`  
  Registers a new user. Passwords are hashed before storage.

- `POST /signin`  
  Authenticates a user and returns a JWT token.

---

### Users

- `GET /users/me`  
  Returns the currently authenticated user.

- `PATCH /users/me`  
  Updates the current user's `name` and `avatar`.

---

### Clothing Items

- `GET /items`  
  Returns all clothing items.

- `POST /items`  
  Creates a new clothing item.  
  The owner field is automatically set using `req.user._id`.

**Request Body:**

```json
{
  "name": "Winter Jacket",
  "imageUrl": "https://example.com/jacket.png",
  "weather": "cold"
}
```

- `DELETE /items/:id`  
  Deletes a clothing item by `_id`.

---

### Likes

- `PUT /items/:id/likes` — Like a clothing item
- `DELETE /items/:id/likes` — Unlike a clothing item

---

## Error Handling

All error responses are returned in JSON format:

```json
{
  "message": "Error description"
}
```

Supported status codes:

- **400** — invalid data or invalid ID (validation errors / CastError)
- **401** — unauthorized (invalid or missing token)
- **403** — forbidden (attempting to modify another user's item)
- **404** — resource not found
- **409** — conflict (duplicate email registration)
- **500** — server error

Error codes are centralized in the `utils/` folder.

---

## Project Demo Video

**[📽️ Loom Demo:](https://www.loom.com/share/171e7b8948bd418d91ef294ad8a723ae)**
where I describe my project and some challenges I faced while building it.

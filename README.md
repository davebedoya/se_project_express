# WTWR (What to Wear?) — Back End (Express + MongoDB)

WTWR (“What to Wear?”) is a weather-based wardrobe application.  
This repository contains the **backend server** for WTWR, built using **Node.js, Express, and MongoDB**.

The server provides a RESTful API for managing **users**, **clothing items**, and **likes**, with proper validation, error handling, and database persistence.

This project was completed as **Sprint 12: Introduction to Back End** in the TripleTen Software Engineering program.

---

## Overview & Functionality

At this stage, the backend focuses on building the foundation for a full-stack WTWR application by implementing:

- An Express server with a modular project structure
- A MongoDB database connection using Mongoose
- REST API routes for users and clothing items
- Like / unlike functionality for clothing items
- Centralized error handling with proper HTTP status codes
- Temporary authorization middleware to simulate an authenticated user

---

## Features

- Create and fetch users
- Create, fetch, and delete clothing items
- Like and unlike clothing items
- MongoDB schemas with validation rules
- URL validation using the `validator` package
- Consistent JSON responses
- Robust error handling for invalid data, IDs, and missing resources

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

---

## Project Structure

```
se_project_express/
├── controllers/        # Route handler logic
├── routes/             # API route definitions
├── models/             # Mongoose schemas and models
├── utils/              # Error codes and constants
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
mongodb://127.0.0.1:27017/wtwr_db
```

---

## API Endpoints

### Users

- `GET /users`  
  Returns all users.

- `GET /users/:userId`  
  Returns a user by `_id`.

- `POST /users`  
  Creates a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.png"
}
```

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

- `PUT /items/:id`  
  Updates a clothing item by `_id`.

- `DELETE /items/:id`  
  Deletes a clothing item by `_id`.

---

### Likes

- `PUT /items/:id/likes`  
  Likes a clothing item.

- `DELETE /items/:id/likes`  
  Unlikes a clothing item.

MongoDB operators used:

- `$addToSet` — prevents duplicate likes
- `$pull` — removes a like

---

## Error Handling

All error responses are returned in JSON format:

```json
{
  "message": "Error description"
}
```

Supported status codes:

- **400** — invalid data or invalid ID (CastError / validation errors)
- **404** — user or item not found
- **500** — server error (non-existent route or server error): `"An error has occurred on the server."`

Error codes are centralized in the `utils/` folder.

---

## Running the Project

### Install dependencies

```bash
npm install
```

### Start MongoDB

Make sure MongoDB is running locally before starting the server.

### Run the server

```bash
npm run start
```

### Run with hot reload

```bash
npm run dev
```

### Run ESLint

```bash
npm run lint
```

---

## Testing

This project is tested using **Postman** and **GitHub Actions**.

Before committing your code, update the `sprint.txt` file in the root directory with the sprint number:

```txt
12
```

---

## Screenshots & Demo (Recommended)

Add screenshots or GIFs showing:

- Postman requests for users and items
- Successful like/unlike actions
- MongoDB Compass collections (`users`, `clothingitems`)

Example:

```md
![Postman Users](./images/postman-users.png)
![Postman Items](./images/postman-items.png)
```

---

## Project Demo Video

📽️ Loom Demo: **(add your Loom link here)**

Suggested video flow:

- Start server with `npm run dev`
- Show Postman requests (users, items, likes)
- Show MongoDB Compass updates
- Brief explanation of project structure

---

## GitHub Repository

[Backend Repo](https://github.com/davebedoya/se_project_express)

---

## Disclaimer

This backend uses a **temporary authorization middleware** with a hardcoded user ID.  
User authentication and authorization will be implemented in future sprints.

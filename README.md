
# Programmer Planner

The Programmer Planner is a personal project management tool designed to help developers track ongoing projects efficiently. This application allows you to rename, delete, update, and monitor functions and tasks across multiple projects, providing a clear view of progress. It also logs the programming language used, the purpose of each project, and the most recent updates, making it invaluable for managing multiple projects simultaneously.

## Features
- **Project Tracking:** Manage multiple projects with ease, tracking details like programming language, update dates, and project goals.
- **CRUD Operations:** Rename, delete, and update project functions and view progress at a glance.
- **Secure Access:** Protected by JSON Web Tokens (JWT) for secure, authenticated access.
- **Persistent Storage:** Utilizes MongoDB Atlas for reliable data storage and easy retrieval.

## Technologies Used
- **Node.js** and **Express** for the backend server
- **MongoDB Atlas** as a cloud-based NoSQL database
- **JWT** for secure authentication and access control

## Installation

1. Clone the repository and navigate to the project folder:
    ```bash
    git clone <repository-url>
    cd programmer-planner
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```plaintext
     MONGODB_URI=<your_mongodb_atlas_connection_string>
     JWT_SECRET=<your_jwt_secret_key>
     ```

## Running the Application

Start the server with:
```bash
npm start
```

For development with automatic restarts on file changes, use:
```bash
npm run dev
```

The app will be accessible on `http://localhost:3000`.

## Usage

1. **Add New Projects**: Create a new project with details like programming language, aim, and any initial notes.
2. **Update and Track Progress**: Modify project information, mark tasks as complete, and view progress.
3. **Secure Access**: Each session is authenticated using JWT, ensuring that only authorized users can access project information.
4. **Storage and Retrieval**: All data is securely stored in MongoDB Atlas, allowing easy access to project history and current progress.

## Project Structure

- **app.js**: Main server file, setting up Express app and middleware.
- **routes/**: Contains routes for project CRUD operations and authentication.
- **config/**: Database configuration and connection logic.
- **public/**: Static files for client-side scripts and styles, if applicable.
- **views/**: HTML templates (if using server-side rendering).

## API Endpoints

### `POST /login`
- Authenticates the user and issues a JWT for secure access.

### `GET /projects`
- Retrieves all projects for the authenticated user.

### `POST /projects`
- Adds a new project.
- Request body example:
  ```json
  {
    "name": "Project Name",
    "language": "JavaScript",
    "aim": "Project aim or goal",
    "status": "In Progress"
  }
  ```

### `PUT /projects/:id`
- Updates the details of a specific project.

### `DELETE /projects/:id`
- Deletes a specific project.

## Learnings and Objectives

This project demonstrates:
- Managing multiple development projects with real-time tracking.
- Secure user authentication and authorization using JWT.
- Persistent and scalable data storage with MongoDB Atlas.
- CRUD operations with Express, providing a backend API for project management.

## License
This project is open-source and available under the MIT License.

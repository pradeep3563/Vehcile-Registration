# Vehicle Registration System

This is a MERN stack (MongoDB, Express, React, Node.js) application for vehicle registration and management.

## Prerequisites

Before running this project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud URI)

## Project Structure

-   `client/`: React frontend application (Vite).
-   `server/`: Node.js/Express backend application.

## Installation & Setup

### 1. Clone/Download the Repository
If you haven't already, navigate to the project root directory.

### 2. Setup Backend (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    -   The project comes with a `.env` file in the `server` directory.
    -   Ensure `MONGO_URI` points to your MongoDB instance.
    -   Default `.env` content:
        ```env
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/vehicle_registration
        JWT_SECRET=your_super_secret_key_change_this
        ```

4.  Start the Server:
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

### 3. Setup Frontend (Client)

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Client:
    ```bash
    npm run dev
    ```
    The application will typically run on `http://localhost:5173`.

## Admin Configuration

### Admin Registration
To register the **first** admin account, you can simply register via the UI with the role "admin".

If admins already exist, you need a secret key to register a new admin (defined in code as `admin123` or via `ADMIN_SECRET` env var).

### Resetting Admin Password
If you need to manually reset an admin password, a utility script is provided.

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Run the update script:
    ```bash
    node scripts/updateAdminPassword.js <email> <new_password>
    ```
    **Example:**
    ```bash
    node scripts/updateAdminPassword.js admin@example.com MyNewPass123
    ```

## Running the Full App

1.  Ensure MongoDB is running.
2.  Terminal 1: `cd server` -> `npm run dev`
3.  Terminal 2: `cd client` -> `npm run dev`
4.  Open browser to `http://localhost:5173`

## Features

-   User Registration & Login
-   Vehicle Registration
-   Admin Dashboard
-   Approve/Reject Applications
-   PDF Report Generation

Running Link  

## 🔗 Live Demo
👉 https://pradeep3563.github.io/Vehcile-Registration/

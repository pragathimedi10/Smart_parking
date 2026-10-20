# AI powered Full Stack Smart Parking Management System 🚗

A full-stack web application for managing parking slots, tracking parking activity, and answering parking-related questions using an AI assistant.

## ✨ Features

* **Parking Slot Management:** View available and occupied parking slots.
* **Reserve & Release:** Reserve available slots and release them when finished.
* **Parking History:** Track parking-related activity.
* **AI Assistant:** Ask parking-related questions using a Google Gemini-powered chatbot.
* **Database Integration:** Store parking slot statuses and activity history in MySQL.
* **Responsive UI:** Use the dashboard on different screen sizes.
* **Dark Mode:** Switch between light and dark themes.

## 🛠️ Tech Stack

| Category         | Technologies          |
| ---------------- | --------------------- |
| Frontend         | HTML, CSS, JavaScript |
| Backend          | Node.js, Express.js   |
| Database         | MySQL                 |
| AI Integration   | Google Gemini API     |
| Backend Hosting  | Render                |
| Frontend Hosting | Netlify               |
| Database Hosting | Aiven                 |
| Version Control  | Git, GitHub           |

## 🏗️ Architecture

* **Frontend:** Displays parking slots and communicates with the backend through API requests.
* **Backend:** Handles parking operations and processes API requests using Express.js.
* **Database:** MySQL stores parking slot information and activity history.
* **AI Assistant:** Uses the Gemini API to answer questions using available parking data.

## 🚀 Run Locally

### Prerequisites

* Node.js and npm
* MySQL
* A Google Gemini API key for the AI assistant

### 1. Clone the repository

```bash
git clone https://github.com/pragathimedi10/Smart_parking
cd Smart_parking
```

Replace the placeholders with your actual GitHub repository URL and project folder name.

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend folder.

Add your own database credentials and Gemini API key using the variable names expected by your backend code.

**Never commit your `.env` file or expose your API keys.**

### 4. Set up the database

Create the required MySQL database and tables. Use the schema or SQL setup script included in the repository, if available.

### 5. Start the backend

```bash
node server.js
```

### 6. Open the frontend

Open the frontend's `index.html` file in your browser, or use a local development server if your project requires one.

Ensure the frontend API base URL points to your local backend.

## 🌐 Live Demo

https://smartparkingprojectpragathi.netlify.app/

## 📌 Future Improvements

* User authentication and role-based access
* Parking usage analytics
* Improved parking search and filtering

## 👨‍💻 Author

Developed as a full-stack project to practice frontend development, REST APIs, database integration, deployment, and AI integration.

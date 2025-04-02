# MERN Stack Chat Application

A real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to send and receive messages in real-time.

## 🚀 Features

- **Real-Time Messaging**: Users can send and receive messages instantly using WebSocket (Socket.io).
- **User Authentication**: Secure user login and registration with JWT authentication.
- **User Management**: Users can view and manage their profiles, including updating profile pictures.
- **Group Chats**: Users can create group chats and add participants.
- **Typing Indicators**: Real-time typing status updates for active conversations.
- **Message Notifications**: Instant notifications for new messages.
- **Responsive Design**: User-friendly interface optimized for both desktop and mobile devices.

## 🛠 Technologies Used

- **MongoDB**: NoSQL database for storing user data and chat messages.
- **Express.js**: Backend framework for building RESTful APIs.
- **React**: Frontend library for building the user interface.
- **Node.js**: JavaScript runtime for server-side operations.
- **Socket.io**: Real-time communication library for handling chat messages.
- **JWT (JSON Web Tokens)**: Secure authentication mechanism.

## 📌 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud instance)
- npm or yarn

### 🔧 Installation & Setup

#### 1. **Clone the Repository**

```bash
git clone https://github.com/maker-dev/chat-application.git
cd chat-application
```

#### 2. **Backend Setup**

```bash
cd server
npm install

# Create a .env file and configure the environment variables
cp .env.example .env

# Start the server
npm run dev
```

#### 3. **Frontend Setup**

```bash
cd client
npm install

# Start the React app
npm start
```

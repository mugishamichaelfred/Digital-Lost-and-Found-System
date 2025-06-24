# Digital Lost and Found System

A full-stack web application for managing lost and found items, built with React, Node.js, and MongoDB.

## Features

- User authentication and authorization
- Admin dashboard for managing users and items
- User dashboard for reporting lost and found items
- Contact messaging system
- Image upload for items
- Search and filter functionality
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

## Installation

### Clone the repository
```bash
git clone https://github.com/kubwimanav/final-project/
cd final-project
git checkout development
```

###  Setup

1. Install dependencies:
```bash
npm run install-all
```
2. start application:
```bash
npm run dev
```

## Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## Project Structure

```
final-project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── index.js
│   │   └── swagger.json
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── AdminDashboard/
    │   ├── UserDashboard/
    │   ├── Context/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

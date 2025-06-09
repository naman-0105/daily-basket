# Daily Basket - Full Stack MERN E-commerce Application

A full-stack e-commerce application built with MERN stack (MongoDB, Express, React, Node.js) for groceries and daily essentials shopping.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Order management
- Address management
- Email notifications
- Responsive design with Tailwind CSS

## Project Structure

```
daily-basket/
├── client/              # Frontend React application
│   ├── src/
│   ├── public/
│   └── package.json
└── server/             # Backend Node.js/Express application
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd daily-basket
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Create `.env` files in both client and server directories with required environment variables.

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## Technologies Used

- **Frontend:**
  - React.js
  - Tailwind CSS
  - Vite
  - React Router DOM

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
# E-commerce Application

A modern full-stack e-commerce application built with React and Node.js, featuring a responsive UI, secure authentication, and comprehensive admin management capabilities.

## Features

### Customer Features

- Browse products with category filtering
- Image gallery for product viewing
- Shopping cart management
- Order placement and tracking
- User authentication and profile management
- Responsive design for mobile and desktop

### Admin Features

- Product management (CRUD operations)
- Category management
- Order management with status updates
- Image upload and management
- Admin dashboard with analytics

## Technology Stack

### Frontend

- React 19 with Vite for fast development
- Chakra UI for modern, accessible components
- React Router DOM for navigation
- Axios for API requests
- React Image Gallery for product images
- Swiper for carousels
- Editor.js for rich text editing
- Context API for state management

### Backend

- Node.js with Express
- Prisma ORM for database operations
- JSON Web Token (JWT) for authentication
- Multer for file uploads
- CORS for cross-origin resource sharing
- Input validation and sanitization

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Environment Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd e-commerce-app
```

2. Frontend setup:

```bash
cd frontend
cp .env.example .env # Configure your environment variables
npm install
```

3. Backend setup:

```bash
cd server
cp .env.example .env # Configure your environment variables
npm install
```

4. Database setup:

```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

## Running the Application

### Development Mode

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Mode

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Start the production server:

```bash
cd server
npm start
```

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context providers
│   │   ├── services/    # API service layers
│   │   └── hooks/       # Custom React hooks
│   └── public/          # Static assets
│
├── server/           # Node.js backend application
│   ├── prisma/        # Database schema and migrations
│   ├── routes/        # API route handlers
│   ├── middleware/    # Custom middleware
│   └── storage/       # File upload directory
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

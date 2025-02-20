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
└── server/           # Express backend server
    ├── routes/        # API route handlers
    ├── middleware/    # Custom middleware
    └── prisma/        # Database schema and migrations
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository

2. Frontend setup:
```bash
cd frontend
npm install
cp .env.example .env  # Configure environment variables
```

3. Backend setup:
```bash
cd server
npm install
cp .env.example .env  # Configure environment variables
```

4. Configure environment variables:
   - Frontend `.env`:
     ```
     VITE_API_URL=http://localhost:3000
     VITE_STORAGE_URL=http://localhost:3000/uploads/
     ```
   - Backend `.env`:
     ```
     PORT=3000
     DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
     JWT_SECRET=your_jwt_secret
     ```

5. Initialize the database:
```bash
cd server
npm run prisma:migrate  # Run database migrations
npm run prisma:seed     # Seed initial data
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev  # Runs on http://localhost:3000
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev  # Runs on http://localhost:5173
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with initial data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# E-commerce Application

A modern full-stack e-commerce application built with React and Node.js.

## Features

- Product catalog with categories
- Image gallery for product viewing
- User authentication
- File upload functionality
- RESTful API backend
- Database integration with Prisma

## Technology Stack

### Frontend
- React 19
- Vite
- Chakra UI
- React Router DOM
- Axios
- React Image Gallery
- Swiper
- Editor.js

### Backend
- Node.js
- Express
- Prisma ORM
- JSON Web Token (JWT)
- Multer for file uploads
- CORS

## Project Structure

```
├── frontend/     # React frontend application
└── server/       # Express backend server
```

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- A running database instance

### Installation

1. Clone the repository

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Set up environment variables:
- Create `.env` file in the server directory
- Configure your database connection and other environment variables

5. Initialize the database:
```bash
cd server
npm run prisma:migrate
npm run prisma:seed
```

### Running the Application

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
- `npm run prisma:seed` - Seed the database
- `npm run prisma:studio` - Open Prisma Studio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
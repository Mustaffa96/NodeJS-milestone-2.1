# Express REST API

A basic REST API built with Express.js featuring CRUD operations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Documentation

The API is documented using Swagger UI. After starting the server, visit:
```
http://localhost:3000/api-docs
```

This provides an interactive interface where you can:
- View all available endpoints
- Test API endpoints directly
- See request/response schemas
- Try out API calls with your own data

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a single item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item by ID
- `DELETE /api/items/:id` - Delete an item by ID

## Features

- CRUD operations
- Input validation
- Error handling
- Security headers with Helmet
- CORS enabled
- Response compression
- Clean and efficient code structure
- Interactive API documentation with Swagger UI

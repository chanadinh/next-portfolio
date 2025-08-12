# Contact Form MongoDB Setup

This guide explains how to set up the contact form to send messages to MongoDB.

## Prerequisites

1. MongoDB installed and running locally, or a MongoDB Atlas account
2. Node.js and npm installed

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in your project root with the following content:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/portfolio-chat

# If using MongoDB Atlas, use this format instead:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-chat
```

### 2. MongoDB Database

The contact form will automatically create a `contacts` collection in your database when the first message is sent.

### 3. API Endpoints

- **POST** `/api/contact` - Submit a contact form message
- **GET** `/api/contact` - Retrieve all contact messages (for admin purposes)

### 4. Testing the Contact Form

1. Start the development server: `npm run dev`
2. Navigate to the contact section of your portfolio
3. Fill out and submit the contact form
4. Check your MongoDB database for the new contact message

## Database Schema

The Contact model includes:
- `name` (required): Sender's name
- `email` (required): Sender's email address
- `subject` (required): Message subject
- `message` (required): Message content
- `createdAt`: Timestamp when message was sent
- `updatedAt`: Timestamp when message was last updated

## Error Handling

The contact form includes:
- Input validation (required fields, email format)
- Database connection error handling
- User-friendly success/error messages
- Form state management during submission

## Security Features

- Input sanitization (trim whitespace, lowercase email)
- Email format validation
- MongoDB injection protection via Mongoose
- Rate limiting can be added if needed

# MongoDB Chat History Setup

This project now includes MongoDB integration to save and retrieve chat history for the MedusaChat component.

## Prerequisites

1. **MongoDB Database** - You need a MongoDB instance running
2. **Environment Variables** - Set up your `.env.local` file

## Setup Instructions

### 1. Install Dependencies
```bash
npm install mongodb mongoose
```

### 2. Environment Configuration
Create a `.env.local` file in your project root with:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/portfolio-chat

# OpenAI API Key (required for chat functionality)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. MongoDB Options

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

#### Option C: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Database Structure

The chat system creates the following collections:
- **Chats** - Stores chat sessions with messages
- **Messages** - Individual messages within each chat

### 5. Features

- ✅ **Persistent Chat History** - Conversations saved across sessions
- ✅ **Session Management** - Unique session IDs for each chat
- ✅ **Real-time Updates** - Messages saved immediately after sending
- ✅ **History Loading** - Load previous conversations with the "Load History" button

### 6. API Endpoints

- **POST** `/api/chat` - Send message and save to MongoDB
- **GET** `/api/chat?sessionId=X` - Retrieve chat history

### 7. Testing

1. Start your development server: `npm run dev`
2. Navigate to the MedusaChat component
3. Send a message - it will be saved to MongoDB
4. Refresh the page and use "Load History" to see previous messages

## Troubleshooting

### Connection Issues
- Verify MongoDB is running
- Check your connection string in `.env.local`
- Ensure network access if using cloud MongoDB

### Chat Not Saving
- Check browser console for errors
- Verify API routes are working
- Check MongoDB connection status

### Performance
- MongoDB connection is cached for better performance
- Chat history loads automatically when session ID is available

## Security Notes

- Store sensitive credentials in `.env.local` (not committed to git)
- Consider adding authentication for production use
- Implement rate limiting for production deployments

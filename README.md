# Bumblebee Dating App

A modern, AI-powered dating application built with React and Node.js, featuring intelligent matching, real-time chat, and an interactive map system.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with email validation
- **Profile Management**: Complete user profiles with photos, interests, and preferences
- **AI-Powered Matching**: Intelligent compatibility scoring based on user preferences
- **Real-time Chat**: Instant messaging with message persistence
- **Interactive Map**: Colony-based exploration system with unlockable locations
- **Match Management**: Save and manage matches in your "Hive"

### Technical Features
- **Backend API**: RESTful API with MongoDB integration
- **Real-time Updates**: Live chat and match notifications
- **Responsive Design**: Mobile-first UI with modern styling
- **Data Persistence**: All user data, matches, and messages saved to database
- **Image Upload**: Profile photo management with validation
- **Location Services**: Map integration for location-based features

## 🛠️ Tech Stack

### Frontend
- **React 19** with React Router for navigation
- **Axios** for API communication
- **CSS3** with modern styling and animations
- **Local Storage** for session management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** enabled for cross-origin requests
- **RESTful API** design

### Database Models
- **User**: Authentication and basic user info
- **Profile**: Extended user profile with preferences
- **Tag**: AI-generated compatibility tags
- **Chat**: Real-time messaging system
- **Match**: User match relationships

## 📁 Project Structure

```
Bumblebee/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Utility functions
│   └── app.js           # Main server file
├── ui/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── data/        # Static data files
│   │   └── App.js       # Main React app
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bumblebee
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../ui
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   STRING=mongodb://localhost:27017/bumblebee
   PORT=3000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

7. **Start the frontend development server**
   ```bash
   cd ui
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## 🔧 API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Profiles
- `GET /profiles` - Get all profiles
- `GET /profiles/:userId` - Get profile by user ID
- `POST /profiles/:userId` - Create/update profile
- `PUT /profiles/:userId` - Update profile
- `GET /profiles/:userId/compatibility` - Get compatibility matches

### Matches
- `GET /matches/:userId` - Get user's matches
- `POST /matches` - Create new match
- `DELETE /matches/:matchId` - Remove match

### Chat
- `GET /chat?user1Id&user2Id` - Get chat between users
- `POST /chat` - Create new chat
- `PUT /chat/:chatId/message` - Send message

## 🎨 UI Components

### Main Components
- **LandingPage**: Welcome screen with app information
- **Login/Signup**: User authentication forms
- **Menu**: Main navigation and app interface
- **Feed**: Swipeable profile cards with matching
- **Hive**: View and manage saved matches
- **Messages**: Real-time chat interface
- **Profile**: User profile management
- **Map**: Interactive colony exploration
- **Search**: Advanced profile search and filtering

### Key Features
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, bee-themed interface
- **Smooth Animations**: Engaging user interactions
- **Real-time Updates**: Live chat and notifications
- **Image Management**: Profile photo upload and preview

## 🔐 Security Features

- **Input Validation**: All user inputs are validated
- **CORS Protection**: Configured for secure cross-origin requests
- **Data Sanitization**: User data is properly sanitized
- **Error Handling**: Comprehensive error handling throughout

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API endpoints to point to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐝 About Bumblebee

Bumblebee is designed to create meaningful connections through intelligent matching and engaging user experiences. The app combines modern web technologies with thoughtful UX design to make online dating more enjoyable and effective.

## 🆘 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy Dating! 🐝💕**

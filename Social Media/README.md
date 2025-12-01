# Invite-Only Social Media Platform

A Twitter-like social media platform with invite-only registration. Built with Node.js, Express, and vanilla JavaScript.

## Features

- **Invite-Only Registration**: Users must have an invite code to create an account
- **User Authentication**: Secure login and registration with JWT tokens
- **Social Feed**: View posts from users you follow
- **Explore**: Discover all posts from the community
- **Post Creation**: Create posts up to 280 characters (Twitter-style)
- **Like Posts**: Like and unlike posts
- **User Profiles**: View and edit your profile with display name, bio, and avatar
- **Invite Management**: Generate invite codes to invite new users
- **Follow System**: Follow and unfollow other users (coming soon in UI)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Data Storage**: JSON files (can be easily migrated to a database)

## Installation

1. Navigate to the project directory:
```bash
cd "Social Media"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the template:
```bash
cp env.template .env
```

4. Edit `.env` and set your configuration:
   - `PORT`: Server port (default: 3001)
   - `JWT_SECRET`: A random secret key for JWT tokens (change this!)

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Getting Started

1. **First User**: When you start the server for the first time, it will generate an admin invite code. Check the console output for this code.

2. **Create Account**: 
   - Go to the signup page
   - Enter your username, email, password, and the invite code
   - Create your account

3. **Login**: Use your email and password to log in

4. **Generate Invites**: 
   - Navigate to the "Invites" page
   - Click "Generate Invite Code"
   - Share the code with others you want to invite

5. **Start Posting**: Create posts, follow users, and engage with the community!

## API Endpoints

### Authentication
- `POST /api/register` - Register new user (requires invite code)
- `POST /api/login` - Login user
- `GET /api/me` - Get current user info

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get feed (posts from followed users)
- `GET /api/posts/all` - Get all posts (explore)
- `POST /api/posts/:postId/like` - Like/unlike a post
- `DELETE /api/posts/:postId` - Delete a post

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/posts` - Get user's posts
- `GET /api/users?q=search` - Search users
- `POST /api/users/:userId/follow` - Follow/unfollow user
- `PUT /api/profile` - Update own profile

### Invites
- `POST /api/invites` - Create new invite code
- `GET /api/invites` - Get user's invites

## Data Storage

The application stores data in JSON files in the `data/` directory:
- `users.json` - User accounts
- `posts.json` - All posts
- `invites.json` - Invite codes
- `follows.json` - Follow relationships

**Note**: For production use, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Change the `JWT_SECRET` in production
- Consider adding rate limiting for production
- Add HTTPS in production
- Implement proper input validation and sanitization

## Future Enhancements

- Real-time updates with WebSockets
- Image uploads for avatars and posts
- Comments/replies to posts
- Direct messaging
- Notifications
- Hashtags and mentions
- Database migration (MongoDB/PostgreSQL)
- Email verification
- Password reset functionality

## License

ISC


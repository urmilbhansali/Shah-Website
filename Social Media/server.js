const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage files
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const POSTS_FILE = path.join(__dirname, 'data', 'posts.json');
const INVITES_FILE = path.join(__dirname, 'data', 'invites.json');
const FOLLOWS_FILE = path.join(__dirname, 'data', 'follows.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load data from files
function loadData(file, defaultData) {
    if (fs.existsSync(file)) {
        try {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
            return defaultData;
        }
    }
    return defaultData;
}

function saveData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving ${file}:`, error);
        return false;
    }
}

// Initialize data
let users = loadData(USERS_FILE, {});
let posts = loadData(POSTS_FILE, []);
let invites = loadData(INVITES_FILE, {});
let follows = loadData(FOLLOWS_FILE, {});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Helper function to generate invite code
function generateInviteCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Register new user (requires invite code)
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, inviteCode } = req.body;

        if (!username || !email || !password || !inviteCode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if invite code is valid
        const invite = invites[inviteCode];
        if (!invite || invite.used) {
            return res.status(400).json({ error: 'Invalid or already used invite code' });
        }

        // Check if username or email already exists
        const existingUser = Object.values(users).find(
            u => u.username === username || u.email === email
        );
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = uuidv4();
        const user = {
            id: userId,
            username,
            email,
            password: hashedPassword,
            displayName: username,
            bio: '',
            avatar: '',
            createdAt: new Date().toISOString(),
            inviteCode: inviteCode
        };

        users[userId] = user;

        // Mark invite as used
        invites[inviteCode].used = true;
        invites[inviteCode].usedBy = userId;
        invites[inviteCode].usedAt = new Date().toISOString();

        // Initialize follows for new user
        follows[userId] = [];

        // Save data
        saveData(USERS_FILE, users);
        saveData(INVITES_FILE, invites);
        saveData(FOLLOWS_FILE, follows);

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = Object.values(users).find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
app.get('/api/me', authenticateToken, (req, res) => {
    const user = users[req.user.userId];
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt
    });
});

// Update user profile
app.put('/api/profile', authenticateToken, (req, res) => {
    try {
        const user = users[req.user.userId];
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { displayName, bio, avatar } = req.body;

        if (displayName !== undefined) user.displayName = displayName;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;

        saveData(USERS_FILE, users);

        res.json({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create invite code (only existing users can create invites)
app.post('/api/invites', authenticateToken, (req, res) => {
    try {
        const inviteCode = generateInviteCode();
        const userId = req.user.userId;

        invites[inviteCode] = {
            code: inviteCode,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            used: false
        };

        saveData(INVITES_FILE, invites);

        res.json({ inviteCode, message: 'Invite code created successfully' });
    } catch (error) {
        console.error('Invite creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's invites
app.get('/api/invites', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const userInvites = Object.values(invites).filter(
            invite => invite.createdBy === userId
        );

        res.json(userInvites);
    } catch (error) {
        console.error('Error fetching invites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a post
app.post('/api/posts', authenticateToken, (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Post content is required' });
        }

        if (content.length > 280) {
            return res.status(400).json({ error: 'Post content cannot exceed 280 characters' });
        }

        const post = {
            id: uuidv4(),
            userId,
            username: users[userId].username,
            displayName: users[userId].displayName,
            avatar: users[userId].avatar,
            content: content.trim(),
            likes: [],
            replies: [],
            createdAt: new Date().toISOString()
        };

        posts.unshift(post); // Add to beginning
        saveData(POSTS_FILE, posts);

        res.status(201).json(post);
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get posts (feed)
app.get('/api/posts', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const following = follows[userId] || [];
        const followingIds = new Set([userId, ...following]); // Include own posts

        // Get posts from users you follow
        const feedPosts = posts.filter(post => followingIds.has(post.userId));

        // Sort by creation date (newest first)
        feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(feedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all posts (for discovery)
app.get('/api/posts/all', authenticateToken, (req, res) => {
    try {
        const sortedPosts = [...posts].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        res.json(sortedPosts);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Like/Unlike a post
app.post('/api/posts/:postId/like', authenticateToken, (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const post = posts.find(p => p.id === postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(userId);
        }

        saveData(POSTS_FILE, posts);

        res.json({ likes: post.likes, liked: likeIndex === -1 });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
app.delete('/api/posts/:postId', authenticateToken, (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (posts[postIndex].userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        posts.splice(postIndex, 1);
        saveData(POSTS_FILE, posts);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Follow/Unfollow a user
app.post('/api/users/:userId/follow', authenticateToken, (req, res) => {
    try {
        const { userId: targetUserId } = req.params;
        const currentUserId = req.user.userId;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        if (!users[targetUserId]) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!follows[currentUserId]) {
            follows[currentUserId] = [];
        }

        const followIndex = follows[currentUserId].indexOf(targetUserId);
        if (followIndex > -1) {
            follows[currentUserId].splice(followIndex, 1);
        } else {
            follows[currentUserId].push(targetUserId);
        }

        saveData(FOLLOWS_FILE, follows);

        res.json({
            following: followIndex === -1,
            followingCount: follows[currentUserId].length
        });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/users/:userId', authenticateToken, (req, res) => {
    try {
        const { userId } = req.params;
        const user = users[userId];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userPosts = posts.filter(p => p.userId === userId);
        const userFollowers = Object.keys(follows).filter(
            uid => follows[uid] && follows[uid].includes(userId)
        );
        const userFollowing = follows[userId] || [];

        const isFollowing = (follows[req.user.userId] || []).includes(userId);

        res.json({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            avatar: user.avatar,
            createdAt: user.createdAt,
            postsCount: userPosts.length,
            followersCount: userFollowers.length,
            followingCount: userFollowing.length,
            isFollowing
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's posts
app.get('/api/users/:userId/posts', authenticateToken, (req, res) => {
    try {
        const { userId } = req.params;
        const userPosts = posts.filter(p => p.userId === userId);
        userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(userPosts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search users
app.get('/api/users', authenticateToken, (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }

        const searchTerm = q.toLowerCase();
        const matchingUsers = Object.values(users)
            .filter(user =>
                user.username.toLowerCase().includes(searchTerm) ||
                user.displayName.toLowerCase().includes(searchTerm)
            )
            .map(user => ({
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                bio: user.bio
            }))
            .slice(0, 10); // Limit to 10 results

        res.json(matchingUsers);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize with a default admin invite code if no invites exist
if (Object.keys(invites).length === 0) {
    const adminInvite = generateInviteCode();
    invites[adminInvite] = {
        code: adminInvite,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        used: false
    };
    saveData(INVITES_FILE, invites);
    console.log(`\n=== ADMIN INVITE CODE: ${adminInvite} ===\n`);
    console.log('Use this code to create the first user account.\n');
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


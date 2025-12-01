// API Configuration
const API_BASE = window.location.origin + '/api';

// State
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showMainView();
        loadInitialData();
    } else {
        showAuthView();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Signup form
    document.getElementById('signup-form').addEventListener('submit', handleSignup);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            navigateToPage(page);
        });
    });

    // Post creation
    document.getElementById('post-btn').addEventListener('click', handleCreatePost);
    document.getElementById('post-content').addEventListener('input', updateCharCount);

    // Profile edit
    document.getElementById('edit-profile-btn').addEventListener('click', showEditProfileModal);

    // Invites
    document.getElementById('create-invite-btn').addEventListener('click', handleCreateInvite);
    document.getElementById('copy-invite-btn').addEventListener('click', copyInviteCode);
}

// Switch between login and signup tabs
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signup-form').classList.toggle('hidden', tab !== 'signup');
    document.getElementById('login-error').textContent = '';
    document.getElementById('signup-error').textContent = '';
}

// Show auth view
function showAuthView() {
    document.getElementById('auth-view').classList.remove('hidden');
    document.getElementById('main-view').classList.add('hidden');
}

// Show main view
function showMainView() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('main-view').classList.remove('hidden');
    updateUserDisplay();
}

// Update user display in UI
function updateUserDisplay() {
    if (currentUser) {
        const avatar = currentUser.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.username);
        document.getElementById('compose-avatar').src = avatar;
        document.getElementById('profile-avatar').src = avatar;
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainView();
            loadInitialData();
        } else {
            errorDiv.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        console.error('Login error:', error);
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const inviteCode = document.getElementById('signup-invite').value;
    const errorDiv = document.getElementById('signup-error');

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, inviteCode })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainView();
            loadInitialData();
        } else {
            errorDiv.textContent = data.error || 'Signup failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        console.error('Signup error:', error);
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    showAuthView();
}

// Navigate to page
function navigateToPage(page) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Show/hide pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });

    // Load page data
    switch (page) {
        case 'feed':
            loadFeed();
            break;
        case 'explore':
            loadExplore();
            break;
        case 'profile':
            loadProfile(currentUser.id);
            break;
        case 'invites':
            loadInvites();
            break;
    }
}

// Load initial data
function loadInitialData() {
    loadFeed();
    loadProfile(currentUser.id);
}

// Load feed
async function loadFeed() {
    try {
        const response = await fetch(`${API_BASE}/posts`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts, 'posts-container');
        }
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

// Load explore
async function loadExplore() {
    try {
        const response = await fetch(`${API_BASE}/posts/all`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts, 'explore-posts');
        }
    } catch (error) {
        console.error('Error loading explore:', error);
    }
}

// Display posts
function displayPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">No posts yet. Be the first to post!</div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post';
    div.dataset.postId = post.id;

    const avatar = post.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username)}`;
    const timeAgo = getTimeAgo(new Date(post.createdAt));
    const isLiked = post.likes && post.likes.includes(currentUser.id);
    const likesCount = post.likes ? post.likes.length : 0;
    const isOwnPost = post.userId === currentUser.id;

    div.innerHTML = `
        <div class="post-header">
            <img src="${avatar}" alt="${post.displayName}" class="avatar small">
            <div>
                <strong>${escapeHtml(post.displayName)}</strong>
                <span class="username">@${escapeHtml(post.username)}</span>
            </div>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-footer">
            <button class="post-action ${isLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                <span class="action-icon">❤️</span>
                <span>${likesCount}</span>
            </button>
            ${isOwnPost ? `<button class="post-action" data-action="delete" data-post-id="${post.id}">🗑️ Delete</button>` : ''}
            <span class="post-time">${timeAgo}</span>
        </div>
    `;

    // Add event listeners
    const likeBtn = div.querySelector('[data-action="like"]');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => handleLikePost(post.id));
    }

    const deleteBtn = div.querySelector('[data-action="delete"]');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeletePost(post.id));
    }

    return div;
}

// Handle create post
async function handleCreatePost() {
    const content = document.getElementById('post-content').value.trim();
    const btn = document.getElementById('post-btn');

    if (!content || content.length === 0) {
        return;
    }

    if (content.length > 280) {
        alert('Post cannot exceed 280 characters');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Posting...';

    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            document.getElementById('post-content').value = '';
            updateCharCount();
            loadFeed();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to create post');
        }
    } catch (error) {
        alert('Network error. Please try again.');
        console.error('Create post error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Post';
    }
}

// Update character count
function updateCharCount() {
    const content = document.getElementById('post-content').value;
    const count = content.length;
    const charCount = document.getElementById('char-count');
    charCount.textContent = `${count}/280`;

    charCount.classList.remove('warning', 'error');
    if (count > 260) {
        charCount.classList.add('error');
    } else if (count > 240) {
        charCount.classList.add('warning');
    }
}

// Handle like post
async function handleLikePost(postId) {
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            // Reload feed to update like status
            loadFeed();
            if (document.getElementById('explore-page').classList.contains('active')) {
                loadExplore();
            }
        }
    } catch (error) {
        console.error('Like error:', error);
    }
}

// Handle delete post
async function handleDeletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            loadFeed();
            if (document.getElementById('explore-page').classList.contains('active')) {
                loadExplore();
            }
            if (document.getElementById('profile-page').classList.contains('active')) {
                loadProfile(currentUser.id);
            }
        }
    } catch (error) {
        console.error('Delete error:', error);
    }
}

// Load profile
async function loadProfile(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const user = await response.json();
            displayProfile(user);

            // Load user posts
            const postsResponse = await fetch(`${API_BASE}/users/${userId}/posts`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (postsResponse.ok) {
                const posts = await postsResponse.json();
                displayPosts(posts, 'profile-posts');
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Display profile
function displayProfile(user) {
    const avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`;
    document.getElementById('profile-avatar').src = avatar;
    document.getElementById('profile-name').textContent = user.displayName || user.username;
    document.getElementById('profile-username').textContent = `@${user.username}`;
    document.getElementById('profile-bio').textContent = user.bio || 'No bio yet.';
    document.getElementById('posts-count').textContent = user.postsCount || 0;
    document.getElementById('followers-count').textContent = user.followersCount || 0;
    document.getElementById('following-count').textContent = user.followingCount || 0;

    // Show edit button only for own profile
    const editBtn = document.getElementById('edit-profile-btn');
    if (user.id === currentUser.id) {
        editBtn.style.display = 'block';
    } else {
        editBtn.style.display = 'none';
    }
}

// Show edit profile modal
function showEditProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Edit Profile</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Display Name</label>
                    <input type="text" id="edit-display-name" value="${escapeHtml(currentUser.displayName || currentUser.username)}">
                </div>
                <div class="form-group">
                    <label>Bio</label>
                    <textarea id="edit-bio" rows="4" maxlength="160">${escapeHtml(currentUser.bio || '')}</textarea>
                </div>
                <div class="form-group">
                    <label>Avatar URL (optional)</label>
                    <input type="url" id="edit-avatar" value="${escapeHtml(currentUser.avatar || '')}" placeholder="https://...">
                </div>
                <button class="btn btn-primary" id="save-profile-btn">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    document.getElementById('save-profile-btn').addEventListener('click', async () => {
        const displayName = document.getElementById('edit-display-name').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();
        const avatar = document.getElementById('edit-avatar').value.trim();

        try {
            const response = await fetch(`${API_BASE}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ displayName, bio, avatar })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                currentUser = updatedUser;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserDisplay();
                loadProfile(currentUser.id);
                document.body.removeChild(modal);
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            alert('Network error. Please try again.');
            console.error('Update profile error:', error);
        }
    });
}

// Load invites
async function loadInvites() {
    try {
        const response = await fetch(`${API_BASE}/invites`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const invites = await response.json();
            displayInvites(invites);
        }
    } catch (error) {
        console.error('Error loading invites:', error);
    }
}

// Display invites
function displayInvites(invites) {
    const container = document.getElementById('invites-list');
    container.innerHTML = '';

    if (invites.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">You haven\'t created any invites yet.</p>';
        return;
    }

    invites.forEach(invite => {
        const div = document.createElement('div');
        div.className = 'invite-item';
        div.innerHTML = `
            <div>
                <div class="invite-item-code">${escapeHtml(invite.code)}</div>
                <div class="invite-item-status ${invite.used ? 'used' : 'active'}">
                    ${invite.used ? 'Used' : 'Active'}
                </div>
            </div>
            <div>
                <small style="color: var(--text-secondary);">
                    ${new Date(invite.createdAt).toLocaleDateString()}
                </small>
            </div>
        `;
        container.appendChild(div);
    });
}

// Handle create invite
async function handleCreateInvite() {
    const btn = document.getElementById('create-invite-btn');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
        const response = await fetch(`${API_BASE}/invites`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('new-invite-code').textContent = data.inviteCode;
            document.getElementById('new-invite-display').classList.remove('hidden');
            loadInvites();
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to create invite');
        }
    } catch (error) {
        alert('Network error. Please try again.');
        console.error('Create invite error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Generate Invite Code';
    }
}

// Copy invite code
function copyInviteCode() {
    const code = document.getElementById('new-invite-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copy-invite-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}


import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Colony definitions (moved from data.js)
export const colonies = {
    honeycomb: { name: "Honeycomb Heights", color: "#ffc107", unlocked: true, cost: 0 },
    meadow: { name: "Meadow Fields", color: "#4caf50", unlocked: false, cost: 15 },
    sunset: { name: "Sunset Valley", color: "#ff9800", unlocked: false, cost: 20 },
    crystal: { name: "Crystal Gardens", color: "#2196f3", unlocked: false, cost: 25 },
    forest: { name: "Whispering Woods", color: "#795548", unlocked: false, cost: 30 },
    ocean: { name: "Ocean Breeze", color: "#00bcd4", unlocked: false, cost: 35 }
};

// Map layout - colony positions and connections
export const mapLayout = {
    honeycomb: { x: 50, y: 50, connections: ['meadow', 'sunset'] },
    meadow: { x: 20, y: 30, connections: ['honeycomb', 'forest'] },
    sunset: { x: 80, y: 30, connections: ['honeycomb', 'crystal'] },
    crystal: { x: 80, y: 70, connections: ['sunset', 'ocean'] },
    forest: { x: 20, y: 70, connections: ['meadow', 'ocean'] },
    ocean: { x: 50, y: 90, connections: ['forest', 'crystal'] }
};

// User API functions
export const userAPI = {
    // Login user
    login: async (username, password) => {
        try {
            const response = await api.get('/users', {
                params: { search: username, passwordSearch: password, fullObject: true }
            });

            if (response.data && response.data.length > 0) {
                const user = response.data[0];
                return { success: true, user };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    },

    // Register new user
    register: async (username, password) => {
        try {
            const response = await api.post('/users', { username, password });
            return { success: true, user: response.data };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    },

    // Get user by ID
    getUser: async (userId) => {
        try {
            const response = await api.get('/users', {
                params: { searchUserId: userId, fullObject: true }
            });
            return response.data[0] || null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }
};

// Profile API functions
export const profileAPI = {
    // Get all profiles or filter by user
    getProfiles: async (userId = null) => {
        try {
            const params = userId ? { searchUserId: userId } : {};
            const response = await api.get('/profiles', { params });
            return response.data;
        } catch (error) {
            console.error('Get profiles error:', error);
            return [];
        }
    },

    // Create or update profile
    createProfile: async (userId, profileData) => {
        try {
            const response = await api.post(`/profiles/${userId}`, profileData);
            return { success: true, profile: response.data };
        } catch (error) {
            console.error('Create profile error:', error);
            return { success: false, message: error.response?.data?.message || 'Profile creation failed' };
        }
    },

    // Get compatible users
    getCompatibleUsers: async (userId) => {
        try {
            const response = await api.get(`/profiles/${userId}/compatibility`);
            return response.data;
        } catch (error) {
            console.error('Get compatible users error:', error);
            return [];
        }
    }
};

// Tags API functions
export const tagsAPI = {
    // Get all tags
    getTags: async () => {
        try {
            const response = await api.get('/tags');
            return response.data;
        } catch (error) {
            console.error('Get tags error:', error);
            return [];
        }
    },

    // Create or update tags for user
    createTags: async (userId, tagsData) => {
        try {
            const response = await api.post(`/tags/${userId}`, tagsData);
            return { success: true, tags: response.data };
        } catch (error) {
            console.error('Create tags error:', error);
            return { success: false, message: error.response?.data?.message || 'Tags creation failed' };
        }
    }
};

// Matches API functions
export const matchesAPI = {
    // Get matches for user
    getMatches: async (userId) => {
        try {
            const response = await api.get(`/matches/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Get matches error:', error);
            return [];
        }
    },

    // Create a new match
    createMatch: async (user1Id, user2Id) => {
        try {
            const response = await api.post('/matches', {
                user1Id,
                user2Id,
                matchedAt: new Date()
            });
            return { success: true, match: response.data };
        } catch (error) {
            console.error('Create match error:', error);
            return { success: false, message: error.response?.data?.message || 'Match creation failed' };
        }
    },

    // Remove a match
    removeMatch: async (matchId) => {
        try {
            const response = await api.delete(`/matches/${matchId}`);
            return { success: true, match: response.data };
        } catch (error) {
            console.error('Remove match error:', error);
            return { success: false, message: error.response?.data?.message || 'Match removal failed' };
        }
    }
};

// Chat API functions
export const chatAPI = {
    // Get chat between two users
    getChat: async (user1Id, user2Id) => {
        try {
            const response = await api.get('/chat', {
                params: { user1Id, user2Id }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Chat doesn't exist
            }
            console.error('Get chat error:', error);
            return null;
        }
    },

    // Create new chat
    createChat: async (user1Id, user2Id) => {
        try {
            const response = await api.post('/chat', { user1Id, user2Id });
            return { success: true, chat: response.data };
        } catch (error) {
            console.error('Create chat error:', error);
            return { success: false, message: error.response?.data?.message || 'Chat creation failed' };
        }
    },

    // Send message
    sendMessage: async (chatId, senderId, content) => {
        try {
            const response = await api.put(`/chat/${chatId}/message`, {
                senderId,
                content
            });
            return { success: true, chat: response.data };
        } catch (error) {
            console.error('Send message error:', error);
            return { success: false, message: error.response?.data?.message || 'Message sending failed' };
        }
    }
};

// Colony API functions
export const colonyAPI = {
    // Get all colonies
    getColonies: async () => {
        try {
            const response = await api.get('/colonies');
            return response.data;
        } catch (error) {
            console.error('Get colonies error:', error);
            return colonies; // Fallback to local data
        }
    },

    // Get user's colony status
    getUserColonyStatus: async (userId) => {
        try {
            const response = await api.get(`/colonies/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Get user colony status error:', error);
            return null;
        }
    },

    // Change user's current colony
    changeColony: async (userId, colonyId) => {
        try {
            const response = await api.post(`/colonies/${userId}/change`, { colonyId });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Change colony error:', error);
            return { success: false, message: error.response?.data?.message || 'Colony change failed' };
        }
    },

    // Unlock a new colony
    unlockColony: async (userId, colonyId) => {
        try {
            const response = await api.post(`/colonies/${userId}/unlock`, { colonyId });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Unlock colony error:', error);
            return { success: false, message: error.response?.data?.message || 'Colony unlock failed' };
        }
    },

    // Add honey to user
    addHoney: async (userId, amount) => {
        try {
            const response = await api.post(`/colonies/${userId}/honey`, { amount });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Add honey error:', error);
            return { success: false, message: error.response?.data?.message || 'Add honey failed' };
        }
    }
};

// Utility functions
export const utils = {
    // Convert profile data from backend format to frontend format
    formatProfile: (profileData, userId, username = 'User') => {
        if (!profileData || profileData.length < 4) {
            return null;
        }

        return {
            id: userId,
            name: username,
            age: profileData[2] || 25,
            bio: profileData[3] || 'Looking for meaningful connections!',
            location: 'City, State', // Would need to be added to backend
            colony: 'honeycomb', // Default colony
            photos: [profileData[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
            occupation: 'Professional', // Would need to be added to backend
            education: 'University', // Would need to be added to backend
            height: '5\'10"', // Would need to be added to backend
            interests: ['Technology', 'Music', 'Travel'] // Would need to be added to backend
        };
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        return {
            id: localStorage.getItem('currentUserId'),
            username: localStorage.getItem('currentUserEmail'),
            name: localStorage.getItem('userName'),
            age: localStorage.getItem('userAge'),
            location: localStorage.getItem('userLocation'),
            description: localStorage.getItem('userDescription'),
            interests: localStorage.getItem('userInterests'),
            profilePicture: localStorage.getItem('userProfilePicture')
        };
    },

    // Set current user in localStorage
    setCurrentUser: (userData) => {
        if (userData.id) localStorage.setItem('currentUserId', userData.id);
        if (userData.username) localStorage.setItem('currentUserEmail', userData.username);
        if (userData.name) localStorage.setItem('userName', userData.name);
        if (userData.age) localStorage.setItem('userAge', userData.age);
        if (userData.location) localStorage.setItem('userLocation', userData.location);
        if (userData.description) localStorage.setItem('userDescription', userData.description);
        if (userData.interests) localStorage.setItem('userInterests', userData.interests);
        if (userData.profilePicture) localStorage.setItem('userProfilePicture', userData.profilePicture);
    },

    // Clear current user from localStorage
    clearCurrentUser: () => {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAge');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('userDescription');
        localStorage.removeItem('userInterests');
        localStorage.removeItem('userProfilePicture');
        localStorage.removeItem('savedMatches');
    }
};

export default api;

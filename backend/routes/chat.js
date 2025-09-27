const express = require('express');
const router = express.Router();
// Assuming your Chat model file is in '../models/Chat'
const Chat = require('../models/Chat'); 

/**
 * Helper function to find a chat between two users regardless of which 
 * ID is stored in 'user1' vs 'user2'.
 * Mongoose uses strict type checking for ObjectIds, so we ensure we search 
 * for the IDs correctly.
 */
const findChat = (id1, id2) => {
    return Chat.findOne({
        $or: [
            // Case 1: id1 is user1 and id2 is user2
            { user1: id1, user2: id2 },
            // Case 2: id2 is user1 and id1 is user2 (reverse order)
            { user1: id2, user2: id1 }
        ]
    });
};


// --- GET A SPECIFIC CHAT BETWEEN TWO USERS ---
// Route: GET /chats?user1Id=...&user2Id=...
router.get('/', async (req, res) => {
    const { user1Id, user2Id } = req.query;

    if (!user1Id || !user2Id) {
        return res.status(400).json({ message: 'Both user1Id and user2Id are required query parameters.' });
    }

    try {
        const chat = await findChat(user1Id, user2Id);

        if (!chat) {
            // 404 if no chat exists, indicating the client should create one
            return res.status(404).json({ message: 'Chat not found between these two users.' });
        }

        // Return the found chat document
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// --- CREATE A NEW CHAT BETWEEN TWO USERS ---
// Route: POST /chats
router.post('/', async (req, res) => {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
        return res.status(400).json({ message: 'Both user1Id and user2Id are required in the request body.' });
    }
    
    if (user1Id.toString() === user2Id.toString()) {
        return res.status(400).json({ message: 'Cannot create a chat with the same user.' });
    }

    try {
        // 1. Check if a chat already exists
        const existingChat = await findChat(user1Id, user2Id);
        
        if (existingChat) {
            // If it exists, return the existing one instead of creating a duplicate
            return res.status(200).json(existingChat);
        }

        // 2. If no chat exists, create a new one
        const newChat = new Chat({
            user1: user1Id,
            user2: user2Id,
            messages: [] // Start with an empty message array
        });

        const savedChat = await newChat.save();
        res.status(201).json(savedChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.put('/:chatId/message', async (req, res) => {
    const { chatId } = req.params;
    const { senderId, content } = req.body;

    if (!senderId || !content) {
        return res.status(400).json({ message: 'senderId and content are required to send a message.' });
    }

    // The message tuple format: [senderId, content]
    const messageTuple = [senderId, content];

    try {
        // Use $push to append the new message tuple to the messages array
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { 
                $push: { messages: messageTuple },
                // Optional: Update Mongoose built-in 'updatedAt' timestamp
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found.' });
        }

        res.status(200).json(updatedChat);

    } catch (error) {
        console.error('Error adding new message:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;

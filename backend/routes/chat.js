const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat'); 


const findChat = (id1, id2) => {
    return Chat.findOne({
        $or: [
            { user1: id1, user2: id2 },
            { user1: id2, user2: id1 }
        ]
    });
};



router.get('/', async (req, res) => {
    const { user1Id, user2Id } = req.query;

    if (!user1Id || !user2Id) {
        return res.status(400).json({ message: 'Both user1Id and user2Id are required query parameters.' });
    }

    try {
        const chat = await findChat(user1Id, user2Id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found between these two users.' });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.post('/', async (req, res) => {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
        return res.status(400).json({ message: 'Both user1Id and user2Id are required in the request body.' });
    }
    
    if (user1Id.toString() === user2Id.toString()) {
        return res.status(400).json({ message: 'Cannot create a chat with the same user.' });
    }

    try {
        const existingChat = await findChat(user1Id, user2Id);
        
        if (existingChat) {
            return res.status(200).json(existingChat);
        }

        const newChat = new Chat({
            user1: user1Id,
            user2: user2Id,
            messages: [] 
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

    const messageTuple = [senderId, content];

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { 
                $push: { messages: messageTuple },
            },
            { new: true, runValidators: true } 
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

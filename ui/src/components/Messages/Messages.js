import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messages.css';

const Messages = ({ savedMatches, onViewProfile, onBack, selectedMatch, onSendMessage }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState({});
  const [currentUserId] = useState(sessionStorage.getItem('currentUserId'));

  useEffect(() => {
    console.log('Messages: Component mounted');
    console.log('Messages: Session storage contents:');
    console.log('- currentUserId:', sessionStorage.getItem('currentUserId'));
    console.log('- userName:', sessionStorage.getItem('userName'));
    console.log('- currentUserEmail:', sessionStorage.getItem('currentUserEmail'));
    
    if (!currentUserId) {
      console.log('Messages: No currentUserId found - user may not be logged in');
    }
  }, []);

  const initializeConversation = async (userId) => {
    if (!conversations[userId] && currentUserId) {
      try {
        console.log('Messages: Initializing conversation with user:', userId);
        const response = await axios.get('http://localhost:3000/chat', {
          params: {
            user1Id: currentUserId,
            user2Id: userId
          }
        });

        if (response.data) {
          console.log('Messages: Found existing chat with', response.data.messages?.length || 0, 'messages');
          const messages = (response.data.messages || []).map((msg, index) => ({
            id: index,
            text: msg[1],
            sender: msg[0] === currentUserId ? 'me' : 'them',
            timestamp: new Date()
          }));

          setConversations(prev => ({
            ...prev,
            [userId]: messages
          }));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('Messages: Chat not found, creating new one for user:', userId);
          try {
            await axios.post('http://localhost:3000/chat', {
              user1Id: currentUserId,
              user2Id: userId
            });
            
            setConversations(prev => ({
              ...prev,
              [userId]: []
            }));
          } catch (createError) {
            console.error('Error creating chat:', createError);
            setConversations(prev => ({
              ...prev,
              [userId]: []
            }));
          }
        } else {
          console.error('Error initializing conversation:', error);
          setConversations(prev => ({
            ...prev,
            [userId]: []
          }));
        }
      }
    }
  };

  const fetchNewMessages = async () => {
    if (!activeChat || !currentUserId) return;

    try {
      const response = await axios.get('http://localhost:3000/chat', {
        params: {
          user1Id: currentUserId,
          user2Id: activeChat.id
        }
      });

      if (response.data && response.data.messages) {
        const messages = response.data.messages.map((msg, index) => ({
          id: index,
          text: msg[1], 
          sender: msg[0] === currentUserId ? 'me' : 'them',
          timestamp: new Date()
        }));

        const currentMessages = conversations[activeChat.id] || [];
        if (messages.length > currentMessages.length) {
          setConversations(prev => ({
            ...prev,
            [activeChat.id]: messages
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching new messages:', error);
    }
  };

  useEffect(() => {
    let intervalId;

    if (activeChat) {
      intervalId = setInterval(() => {
        fetchNewMessages();
      }, 1000); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeChat, conversations]);

  useEffect(() => {
    if (selectedMatch) {
      setActiveChat(selectedMatch);
      initializeConversation(selectedMatch.id);
    }
  }, [selectedMatch]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !currentUserId) return;

    try {
      console.log('Messages: Sending message to user:', activeChat.id);
      const response = await axios.get('http://localhost:3000/chat', {
        params: {
          user1Id: currentUserId,
          user2Id: activeChat.id
        }
      });

      if (response.data) {
        const chatId = response.data._id;
        console.log('Messages: Found chat ID:', chatId);

        await axios.put(`http://localhost:3000/chat/${chatId}/message`, {
          senderId: currentUserId,
          content: newMessage.trim()
        });

        const message = {
          id: Date.now(),
          text: newMessage,
          sender: 'me',
          timestamp: new Date()
        };

        setConversations(prev => ({
          ...prev,
          [activeChat.id]: [...(prev[activeChat.id] || []), message]
        }));

        setNewMessage('');

        if (onSendMessage) {
          onSendMessage();
        }

        console.log('Messages: Message sent successfully');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date()
      };

      setConversations(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), message]
      }));

      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLastMessage = (userId) => {
    const userConversation = conversations[userId];
    if (!userConversation || userConversation.length === 0) return "Say hello! 👋";
    return userConversation[userConversation.length - 1].text;
  };

  if (activeChat) {
    const chatMessages = conversations[activeChat.id] || [];

    return (
      <div className="messages-container">
        <div className="chat-header">
          <button className="back-to-inbox-btn" onClick={() => setActiveChat(null)}>
            ← Back to Inbox
          </button>
          <div className="chat-user-info" onClick={() => onViewProfile(activeChat)}>
            <img
              src={activeChat.photos[0]}
              alt={activeChat.name}
              className="chat-avatar"
            />
            <div className="chat-user-details">
              <h3 className="chat-user-name">{activeChat.name}</h3>
              <span className="chat-user-status">Online</span>
            </div>
          </div>
          <div className="chat-actions">
            <button className="chat-action-btn">📞</button>
            <button className="chat-action-btn">📹</button>
          </div>
        </div>

        <div className="chat-messages">
          {chatMessages.map(message => (
            <div
              key={message.id}
              className={`message ${message.sender === 'me' ? 'message-sent' : 'message-received'}`}
            >
              <div className="message-content">
                <p className="message-text">{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="send-btn"
            disabled={!newMessage.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2 className="messages-title">💬 Messages</h2>
      </div>

      <div className="inbox">
        {!savedMatches || savedMatches.length === 0 ? (
          <div className="empty-inbox">
            <div className="empty-inbox-icon">💌</div>
            <p>No conversations yet!</p>
            <p>Start matching to begin conversations.</p>
          </div>
        ) : (
          <div className="conversations-list">
            {savedMatches.map(match => (
              <div
                key={match.id}
                className="conversation-item"
                onClick={() => {
                  setActiveChat(match);
                  initializeConversation(match.id);
                }}
              >
                <img
                  src={match.photos[0]}
                  alt={match.name}
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4 className="conversation-name">{match.name}</h4>
                    <span className="conversation-time">
                      {conversations[match.id] ? formatTime(conversations[match.id][conversations[match.id].length - 1]?.timestamp) : 'New'}
                    </span>
                  </div>
                  <p className="conversation-preview">{getLastMessage(match.id)}</p>
                </div>
                <div className="conversation-status">
                  <div className="unread-indicator"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

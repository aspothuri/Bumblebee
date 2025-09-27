import React, { useState, useEffect } from 'react';
import './Messages.css';

const Messages = ({ savedMatches, onViewProfile, onBack, selectedMatch, onSendMessage }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState({});

  // Initialize conversations with sample messages
  const initializeConversation = (userId) => {
    if (!conversations[userId]) {
      setConversations(prev => ({
        ...prev,
        [userId]: [
          {
            id: 1,
            text: "Hey! Great to match with you! 🐝",
            sender: 'them',
            timestamp: new Date(Date.now() - 3600000)
          }
        ]
      }));
    }
  };

  // Open specific conversation if selectedMatch is provided
  useEffect(() => {
    if (selectedMatch) {
      setActiveChat(selectedMatch);
      initializeConversation(selectedMatch.id);
    }
  }, [selectedMatch]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

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
    
    // Award honey for sending message
    if (onSendMessage) {
      onSendMessage();
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
        {savedMatches.length === 0 ? (
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

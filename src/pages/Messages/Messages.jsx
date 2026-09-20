import { useState } from 'react';
import { mockConversations } from '../../data/mockData';
import { Send, Search } from 'lucide-react';
import { messageApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Messages.css';

export function Messages() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [conversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [newMessage, setNewMessage] = useState('');
  const [chatLog, setChatLog] = useState(conversations[0]?.messages || []);
  const [searchQuery, setSearchQuery] = useState('');

  const activeConv = conversations.find((c) => c.id === activeId);

  const handleSelect = (id) => {
    setActiveId(id);
    const selected = conversations.find((c) => c.id === id);
    setChatLog(selected?.messages || []);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const outgoingText = newMessage.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: outgoingText,
      time: timestamp,
    };

    setChatLog((prev) => [...prev, newMsg]);
    setNewMessage('');

    // Attempt to persist to backend if logged in
    if (isAuthenticated) {
      try {
        await messageApi.sendMessage(activeConv.contactId || 'dummy-receiver', outgoingText);
      } catch (err) {
        // Fallback silently for simulated contacts
      }
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page animate-fade-in glass-panel">
      {/* Conversations List Sidebar */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          {!isAuthenticated && (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#93c5fd',
                cursor: 'pointer',
                marginTop: '0.5rem',
                padding: '0.4rem',
                background: 'rgba(59,130,246,0.1)',
                borderRadius: '6px',
              }}
              onClick={openAuthModal}
            >
              🔒 Sign in to sync live messages
            </div>
          )}
          <div
            className="search-bar"
            style={{
              padding: '0.5rem',
              marginTop: '0.75rem',
              background: 'var(--bg-color)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Search size={16} />
            <input
              type="text"
              placeholder="Search chats..."
              style={{ fontSize: '0.875rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="conversations-list">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeId === conv.id ? 'active' : ''} ${conv.unread ? 'unread' : ''}`}
              onClick={() => handleSelect(conv.id)}
            >
              <img src={conv.contactAvatar} alt={conv.contactName} className="contact-avatar" />
              <div className="contact-info">
                <div className="flex-between">
                  <h4 className="contact-name">{conv.contactName}</h4>
                  <span className="contact-time">{conv.time}</span>
                </div>
                <p className="contact-last-msg">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {activeConv ? (
          <>
            <div className="chat-header">
              <img src={activeConv.contactAvatar} alt={activeConv.contactName} className="contact-avatar" />
              <div>
                <h3 style={{ fontSize: '1.125rem' }}>{activeConv.contactName}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary-color)' }}>Online</span>
              </div>
            </div>

            <div className="chat-history">
              {chatLog.map((msg) => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn btn-primary send-btn" disabled={!newMessage.trim()}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ margin: 'auto', color: 'var(--text-secondary)' }}>Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  );
}

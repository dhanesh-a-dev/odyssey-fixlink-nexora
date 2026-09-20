import { useState } from 'react';
import { mockConversations } from '../../data/mockData';
import { Send, Search } from 'lucide-react';
import './Messages.css';

export function Messages() {
  const [conversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [newMessage, setNewMessage] = useState('');
  
  // Local state to simulate sending a message
  const [chatLog, setChatLog] = useState(conversations.find(c => c.id === activeId)?.messages || []);

  const activeConv = conversations.find(c => c.id === activeId);

  const handleSelect = (id) => {
    setActiveId(id);
    setChatLog(conversations.find(c => c.id === id)?.messages || []);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now().toString(),
      sender: 'me',
      text: newMessage,
      time: 'Just now'
    };
    
    setChatLog([...chatLog, msg]);
    setNewMessage('');
  };

  return (
    <div className="messages-page animate-fade-in glass-panel">
      
      {/* Conversations List Sidebar */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <div className="search-bar" style={{ padding: '0.5rem', marginTop: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
            <Search size={16} />
            <input type="text" placeholder="Search..." style={{ fontSize: '0.875rem' }} />
          </div>
        </div>
        
        <div className="conversations-list">
          {conversations.map(conv => (
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
              {chatLog.map(msg => (
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
          <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}

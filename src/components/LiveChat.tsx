import React, { useState } from 'react';
import { MessageCircle, Send, X, User } from 'lucide-react';

interface LiveChatProps {
  gymName: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'gym';
  timestamp: Date;
}

const LiveChat: React.FC<LiveChatProps> = ({ gymName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! Welcome to ${gymName}. How can I help you today?`,
      sender: 'gym',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate gym response
    setTimeout(() => {
      const gymResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! A team member will get back to you shortly.",
        sender: 'gym',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, gymResponse]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black p-4 rounded-full shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transition-all duration-300 z-50"
      >
        <MessageCircle className="h-6 w-6 font-bold" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-gray-900 rounded-lg shadow-xl shadow-cyan-500/20 border border-gray-800 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm shadow-green-400/50"></div>
          <span className="font-bold">{gymName}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-black hover:bg-black/20 p-1 rounded transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-700'}`}>
                <User className={`h-3 w-3 ${message.sender === 'user' ? 'text-black' : 'text-gray-300'}`} />
              </div>
              <div className={`p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/30' 
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black p-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;
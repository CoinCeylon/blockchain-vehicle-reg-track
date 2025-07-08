import React, { useEffect, useState, useRef } from 'react';
import { MessageCircleIcon, XIcon, SendIcon, BotIcon, UserIcon, PlusIcon } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
const ChatBot: React.FC = () => {
  const {
    messages,
    sendMessage,
    isChatOpen,
    toggleChat,
    clearChat
  } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const suggestions = ['How does blockchain registration work?', 'What documents do I need?', 'How do I transfer ownership?', 'How secure is the system?'];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
      setIsTyping(true);
      setShowSuggestions(false);
   
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setIsTyping(true);
    setShowSuggestions(false);
  
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };
  if (!isChatOpen) {
    return <button onClick={toggleChat} className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 animate-bounce-slow" aria-label="Open chat assistant">
        <MessageCircleIcon className="h-6 w-6" />
      </button>;
  }
  return <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-40 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <BotIcon className="h-5 w-5" />
          <h3 className="font-medium">Vehicrypt Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={clearChat} className="text-white hover:text-gray-200 transition-colors" aria-label="Clear chat">
            <PlusIcon className="h-5 w-5 rotate-45" />
          </button>
          <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors" aria-label="Close chat">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'user' ? <UserIcon className="h-4 w-4 text-blue-200" /> : <BotIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
                  <span className="text-xs font-medium opacity-70">
                    {message.sender === 'user' ? 'You' : 'Vehicrypt Assistant'}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
                </p>
              </div>
            </div>)}

          {/* Typing indicator */}
          {isTyping && <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <BotIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>}

          {/* Suggestions */}
          {showSuggestions && messages.length < 3 && <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((suggestion, index) => <button key={index} onClick={() => handleSuggestionClick(suggestion)} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  {suggestion}
                </button>)}
            </div>}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about vehicle registration..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" aria-label="Send message">
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>;
};
export default ChatBot;
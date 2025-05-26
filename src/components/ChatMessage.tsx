import React from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import MovieCard from './MovieCard';

interface ChatMessageProps {
  message: {
    text: string;
    sender: 'user' | 'bot';
    movies?: any[];
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 flex items-start mt-1 ${isBot ? 'mr-2' : 'ml-2'}`}>
          {isBot ? (
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        
        <div>
          <div 
            className={`p-3 rounded-xl shadow-sm ${
              isBot 
                ? 'bg-gray-700 text-white rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}
          >
            <p>{message.text}</p>
          </div>
          
          {message.movies && message.movies.length > 0 && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {message.movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
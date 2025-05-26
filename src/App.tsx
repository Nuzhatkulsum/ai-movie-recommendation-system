import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Film, Search, Heart, User, Clock, Send } from 'lucide-react';
import './index.css';
import { movieData } from './data/movies';
import MovieCard from './components/MovieCard';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot'; movies?: any[] }>>([
    { 
      text: "Hello! I'm your movie recommendation assistant. Ask me to recommend movies based on genre, actors, directors, or tell me what kind of movie you're in the mood for!", 
      sender: 'bot' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    const userQuery = input;
    setInput('');
    setIsTyping(true);

    // Simulate processing time
    setTimeout(() => {
      const response = processUserInput(userQuery);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const processUserInput = (userInput: string) => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Check for genre queries
    if (lowercaseInput.includes('action') || lowercaseInput.includes('adventure')) {
      const actionMovies = movieData.filter(movie => 
        movie.Genre && movie.Genre.toLowerCase().includes('action')
      ).slice(0, 3);
      
      return {
        text: "Here are some great action movies you might enjoy:",
        sender: 'bot',
        movies: actionMovies
      };
    }
    
    else if (lowercaseInput.includes('drama')) {
      const dramaMovies = movieData.filter(movie => 
        movie.Genre && movie.Genre.toLowerCase().includes('drama')
      ).slice(0, 3);
      
      return {
        text: "Here are some powerful drama films I'd recommend:",
        sender: 'bot',
        movies: dramaMovies
      };
    }
    
    else if (lowercaseInput.includes('comedy')) {
      const comedyMovies = movieData.filter(movie => 
        movie.Genre && movie.Genre.toLowerCase().includes('comedy')
      ).slice(0, 3);
      
      return {
        text: "Here are some comedies that should make you laugh:",
        sender: 'bot',
        movies: comedyMovies
      };
    }
    
    // Check for actor queries
    else if (lowercaseInput.includes('actor') || lowercaseInput.includes('actress') || lowercaseInput.includes('star')) {
      // Extract potential actor names
      let actorNames = ['tom hanks', 'leonardo dicaprio', 'meryl streep', 'brad pitt', 'morgan freeman'];
      let foundActor = null;
      
      for (const actor of actorNames) {
        if (lowercaseInput.includes(actor)) {
          foundActor = actor;
          break;
        }
      }
      
      if (foundActor) {
        const actorMovies = movieData.filter(movie => 
          movie.Actors && movie.Actors.toLowerCase().includes(foundActor!)
        ).slice(0, 3);
        
        if (actorMovies.length > 0) {
          return {
            text: `Here are some great movies starring ${foundActor.charAt(0).toUpperCase() + foundActor.slice(1)}:`,
            sender: 'bot',
            movies: actorMovies
          };
        }
      }
      
      // If no specific actor found or no movies for that actor
      const topRatedMovies = movieData
        .filter(movie => movie.imdbRating)
        .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
        .slice(0, 3);
      
      return {
        text: "I'm not sure which actor you're looking for. Here are some highly-rated movies with excellent performances:",
        sender: 'bot',
        movies: topRatedMovies
      };
    }
    
    // Check for director queries
    else if (lowercaseInput.includes('director')) {
      let directorNames = ['christopher nolan', 'steven spielberg', 'martin scorsese', 'quentin tarantino'];
      let foundDirector = null;
      
      for (const director of directorNames) {
        if (lowercaseInput.includes(director)) {
          foundDirector = director;
          break;
        }
      }
      
      if (foundDirector) {
        const directorMovies = movieData.filter(movie => 
          movie.Director && movie.Director.toLowerCase().includes(foundDirector!)
        ).slice(0, 3);
        
        if (directorMovies.length > 0) {
          return {
            text: `Here are some great films directed by ${foundDirector.charAt(0).toUpperCase() + foundDirector.slice(1)}:`,
            sender: 'bot',
            movies: directorMovies
          };
        }
      }
      
      // If no specific director found
      return {
        text: "I'm not sure which director you're looking for. Here are some movies by acclaimed directors:",
        sender: 'bot',
        movies: movieData
          .filter(movie => movie.Director && ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese"].some(d => movie.Director.includes(d)))
          .slice(0, 3)
      };
    }
    
    // Check for best/top rated movies
    else if (lowercaseInput.includes('best') || lowercaseInput.includes('top') || lowercaseInput.includes('highest rated')) {
      const topRatedMovies = movieData
        .filter(movie => movie.imdbRating)
        .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
        .slice(0, 3);
      
      return {
        text: "Here are some of the highest-rated movies of all time:",
        sender: 'bot',
        movies: topRatedMovies
      };
    }
    
    // Check for year queries
    else if (lowercaseInput.includes('year') || lowercaseInput.match(/\b(19\d{2}|20\d{2})\b/)) {
      // Extract year if present
      const yearMatch = lowercaseInput.match(/\b(19\d{2}|20\d{2})\b/);
      const year = yearMatch ? yearMatch[0] : null;
      
      if (year) {
        const yearMovies = movieData
          .filter(movie => movie.Year === year)
          .slice(0, 3);
        
        if (yearMovies.length > 0) {
          return {
            text: `Here are some great movies from ${year}:`,
            sender: 'bot',
            movies: yearMovies
          };
        } else {
          // If no movies found for that specific year
          return {
            text: `I couldn't find movies from exactly ${year} in my database. Here are some classics from around that time:`,
            sender: 'bot',
            movies: movieData
              .filter(movie => {
                const movieYear = parseInt(movie.Year);
                const targetYear = parseInt(year);
                return Math.abs(movieYear - targetYear) <= 5;
              })
              .slice(0, 3)
          };
        }
      }
      
      // If year mentioned but no specific year detected
      return {
        text: "Here are some movies from different notable decades:",
        sender: 'bot',
        movies: [
          movieData.find(m => m.Year && parseInt(m.Year) >= 1950 && parseInt(m.Year) < 1960),
          movieData.find(m => m.Year && parseInt(m.Year) >= 1970 && parseInt(m.Year) < 1980),
          movieData.find(m => m.Year && parseInt(m.Year) >= 2000 && parseInt(m.Year) < 2010)
        ].filter(Boolean)
      };
    }
    
    // Default recommendation if no specific pattern is recognized
    else {
      const randomMovies = [...movieData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      return {
        text: "I'm not sure exactly what you're looking for, but here are some great movies you might enjoy:",
        sender: 'bot',
        movies: randomMovies
      };
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header */}
      <header className="p-4 border-b border-gray-700 bg-gray-800 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold">MovieMind AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Heart className="h-5 w-5 text-pink-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <Clock className="h-5 w-5 text-blue-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              <User className="h-5 w-5 text-green-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-800 border-r border-gray-700 hidden md:block">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full p-2 pl-8 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <nav className="px-4 pb-4">
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Categories</h2>
            <ul className="space-y-1">
              {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Animation'].map(category => (
                <li key={category}>
                  <a href="#" className="flex items-center px-2 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col max-h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about movies..."
                className="flex-1 p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
              />
              <button 
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
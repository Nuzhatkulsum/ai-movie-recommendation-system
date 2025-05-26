import React, { useState } from 'react';
import { Star, Clock, Info, X } from 'lucide-react';

interface MovieCardProps {
  movie: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="relative">
      <div 
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-700"
        onClick={toggleExpand}
      >
        <div className="relative h-40 overflow-hidden">
          {movie.Poster && movie.Poster.startsWith('http') ? (
            <img 
              src={movie.Poster} 
              alt={movie.Title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Film className="h-12 w-12 text-gray-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white font-bold text-sm line-clamp-1">{movie.Title}</h3>
            <div className="flex items-center text-xs text-gray-300">
              <span>{movie.Year}</span>
              {movie.Runtime && (
                <>
                  <span className="mx-1">•</span>
                  <span>{movie.Runtime}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-2">
          <div className="flex items-center text-sm mb-1">
            {movie.imdbRating && (
              <div className="flex items-center text-yellow-500 mr-2">
                <Star className="h-3 w-3 mr-1" />
                <span className="text-xs">{movie.imdbRating}/10</span>
              </div>
            )}
            {movie.Genre && (
              <span className="text-xs text-gray-400 truncate">{movie.Genre.split(',')[0]}</span>
            )}
          </div>
          
          <p className="text-xs text-gray-400 line-clamp-2">
            {movie.Plot || "No plot description available."}
          </p>
        </div>
      </div>
      
      {expanded && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                className="absolute right-2 top-2 p-2 bg-gray-900/80 rounded-full hover:bg-gray-700 z-10"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              
              <div className="h-60 relative">
                {movie.Poster && movie.Poster.startsWith('http') ? (
                  <img 
                    src={movie.Poster} 
                    alt={movie.Title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Film className="h-16 w-16 text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-1">{movie.Title} <span className="text-gray-400">({movie.Year})</span></h2>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {movie.Runtime && (
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {movie.Runtime}
                    </span>
                  )}
                  {movie.imdbRating && (
                    <span className="bg-gray-700 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {movie.imdbRating}/10
                    </span>
                  )}
                  {movie.Rated && (
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {movie.Rated}
                    </span>
                  )}
                </div>
                
                {movie.Genre && (
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Genre</h3>
                    <div className="flex flex-wrap gap-1">
                      {movie.Genre.split(',').map((genre: string, i: number) => (
                        <span key={i} className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-0.5 rounded">
                          {genre.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {movie.Plot && (
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Plot</h3>
                    <p className="text-sm text-gray-300">{movie.Plot}</p>
                  </div>
                )}
                
                {movie.Director && (
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Director</h3>
                    <p className="text-sm text-gray-300">{movie.Director}</p>
                  </div>
                )}
                
                {movie.Actors && (
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Cast</h3>
                    <p className="text-sm text-gray-300">{movie.Actors}</p>
                  </div>
                )}
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors">
                    Add to Watchlist
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-colors">
                    Mark as Watched
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
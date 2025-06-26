import React from 'react';

export const BoltBadge: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
      <a 
        href="https://bolt.new" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-all duration-300 hover:opacity-90 hover:rotate-6 group shadow-lg"
        title="Built with Bolt.new"
      >
        <img 
          src="/black_circle_360x360.png" 
          alt="Built with Bolt.new" 
          className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-lg rounded-full bg-white/90 p-1"
        />
      </a>
    </div>
  );
};
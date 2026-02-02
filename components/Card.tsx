
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`
      glass-card
      rounded-3xl
      transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]
      overflow-hidden
      group
      ${className}
    `}>
      {title && (
        <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
          <h3 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5 sm:p-8 text-gray-800 dark:text-gray-200 relative">
        {/* Subtle decorative gradient blob inside card */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;

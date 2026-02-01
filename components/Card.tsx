import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-2xl 
      shadow-[0_10px_20px_rgba(0,0,0,0.05),0_6px_6px_rgba(0,0,0,0.1)] 
      dark:shadow-[0_10px_20px_rgba(0,0,0,0.2),0_6px_6px_rgba(0,0,0,0.2)]
      border border-gray-100 dark:border-gray-700
      transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
      overflow-hidden
      ${className}
    `}>
      {title && (
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-50 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6 text-gray-800 dark:text-gray-200">
        {children}
      </div>
    </div>
  );
};

export default Card;
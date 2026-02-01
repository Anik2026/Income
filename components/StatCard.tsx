import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { currencySymbols } from '../utils/i18n';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, icon: Icon, colorClass }) => {
  const { currency } = useSettings();
  const symbol = currencySymbols[currency];

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 sm:p-6
      bg-white dark:bg-gray-800
      shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]
      dark:shadow-none dark:border dark:border-gray-700
      border border-gray-100
      group
      transition-colors duration-300
    `}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 transform scale-150 group-hover:scale-125 transition-transform duration-500 ${colorClass}`}>
        <Icon size={64} className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="w-full">
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate pr-8">{title}</p>
          <h2 className={`text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2 ${colorClass} truncate`}>
            {symbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl bg-opacity-10 dark:bg-opacity-20 flex-shrink-0 ${colorClass.replace('text-', 'bg-').replace('700', '100').replace('600', '100')}`}>
          <Icon className={`${colorClass} sm:w-6 sm:h-6`} size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
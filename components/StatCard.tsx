
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

  // Map color classes to gradient backgrounds for a rich 3D look
  const getGradient = (colorClass: string) => {
    if (colorClass.includes('blue')) return 'from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/30';
    if (colorClass.includes('green')) return 'from-green-500/10 to-green-600/5 border-green-200/50 dark:border-green-800/30';
    if (colorClass.includes('red')) return 'from-red-500/10 to-red-600/5 border-red-200/50 dark:border-red-800/30';
    if (colorClass.includes('emerald')) return 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 dark:border-emerald-800/30';
    if (colorClass.includes('orange')) return 'from-orange-500/10 to-orange-600/5 border-orange-200/50 dark:border-orange-800/30';
    return 'from-gray-100 to-gray-50';
  };

  const gradientClass = getGradient(colorClass);

  return (
    <div className={`
      relative overflow-hidden rounded-3xl p-5 sm:p-6
      bg-gradient-to-br ${gradientClass}
      backdrop-blur-md
      border
      shadow-lg shadow-gray-200/40 dark:shadow-none
      group
      transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]
    `}>
      {/* Decorative background blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl ${colorClass.replace('text-', 'bg-')}`}></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-2">
          <div className={`p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ${colorClass}`}>
            <Icon size={22} className="sm:w-6 sm:h-6" />
          </div>
          {/* Sparkle effect on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute top-0 right-0">
             <div className={`w-2 h-2 rounded-full ${colorClass.replace('text-', 'bg-')} animate-ping`}></div>
          </div>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 opacity-80">{title}</p>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${colorClass} drop-shadow-sm`}>
            {symbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

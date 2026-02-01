import React, { useEffect, useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Trash2, Edit2, 
  BrainCircuit, List, PieChart as PieChartIcon, LogOut, Moon, Sun, Globe, User as UserIcon
} from 'lucide-react';

import { Transaction, TransactionType, User, Currency, Language } from './types';
import * as Storage from './services/storageService';
import * as GeminiService from './services/geminiService';
import * as AuthService from './services/authService';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useTranslation, currencySymbols } from './utils/i18n';

import StatCard from './components/StatCard';
import Card from './components/Card';
import TransactionForm from './components/TransactionForm';
import Login from './components/Login';
import ProfileModal from './components/ProfileModal';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];

const MainApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { theme, toggleTheme, currency, setCurrency, language, setLanguage } = useSettings();
  const t = useTranslation(language);
  const currencySymbol = currencySymbols[currency];

  useEffect(() => {
    // Check for logged in user
    const savedUser = localStorage.getItem('finance_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadData(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async (currentUser: User) => {
    setLoading(true);
    // Pass username to get specific data for this user
    const data = await Storage.getTransactions(currentUser.username);
    setTransactions(data);
    setLoading(false);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('finance_user', JSON.stringify(userData));
    loadData(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('finance_user');
  };

  const handleUpdateProfile = async (newAvatarUrl: string) => {
    if (!user) return;
    
    const success = await AuthService.updateAvatar(user.username, newAvatarUrl);
    if (success) {
      const updatedUser = { ...user, avatarUrl: newAvatarUrl };
      setUser(updatedUser);
      localStorage.setItem('finance_user', JSON.stringify(updatedUser));
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleTransactionSubmit = async (data: any) => {
    if (!user) return;
    
    if (editingTransaction) {
      await Storage.updateTransaction(editingTransaction.id, data, user.username);
    } else {
      await Storage.saveTransaction(data, user.username);
    }
    setEditingTransaction(null);
    loadData(user);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm(t.confirmDelete)) {
      await Storage.deleteTransaction(id, user.username);
      loadData(user);
    }
  };

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const advice = await GeminiService.getFinancialAdvice(transactions);
    setAiAdvice(advice);
    setAnalyzing(false);
  };

  const summary = useMemo(() => Storage.calculateSummary(transactions), [transactions]);

  // Prepare chart data
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const catMap = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    return [
      { name: 'Summary', [t.income]: summary.totalIncome, [t.expense]: summary.totalExpense }
    ];
  }, [summary, t]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-24 sm:pb-20 bg-[#f0f2f5] dark:bg-[#111827] text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Header with 3D feel */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto py-3 md:py-0 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20 text-white shrink-0">
              <Wallet size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
              {language === 'en' ? 'Hisab' : 'হিসাব'}
            </h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              title="Change Language"
            >
              <Globe size={18} className="sm:w-5 sm:h-5" />
              <span className="sr-only">Switch Language</span>
              <span className="text-[10px] sm:text-xs font-bold ml-0.5 sm:ml-1">{language.toUpperCase()}</span>
            </button>

            {/* Currency Select */}
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 border-none focus:ring-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 w-16 sm:w-auto"
            >
              <option value="USD">USD ($)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="INR">INR (₹)</option>
            </select>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon size={18} className="sm:w-5 sm:h-5" /> : <Sun size={18} className="sm:w-5 sm:h-5" />}
            </button>

            {/* Profile & Logout */}
            <div className="flex items-center gap-2 ml-1">
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="relative group p-0.5 rounded-full border-2 border-transparent hover:border-indigo-500 transition-all"
                title={user.username}
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <UserIcon size={20} />
                    </div>
                  )}
                </div>
              </button>

              <button 
                onClick={handleLogout}
                className="p-1.5 sm:p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors text-gray-600 dark:text-gray-300"
                title={t.logout}
              >
                <LogOut size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <button 
              onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={20} /> {t.addNew}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Navigation Tabs (Mobile optimized) */}
        <div className="flex p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-fit mx-auto mb-6">
          <button
            onClick={() => setView('dashboard')}
            className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${view === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <PieChartIcon size={16} /> {t.dashboard}
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${view === 'history' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <List size={16} /> {t.history}
          </button>
        </div>

        {view === 'dashboard' ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <StatCard 
                title={t.currentBalance} 
                amount={summary.balance} 
                icon={Wallet} 
                colorClass="text-blue-600 dark:text-blue-400"
              />
              <StatCard 
                title={t.totalIncome} 
                amount={summary.totalIncome} 
                icon={TrendingUp} 
                colorClass="text-green-600 dark:text-green-400"
              />
              <StatCard 
                title={t.totalExpense} 
                amount={summary.totalExpense} 
                icon={TrendingDown} 
                colorClass="text-red-600 dark:text-red-400"
              />
            </div>

            {/* AI Insight Section */}
            <div className="w-full">
               <Card className="bg-gradient-to-r from-gray-900 to-slate-800 dark:from-indigo-900 dark:to-purple-900 text-white border-none shadow-2xl">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                     <div className="p-3 bg-white/10 rounded-full animate-pulse shrink-0">
                        <BrainCircuit size={24} className="text-purple-400" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold">{t.aiAdvisor}</h3>
                       <p className="text-gray-400 dark:text-gray-300 text-sm">{t.aiDesc}</p>
                     </div>
                   </div>
                   <button 
                    onClick={handleAIAnalysis}
                    disabled={analyzing}
                    className="w-full md:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                   >
                     {analyzing ? t.analyzing : t.analyze}
                   </button>
                 </div>
                 {aiAdvice && (
                   <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                     {aiAdvice}
                   </div>
                 )}
               </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card title={t.monthlyOverview}>
                <div className="h-56 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#9ca3af' : '#4b5563', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#9ca3af' : '#4b5563', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                      />
                      <Legend wrapperStyle={{fontSize: '12px'}} />
                      <Bar dataKey={t.income} fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
                      <Bar dataKey={t.expense} fill="#ef4444" radius={[6, 6, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title={t.expenseCategory}>
                <div className="h-56 sm:h-64 w-full flex items-center justify-center">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                            color: theme === 'dark' ? '#fff' : '#000'
                          }} 
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '12px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-sm">{t.noExpenses}</p>
                  )}
                </div>
              </Card>
            </div>
          </>
        ) : (
          <Card title={t.history} className="overflow-hidden">
             <div className="overflow-x-auto -mx-4 sm:mx-0">
               <div className="inline-block min-w-full align-middle">
                 <table className="min-w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                       <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">{t.date}</th>
                       <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">{t.category}</th>
                       <th className="hidden sm:table-cell p-3 sm:p-4 font-semibold">{t.note}</th>
                       <th className="p-3 sm:p-4 font-semibold text-right whitespace-nowrap">{t.amount}</th>
                       <th className="p-3 sm:p-4 font-semibold text-center">{t.action}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                     {transactions.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="p-8 text-center text-gray-400">
                           {t.noTransactions}
                         </td>
                       </tr>
                     ) : (
                       transactions.map((t) => (
                         <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                           <td className="p-3 sm:p-4 font-medium whitespace-nowrap">{t.date}</td>
                           <td className="p-3 sm:p-4">
                             <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                               <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium w-fit ${
                                 t.type === TransactionType.INCOME 
                                   ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                   : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                               }`}>
                                 {t.category}
                               </span>
                               {t.paymentMethod && <span className="text-[10px] text-gray-400">({t.paymentMethod})</span>}
                             </div>
                           </td>
                           <td className="hidden sm:table-cell p-3 sm:p-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.note || '-'}</td>
                           <td className={`p-3 sm:p-4 text-right font-bold whitespace-nowrap ${t.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                             {t.type === TransactionType.INCOME ? '+' : '-'}{currencySymbol}{(t.amount || 0).toFixed(2)}
                           </td>
                           <td className="p-3 sm:p-4 text-center">
                             <div className="flex items-center justify-center gap-2">
                               <button 
                                onClick={() => handleEdit(t)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                               >
                                 <Edit2 size={16} />
                               </button>
                               <button 
                                onClick={() => handleDelete(t.id)}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
          </Card>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
        className="md:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus size={24} />
      </button>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }} 
        onSubmit={handleTransactionSubmit} 
        initialData={editingTransaction}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <MainApp />
    </SettingsProvider>
  );
};

export default App;
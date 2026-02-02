
import React, { useEffect, useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Trash2, Edit2, 
  List, PieChart as PieChartIcon, LogOut, Moon, Sun, Globe, User as UserIcon,
  ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';

import { Transaction, TransactionType, User, Currency, Language, LiabilityCategory } from './types';
import * as Storage from './services/storageService';
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

  const getAmountColor = (t: Transaction) => {
    if (t.type === TransactionType.INCOME) return 'text-emerald-600 dark:text-emerald-400';
    if (t.type === TransactionType.EXPENSE) return 'text-rose-600 dark:text-rose-400';
    // Liabilities
    if (t.category === LiabilityCategory.BORROW || t.category === LiabilityCategory.COLLECT) {
      return 'text-emerald-600 dark:text-emerald-400'; // Cash In
    }
    return 'text-rose-600 dark:text-rose-400'; // Cash Out (Lend/Repay)
  };

  const getAmountPrefix = (t: Transaction) => {
    if (t.type === TransactionType.INCOME) return '+';
    if (t.type === TransactionType.EXPENSE) return '-';
    // Liabilities
    if (t.category === LiabilityCategory.BORROW || t.category === LiabilityCategory.COLLECT) return '+';
    return '-';
  };

  const getCategoryBadgeColor = (type: TransactionType) => {
    if (type === TransactionType.INCOME) return 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    if (type === TransactionType.EXPENSE) return 'bg-rose-100/80 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
    return 'bg-violet-100/80 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800';
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-24 sm:pb-20 relative font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 via-white/80 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-30 glass border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto py-3 md:py-0 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30 text-white shrink-0 transform hover:scale-110 transition-transform duration-300">
              <Wallet size={22} className="sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-600 dark:from-white dark:via-indigo-300 dark:to-gray-400 tracking-tight">
              {language === 'en' ? 'Hisab' : 'হিসাব'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Control Bar Pill */}
            <div className="hidden sm:flex items-center gap-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 dark:border-gray-700 shadow-sm">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-300 font-bold text-xs"
              >
                {language.toUpperCase()}
              </button>

              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-sm font-bold text-gray-600 dark:text-gray-300 border-none focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors p-1"
              >
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="INR">INR</option>
              </select>

              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

              <button 
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-300"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex sm:hidden items-center gap-2">
                <button onClick={toggleTheme} className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-3 pl-2">
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="relative group p-0.5 rounded-full border-2 border-indigo-100 dark:border-indigo-900 hover:border-indigo-500 transition-all shadow-md"
                title={user.username}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
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
                className="hidden sm:flex p-2.5 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 hover:scale-105 transition-all shadow-sm"
                title={t.logout}
              >
                <LogOut size={18} />
              </button>
            </div>

            <button 
              onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-95 border-b-4 border-indigo-800"
            >
              <Plus size={20} strokeWidth={3} /> {t.addNew}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Floating Navigation Pill */}
        <div className="flex justify-center mb-8">
            <div className="flex p-1.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-full shadow-xl shadow-indigo-500/10 border border-white/50 dark:border-gray-700">
              <button
                onClick={() => setView('dashboard')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              >
                <PieChartIcon size={18} /> {t.dashboard}
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              >
                <List size={18} /> {t.history}
              </button>
            </div>
        </div>

        {view === 'dashboard' ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="col-span-2 md:col-span-1 lg:col-span-1">
                <StatCard 
                  title={t.currentBalance} 
                  amount={summary.balance} 
                  icon={Wallet} 
                  colorClass="text-blue-600 dark:text-blue-400"
                />
              </div>
              <StatCard 
                title={t.totalIncome} 
                amount={summary.totalIncome} 
                icon={TrendingUp} 
                colorClass="text-emerald-600 dark:text-emerald-400"
              />
              <StatCard 
                title={t.totalExpense} 
                amount={summary.totalExpense} 
                icon={TrendingDown} 
                colorClass="text-rose-600 dark:text-rose-400"
              />
              <StatCard 
                title={t.totalReceivable} 
                amount={summary.totalReceivable} 
                icon={ArrowUpCircle} 
                colorClass="text-teal-600 dark:text-teal-400"
              />
              <StatCard 
                title={t.totalDebt} 
                amount={summary.totalDebt} 
                icon={ArrowDownCircle} 
                colorClass="text-orange-600 dark:text-orange-400"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="animate-in slide-in-from-left-8 duration-700 delay-100">
                <Card title={t.monthlyOverview}>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} barSize={40}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12}} />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            color: theme === 'dark' ? '#fff' : '#000'
                          }}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Bar dataKey={t.income} fill="url(#colorIncome)" radius={[8, 8, 0, 0]} />
                        <Bar dataKey={t.expense} fill="url(#colorExpense)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="animate-in slide-in-from-right-8 duration-700 delay-200">
                <Card title={t.expenseCategory}>
                  <div className="h-64 w-full flex items-center justify-center">
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-md" />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              borderRadius: '16px', 
                              border: 'none', 
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                              backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)',
                              color: theme === 'dark' ? '#fff' : '#000'
                            }} 
                          />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '12px'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                        <PieChartIcon size={48} className="mb-2 opacity-50" />
                        <p className="text-sm font-medium">{t.noExpenses}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-500">
            <Card title={t.history} className="overflow-visible">
               <div className="overflow-x-auto -mx-5 sm:mx-0">
                 <div className="inline-block min-w-full align-middle">
                   <table className="min-w-full text-left border-collapse">
                     <thead>
                       <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                         <th className="p-4 font-bold whitespace-nowrap">{t.date}</th>
                         <th className="p-4 font-bold whitespace-nowrap">{t.category}</th>
                         <th className="hidden sm:table-cell p-4 font-bold">{t.note}</th>
                         <th className="p-4 font-bold text-right whitespace-nowrap">{t.amount}</th>
                         <th className="p-4 font-bold text-center">{t.action}</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
                       {transactions.length === 0 ? (
                         <tr>
                           <td colSpan={5} className="p-12 text-center">
                             <div className="flex flex-col items-center justify-center text-gray-400">
                               <List size={48} className="mb-2 opacity-50" />
                               <p className="font-medium">{t.noTransactions}</p>
                             </div>
                           </td>
                         </tr>
                       ) : (
                         transactions.map((t, index) => (
                           <tr 
                            key={t.id} 
                            className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors animate-in slide-in-from-bottom-2"
                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                           >
                             <td className="p-4 font-medium whitespace-nowrap text-gray-600 dark:text-gray-400">{t.date}</td>
                             <td className="p-4">
                               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${getCategoryBadgeColor(t.type)}`}>
                                   {(t as any).translatedCategory || t.category}
                                 </span>
                                 {t.person && <span className="text-xs text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">P: {t.person}</span>}
                                 {t.paymentMethod && <span className="text-[10px] text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded uppercase tracking-wide">{t.paymentMethod}</span>}
                               </div>
                             </td>
                             <td className="hidden sm:table-cell p-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.note || '-'}</td>
                             <td className={`p-4 text-right font-black whitespace-nowrap text-base ${getAmountColor(t)}`}>
                               {getAmountPrefix(t)}{currencySymbol}{(t.amount || 0).toFixed(2)}
                             </td>
                             <td className="p-4 text-center">
                               <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                  onClick={() => handleEdit(t)}
                                  className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                  title={t.editTransaction}
                                 >
                                   <Edit2 size={16} />
                                 </button>
                                 <button 
                                  onClick={() => handleDelete(t.id)}
                                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                  title="Delete"
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
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
        className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white dark:border-gray-800"
      >
        <Plus size={28} />
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


import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/i18n';
import * as AuthService from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { language } = useSettings();
  const t = useTranslation(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError(language === 'bn' ? 'সব তথ্য দিন' : 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (isLoginView) {
        const result = await AuthService.login(username, password);
        if (result.success && result.user) {
          onLogin({ 
            username: result.user.username, 
            avatarUrl: result.user.avatarUrl,
            isAuthenticated: true 
          });
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        const result = await AuthService.register(username, password);
        if (result.success && result.user) {
          // Auto login after register
          onLogin({ 
            username: result.user.username, 
            avatarUrl: result.user.avatarUrl,
            isAuthenticated: true 
          });
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="relative z-10 glass-card p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all border border-white/40 dark:border-gray-700/50 backdrop-blur-xl animate-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/40 transform rotate-3 hover:rotate-6 transition-transform">
            {isLoginView ? <Lock className="text-white" size={40} /> : <UserPlus className="text-white" size={40} />}
          </div>
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-gray-300 mb-2">
            {isLoginView ? t.loginTitle : (language === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Create Account')}
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
            {isLoginView ? t.loginSubtitle : (language === 'bn' ? 'আপনার তথ্য দিয়ে নিবন্ধন করুন' : 'Register to manage your finances')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">{t.username}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <UserIcon size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 outline-none dark:text-white transition-all shadow-inner font-medium"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">{t.password}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 outline-none dark:text-white transition-all shadow-inner font-medium"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl animate-pulse">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 {isLoginView ? t.loginBtn : (language === 'bn' ? 'নিবন্ধন করুন' : 'Sign Up')}
                 {isLoginView ? <LogIn size={20} /> : <UserPlus size={20} />}
               </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            {isLoginView 
              ? (language === 'bn' ? 'অ্যাকাউন্ট নেই? নিবন্ধন করুন' : "Don't have an account? Sign Up") 
              : (language === 'bn' ? 'অ্যাকাউন্ট আছে? লগ ইন' : "Already have an account? Sign In")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

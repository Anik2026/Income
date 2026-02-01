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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            {isLoginView ? <Lock className="text-white" size={32} /> : <UserPlus className="text-white" size={32} />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white mb-2">
            {isLoginView ? t.loginTitle : (language === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Create Account')}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {isLoginView ? t.loginSubtitle : (language === 'bn' ? 'আপনার তথ্য দিয়ে নিবন্ধন করুন' : 'Register to manage your finances')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">{t.username}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition-all"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">{t.password}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition-all"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
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
import { Language } from '../types';

export const translations = {
  en: {
    appTitle: 'Gopa-Gop',
    dashboard: 'Dashboard',
    history: 'History',
    addNew: 'Add New',
    currentBalance: 'Current Balance',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    aiAdvisor: 'AI Financial Advisor',
    aiDesc: 'Get personalized insights based on your spending.',
    analyze: 'Analyze Finances',
    analyzing: 'Analyzing...',
    monthlyOverview: 'Monthly Overview',
    expenseCategory: 'Expense by Category',
    noExpenses: 'No expenses recorded yet.',
    noTransactions: 'No transactions found. Add one to get started!',
    date: 'Date',
    category: 'Category',
    note: 'Note',
    amount: 'Amount',
    action: 'Action',
    income: 'Income',
    expense: 'Expense',
    paymentMethod: 'Payment Method',
    saveTransaction: 'Save Transaction',
    editTransaction: 'Edit Transaction',
    updateTransaction: 'Update Transaction',
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Enter your credentials to access your finances',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Sign In',
    logout: 'Logout',
    settings: 'Settings',
    optional: 'Optional',
    confirmDelete: 'Are you sure you want to delete this record?'
  },
  bn: {
    appTitle: 'গপা-গপ',
    dashboard: 'ড্যাশবোর্ড',
    history: 'ইতিহাস',
    addNew: 'নতুন যোগ করুন',
    currentBalance: 'বর্তমান ব্যালেন্স',
    totalIncome: 'মোট আয়',
    totalExpense: 'মোট ব্যয়',
    aiAdvisor: 'এআই আর্থিক পরামর্শদাতা',
    aiDesc: 'আপনার খরচের উপর ভিত্তি করে ব্যক্তিগত পরামর্শ পান।',
    analyze: 'বিশ্লেষণ করুন',
    analyzing: 'বিশ্লেষণ চলছে...',
    monthlyOverview: 'মাসিক পর্যালোচনা',
    expenseCategory: 'বিভাগ অনুযায়ী খরচ',
    noExpenses: 'এখনও কোন খরচ রেকর্ড করা হয়নি।',
    noTransactions: 'কোন লেনদেন পাওয়া যায়নি। শুরু করতে একটি যোগ করুন!',
    date: 'তারিখ',
    category: 'বিভাগ',
    note: 'নোট',
    amount: 'পরিমাণ',
    action: 'অ্যাকশন',
    income: 'আয়',
    expense: 'ব্যয়',
    paymentMethod: 'পেমেন্ট মেথড',
    saveTransaction: 'সংরক্ষণ করুন',
    editTransaction: 'লেনদেন সম্পাদনা',
    updateTransaction: 'আপডেট করুন',
    loginTitle: 'স্বাগতম',
    loginSubtitle: 'আপনার অর্থ ব্যবস্থাপনায় প্রবেশ করতে লগ ইন করুন',
    username: 'ব্যবহারকারীর নাম',
    password: 'পাসওয়ার্ড',
    loginBtn: 'লগ ইন',
    logout: 'লগ আউট',
    settings: 'সেটিংস',
    optional: 'ঐচ্ছিক',
    confirmDelete: 'আপনি কি নিশ্চিত যে আপনি এই রেকর্ডটি মুছে ফেলতে চান?'
  }
};

export const currencySymbols = {
  USD: '$',
  BDT: '৳',
  INR: '₹'
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
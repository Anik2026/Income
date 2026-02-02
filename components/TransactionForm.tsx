
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, IncomeSource, ExpenseCategory, PaymentMethod, LiabilityCategory } from '../types';
import { X, Plus, Save, Edit2, Calendar, DollarSign, Tag, FileText, User } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/i18n';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>(ExpenseCategory.FOOD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [note, setNote] = useState('');
  const [person, setPerson] = useState('');
  
  const { language } = useSettings();
  const t = useTranslation(language);

  // Initialize or reset form
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setType(initialData.type);
        setAmount(initialData.amount.toString());
        setDate(initialData.date);
        setCategory(initialData.category);
        setPaymentMethod(initialData.paymentMethod || PaymentMethod.CASH);
        setNote(initialData.note || '');
        setPerson(initialData.person || '');
      } else {
        // Defaults
        setType(TransactionType.EXPENSE);
        setCategory(ExpenseCategory.FOOD);
        setAmount('');
        setNote('');
        setPerson('');
        setPaymentMethod(PaymentMethod.CASH);
        setDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialData]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === TransactionType.INCOME) setCategory(IncomeSource.SALARY);
    else if (newType === TransactionType.EXPENSE) setCategory(ExpenseCategory.FOOD);
    else if (newType === TransactionType.LIABILITY) setCategory(LiabilityCategory.BORROW);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(language === 'bn' ? 'দয়া করে একটি সঠিক পরিমাণ লিখুন' : 'Please enter a valid amount');
      return;
    }

    onSubmit({
      type,
      amount: parsedAmount,
      date,
      category,
      paymentMethod: type === TransactionType.EXPENSE ? paymentMethod : undefined,
      note,
      person: type === TransactionType.LIABILITY ? person : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-in slide-in-from-bottom-10 sm:zoom-in duration-300 border border-white/20 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 relative z-10">
            {initialData ? <Edit2 size={24} /> : <Plus size={24} />} 
            {initialData ? t.editTransaction : t.addNew}
          </h2>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl flex shadow-inner">
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${type === TransactionType.INCOME ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-lg scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => handleTypeChange(TransactionType.INCOME)}
            >
              {t.income}
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-lg scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => handleTypeChange(TransactionType.EXPENSE)}
            >
              {t.expense}
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${type === TransactionType.LIABILITY ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-lg scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => handleTypeChange(TransactionType.LIABILITY)}
            >
              {t.liability}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{t.date}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{t.amount}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <DollarSign size={18} />
                </div>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{t.category}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <Tag size={18} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-10 py-3 font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm appearance-none cursor-pointer"
              >
                {type === TransactionType.INCOME && Object.values(IncomeSource).map(c => <option key={c} value={c}>{(t as any)[c] || c}</option>)}
                {type === TransactionType.EXPENSE && Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{(t as any)[c] || c}</option>)}
                {type === TransactionType.LIABILITY && Object.values(LiabilityCategory).map(c => <option key={c} value={c}>{(t as any)[c] || c}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          {type === TransactionType.LIABILITY && (
             <div className="space-y-1.5 animate-in slide-in-from-top-2">
               <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{t.person}</label>
               <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                   <User size={18} />
                 </div>
                 <input
                   type="text"
                   required
                   value={person}
                   onChange={(e) => setPerson(e.target.value)}
                   placeholder="John Doe / Bank Name"
                   className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
                 />
               </div>
             </div>
          )}

          {type === TransactionType.EXPENSE && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{t.paymentMethod}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm appearance-none cursor-pointer"
              >
                {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">{t.note} ({t.optional})</label>
            <div className="relative group">
                <div className="absolute top-3 left-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <FileText size={18} />
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-none shadow-sm"
                />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/40 transition-all hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <Save size={20} /> {initialData ? t.updateTransaction : t.saveTransaction}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;

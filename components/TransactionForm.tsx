import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, IncomeSource, ExpenseCategory, PaymentMethod } from '../types';
import { X, Plus, Save, Edit2 } from 'lucide-react';
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
      } else {
        setType(TransactionType.EXPENSE);
        setCategory(ExpenseCategory.FOOD);
        setAmount('');
        setNote('');
        setPaymentMethod(PaymentMethod.CASH);
        setDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialData]);

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
      note
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/30 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in slide-in-from-bottom-10 sm:fade-in sm:zoom-in duration-200 border-t sm:border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            {initialData ? <Edit2 size={20} /> : <Plus size={20} />} 
            {initialData ? t.editTransaction : t.addNew}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => {
                setType(TransactionType.INCOME);
                setCategory(IncomeSource.SALARY);
              }}
            >
              {t.income}
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              onClick={() => {
                setType(TransactionType.EXPENSE);
                setCategory(ExpenseCategory.FOOD);
              }}
            >
              {t.expense}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.date}</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.amount}</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.category}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all appearance-none"
            >
              {type === TransactionType.INCOME
                ? Object.values(IncomeSource).map(c => <option key={c} value={c}>{c}</option>)
                : Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>)
              }
            </select>
          </div>

          {type === TransactionType.EXPENSE && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.paymentMethod}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all appearance-none"
              >
                {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.note} ({t.optional})</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={18} /> {initialData ? t.updateTransaction : t.saveTransaction}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
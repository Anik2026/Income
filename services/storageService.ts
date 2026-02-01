import { Transaction, TransactionType } from '../types';
import { supabase } from './supabaseClient';

export const getTransactions = async (username: string): Promise<Transaction[]> => {
  try {
    // Filter by username so users only see their own data
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('username', username)
      .order('date', { ascending: false });

    if (error) {
      console.error("Supabase error fetching transactions:", error);
      return [];
    }
    
    // Normalize data to ensure optional fields exist
    return (data || []).map((t: any) => ({
      ...t,
      amount: Number(t.amount) // Ensure amount is number
    })) as Transaction[];
  } catch (error) {
    console.error("Failed to load transactions:", error);
    return [];
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id'>, username: string): Promise<Transaction> => {
  try {
    const newTransaction = {
      ...transaction,
      username: username, // Associate transaction with the logged-in user
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { ...data, amount: Number(data.amount) } as Transaction;
  } catch (error) {
    console.error("Error saving transaction:", error);
    // Fallback locally if needed, though DB is preferred
    return {
      ...transaction,
      id: Date.now().toString(),
    } as Transaction;
  }
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>, username: string): Promise<Transaction[]> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('username', username); // Ensure user owns the record

    if (error) throw error;
    
    return getTransactions(username);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return getTransactions(username);
  }
};

export const deleteTransaction = async (id: string, username: string): Promise<Transaction[]> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('username', username); // Ensure user owns the record

    if (error) throw error;

    return getTransactions(username);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return getTransactions(username);
  }
};

export const calculateSummary = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const expense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  return {
    totalIncome: income,
    totalExpense: expense,
    balance: income - expense
  };
};
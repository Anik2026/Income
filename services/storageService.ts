
import { Transaction, TransactionType, LiabilityCategory } from '../types';
import { supabase } from './supabaseClient';

// Separator for packing/unpacking person info in the note field
// This ensures compatibility with databases that don't have a 'person' column
const PERSON_SEPARATOR = ' || P:';

const prepareForDb = (transaction: any) => {
  const dbPayload = { ...transaction };
  
  // Pack person into note if present
  if (dbPayload.person) {
    dbPayload.note = (dbPayload.note || '') + PERSON_SEPARATOR + dbPayload.person;
    delete dbPayload.person;
  }
  
  // Ensure amount is number
  if (dbPayload.amount) {
    dbPayload.amount = Number(dbPayload.amount);
  }
  
  return dbPayload;
};

const parseFromDb = (transaction: any) => {
  const local = { ...transaction };
  
  // Unpack person from note
  if (local.note && local.note.includes(PERSON_SEPARATOR)) {
    const parts = local.note.split(PERSON_SEPARATOR);
    // The note is the first part, person is the last part (in case of multiple separators, though unlikely)
    // We'll just split by the last occurrence or strictly
    const personName = parts.pop();
    local.note = parts.join(PERSON_SEPARATOR); // Rejoin rest in case separator was in note text
    local.person = personName;
  }
  
  local.amount = Number(local.amount);
  return local;
};

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
    
    // Normalize data and unpack fields
    return (data || []).map(parseFromDb) as Transaction[];
  } catch (error) {
    console.error("Failed to load transactions:", error);
    return [];
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id'>, username: string): Promise<Transaction> => {
  try {
    const rawPayload = {
      ...transaction,
      username: username,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    };

    const dbPayload = prepareForDb(rawPayload);

    const { data, error } = await supabase
      .from('transactions')
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Supabase Save Error:", error);
      throw error;
    }

    return parseFromDb(data) as Transaction;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>, username: string): Promise<Transaction[]> => {
  try {
    const dbPayload = prepareForDb(updates);
    
    const { error } = await supabase
      .from('transactions')
      .update(dbPayload)
      .eq('id', id)
      .eq('username', username); // Ensure user owns the record

    if (error) {
      console.error("Supabase Update Error:", error);
      throw error;
    }
    
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
  let income = 0;
  let expense = 0;
  let balance = 0;
  let totalDebt = 0;
  let totalReceivable = 0;

  transactions.forEach(t => {
    const amount = Number(t.amount) || 0;
    
    if (t.type === TransactionType.INCOME) {
      income += amount;
      balance += amount;
    } else if (t.type === TransactionType.EXPENSE) {
      expense += amount;
      balance -= amount;
    } else if (t.type === TransactionType.LIABILITY) {
      // Handle Liabilities effect on Balance and Liability Totals
      if (t.category === LiabilityCategory.BORROW) {
        // Loan Taken: Cash increases, Debt increases
        balance += amount;
        totalDebt += amount;
      } else if (t.category === LiabilityCategory.REPAY) {
        // Repaying Loan: Cash decreases, Debt decreases
        balance -= amount;
        totalDebt -= amount;
      } else if (t.category === LiabilityCategory.LEND) {
        // Giving Loan: Cash decreases, Receivable increases
        balance -= amount;
        totalReceivable += amount;
      } else if (t.category === LiabilityCategory.COLLECT) {
        // Collecting Loan: Cash increases, Receivable decreases
        balance += amount;
        totalReceivable -= amount;
      }
    }
  });
  
  return {
    totalIncome: income,
    totalExpense: expense,
    balance: balance,
    totalDebt: totalDebt < 0 ? 0 : totalDebt, // prevent negative dust
    totalReceivable: totalReceivable < 0 ? 0 : totalReceivable
  };
};

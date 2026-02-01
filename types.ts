export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMethod {
  CASH = 'Cash',
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  BANK = 'Bank'
}

export enum IncomeSource {
  SALARY = 'Salary',
  BUSINESS = 'Business',
  SALE = 'Sale',
  OTHERS = 'Others'
}

export enum ExpenseCategory {
  FOOD = 'Food',
  RENT = 'Rent',
  TRANSPORT = 'Transport',
  BILL = 'Bill',
  SHOPPING = 'Shopping',
  OTHERS = 'Others'
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string; // Union of IncomeSource | ExpenseCategory
  amount: number;
  paymentMethod?: PaymentMethod; // Only for expenses
  note?: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export type Currency = 'USD' | 'BDT' | 'INR';
export type Language = 'en' | 'bn';

export interface User {
  username: string;
  isAuthenticated: boolean;
  avatarUrl?: string; // Optional profile picture URL
}
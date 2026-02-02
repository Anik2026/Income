
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  LIABILITY = 'LIABILITY'
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
  FREELANCING = 'Freelancing',
  INVESTMENT = 'Investment',
  GIFT = 'Gift',
  RENTAL = 'Rental',
  REFUND = 'Refund',
  OTHERS = 'Others'
}

export enum ExpenseCategory {
  FOOD = 'Food',
  RENT = 'Rent',
  TRANSPORT = 'Transport',
  BILL = 'Bill',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  EDUCATION = 'Education',
  ENTERTAINMENT = 'Entertainment',
  GROCERY = 'Grocery',
  TOILETRIES = 'Toiletries',
  INSURANCE = 'Insurance',
  DONATION = 'Donation',
  FAMILY = 'Family',
  OTHERS = 'Others'
}

export enum LiabilityCategory {
  BORROW = 'Borrow', // Taking a loan (Inflow)
  LEND = 'Lend',     // Giving a loan (Outflow)
  REPAY = 'Repay',   // Repaying a loan I took (Outflow)
  COLLECT = 'Collect' // Collecting money I lent (Inflow)
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string; // IncomeSource | ExpenseCategory | LiabilityCategory
  amount: number;
  paymentMethod?: PaymentMethod; // Only for expenses
  note?: string;
  person?: string; // Optional: To store who the loan is with
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalDebt: number;       // Amount I need to repay
  totalReceivable: number; // Amount others need to pay me
}

export type Currency = 'USD' | 'BDT' | 'INR';
export type Language = 'en' | 'bn';

export interface User {
  username: string;
  isAuthenticated: boolean;
  avatarUrl?: string; // Optional profile picture URL
}

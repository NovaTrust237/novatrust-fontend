export type UserRole = 'client' | 'admin';

export interface User {
  id?: number | string;
  name?: string | null;
  phone: string;
  role?: UserRole;
  balance: number;
  activated: number | boolean;
  has_invested?: boolean;
  investment_start_at?: string | null;
  investment_processed?: boolean;
  // legacy aliases tolerated by older components
  phoneNumber?: string;
  virtual_balance_cfa?: number;
  investment_start_time?: string | null;
  isActivated?: boolean;
  hasInvested?: boolean;
  investmentProcessed?: boolean;
}

export interface Transaction {
  id: number;
  type: string;
  amount_cfa: number;
  created_at: string;
  meta?: Record<string, any> | null;
}

export interface LoanApplication {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  amount_cfa: number;
  duration_months: number;
  interest_rate: number;
  monthly_payment_cfa: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string | null;
  created_at: string;
}

export interface GrantApplication {
  id: number;
  project_title: string;
  category: string;
  description: string;
  requested_amount_cfa: number;
  full_name: string;
  phone: string;
  email?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string | null;
  created_at: string;
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
}

export enum ModalType {
  NONE = 'NONE',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  ACTIVATE = 'ACTIVATE',
}

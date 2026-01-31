
export interface SiteConfig {
  monetagZoneId?: string;
  monetagDailyAdLimit?: number;
  monetagAdReward?: number;
  monetagAdTimer?: number;
  adexoraZoneId?: string;
  adexoraDailyAdLimit?: number;
  adexoraAdReward?: number;
  referralBonus?: number;
  referralCommissionPercentage?: number;
  minReferralsForWithdrawal?: number;
  supportLinks?: {
    channel: string;
    chat: string;
  };
  paymentMethods?: {
    [key: string]: {
      name: string;
      minWithdrawal: number;
    };
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  url: string;
  reward: number;
  category: 'youtube' | 'telegram' | 'facebook' | 'other';
}

export interface User {
  id: string;
  fullName: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalReferrals: number;
  adsWatchedMonetag: number;
  adsWatchedAdexora: number;
  createdAt: string;
  referredBy?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  method: string;
  account: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export enum Page {
  Dashboard = 'dashboard',
  Config = 'config',
  Tasks = 'tasks',
  Withdrawals = 'withdrawals',
  Users = 'users'
}

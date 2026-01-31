
import React from 'react';
import { SiteConfig, Task, User, WithdrawalRequest } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  config: SiteConfig | null;
  tasks: { [id: string]: Task };
  users: { [id: string]: User };
  withdrawals: { [id: string]: WithdrawalRequest };
}

const Dashboard: React.FC<DashboardProps> = ({ config, tasks, users, withdrawals }) => {
  // Fix: Explicitly cast to correct types to avoid 'unknown' errors when props are potentially empty objects
  const userList = Object.values(users || {}) as User[];
  const withdrawalList = Object.values(withdrawals || {}) as WithdrawalRequest[];
  const taskList = Object.values(tasks || {}) as Task[];

  const totalBalance = userList.reduce((sum, u) => sum + (u.balance || 0), 0);
  const totalEarned = userList.reduce((sum, u) => sum + (u.totalEarned || 0), 0);
  const pendingWithdrawals = withdrawalList.filter(w => w.status === 'pending');
  const totalWithdrawn = withdrawalList.filter(w => w.status === 'approved').reduce((sum, w) => sum + (w.amount || 0), 0);

  const stats = [
    { label: 'Total Users', value: userList.length, color: 'text-blue-600', bg: 'bg-blue-100', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Pending Requests', value: pendingWithdrawals.length, color: 'text-orange-600', bg: 'bg-orange-100', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Paid Out', value: `৳${totalWithdrawn.toFixed(2)}`, color: 'text-green-600', bg: 'bg-green-100', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Wallet Liability', value: `৳${totalBalance.toFixed(2)}`, color: 'text-purple-600', bg: 'bg-purple-100', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  // Dummy Chart Data
  const chartData = [
    { name: 'Active Tasks', count: taskList.length },
    { name: 'Users', count: userList.length },
    { name: 'Pending', count: pendingWithdrawals.length },
    { name: 'Approved', count: withdrawalList.filter(w => w.status === 'approved').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Platform Activity Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Config Snapshot</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Ad Reward</span>
              <span className="font-semibold text-slate-800">৳{config?.monetagAdReward || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Refer Bonus</span>
              <span className="font-semibold text-slate-800">৳{config?.referralBonus || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Min Referral W.D</span>
              <span className="font-semibold text-slate-800">{config?.minReferralsForWithdrawal || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Ref Commission</span>
              <span className="font-semibold text-slate-800">{config?.referralCommissionPercentage || 0}%</span>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            Check Server Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

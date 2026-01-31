
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../firebaseService';

interface UserManagerProps {
  users: { [id: string]: User };
}

const UserManager: React.FC<UserManagerProps> = ({ users }) => {
  const [search, setSearch] = useState('');
  
  // Fix: Explicitly cast u to User to resolve 'Spread types may only be created from object types' error
  const userList = Object.entries(users || {})
    .map(([id, u]) => ({ id, ...(u as User) }))
    .filter(u => 
      u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
      u.id?.toLowerCase().includes(search.toLowerCase())
    );

  const handleAdjustBalance = async (userId: string, currentBalance: number) => {
    const amountStr = window.prompt(`Current Balance: ৳${currentBalance}. Enter NEW balance:`, currentBalance.toString());
    if (amountStr !== null) {
      const amount = parseFloat(amountStr);
      if (!isNaN(amount)) {
        await dbService.updateUserBalance(userId, amount);
      } else {
        alert('Invalid amount');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">User Directory ({userList.length})</h2>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Balance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Earnings</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Refers</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ads (M/A)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                userList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tight">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">৳{(user.balance || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-green-600 font-semibold">৳{(user.totalEarned || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{user.totalReferrals || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{user.adsWatchedMonetag || 0} / {user.adsWatchedAdexora || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAdjustBalance(user.id, user.balance || 0)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Adjust Balance
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;

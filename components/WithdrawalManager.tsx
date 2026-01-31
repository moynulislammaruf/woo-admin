
import React, { useState } from 'react';
import { WithdrawalRequest, User } from '../types';
import { dbService } from '../firebaseService';

interface WithdrawalManagerProps {
  withdrawals: { [id: string]: WithdrawalRequest };
  users: { [id: string]: User };
}

const WithdrawalManager: React.FC<WithdrawalManagerProps> = ({ withdrawals, users }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  
  // Fix: Explicitly cast w to WithdrawalRequest to resolve 'Spread types may only be created from object types' error
  const withdrawalList = Object.entries(withdrawals || {})
    .map(([id, w]) => ({ id, ...(w as WithdrawalRequest) }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredList = filter === 'all' ? withdrawalList : withdrawalList.filter(w => w.status === filter);

  const handleAction = async (id: string, status: string) => {
    if (window.confirm(`Are you sure you want to mark this as ${status}?`)) {
      await dbService.updateWithdrawalStatus(id, status);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this request entry? (Balance will not be refunded automatically)')) {
      await dbService.deleteWithdrawal(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Withdrawal Requests</h2>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Account</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">No withdrawal requests found for this filter.</td>
                </tr>
              ) : (
                filteredList.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {w.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{w.userName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{w.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{w.method}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                      {w.account}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-600">৳{w.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        w.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                        w.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(w.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {w.status === 'pending' && (
                          <>
                            <button onClick={() => handleAction(w.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Approve">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </button>
                            <button onClick={() => handleAction(w.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Reject">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDelete(w.id)} className="p-2 text-slate-300 hover:text-red-600 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
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

export default WithdrawalManager;

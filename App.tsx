
import React, { useState, useEffect } from 'react';
import { dbService } from './firebaseService';
import { Page, SiteConfig, Task, User, WithdrawalRequest } from './types';
import Dashboard from './components/Dashboard';
import ConfigEditor from './components/ConfigEditor';
import TaskManager from './components/TaskManager';
import WithdrawalManager from './components/WithdrawalManager';
import UserManager from './components/UserManager';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [tasks, setTasks] = useState<{ [id: string]: Task }>({});
  const [users, setUsers] = useState<{ [id: string]: User }>({});
  const [withdrawals, setWithdrawals] = useState<{ [id: string]: WithdrawalRequest }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubConfig = dbService.getConfig(setConfig);
    const unsubTasks = dbService.getTasks(setTasks);
    const unsubUsers = dbService.getUsers(setUsers);
    const unsubWithdrawals = dbService.getWithdrawals(setWithdrawals);

    // Initial load check
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      unsubConfig();
      unsubTasks();
      unsubUsers();
      unsubWithdrawals();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Initializing Admin Engine...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard config={config} tasks={tasks} users={users} withdrawals={withdrawals} />;
      case Page.Config:
        return <ConfigEditor config={config} />;
      case Page.Tasks:
        return <TaskManager tasks={tasks} />;
      case Page.Withdrawals:
        return <WithdrawalManager withdrawals={withdrawals} users={users} />;
      case Page.Users:
        return <UserManager users={users} />;
      default:
        return <Dashboard config={config} tasks={tasks} users={users} withdrawals={withdrawals} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activePage.replace('-', ' ')}</h1>
            <p className="text-slate-500">Woo Market Central Management System</p>
          </div>
          <div className="hidden md:block">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Admin Active</span>
          </div>
        </header>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;

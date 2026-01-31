
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, push, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCuTvFEENJAMSbiGEMjitJnJehLy445V74",
  authDomain: "wooo-876dc.firebaseapp.com",
  databaseURL: "https://wooo-876dc-default-rtdb.firebaseio.com",
  projectId: "wooo-876dc",
  storageBucket: "wooo-876dc.firebasestorage.app",
  messagingSenderId: "87289879438",
  appId: "1:87289879438:web:c96b80828fd7b6f83722df"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const dbService = {
  // Config
  getConfig: (callback: (data: any) => void) => {
    return onValue(ref(db, 'config'), (snapshot) => callback(snapshot.val()));
  },
  updateConfig: (data: any) => update(ref(db, 'config'), data),

  // Tasks
  getTasks: (callback: (data: any) => void) => {
    return onValue(ref(db, 'tasks'), (snapshot) => callback(snapshot.val()));
  },
  addTask: (task: any) => push(ref(db, 'tasks'), task),
  updateTask: (id: string, task: any) => update(ref(db, `tasks/${id}`), task),
  deleteTask: (id: string) => remove(ref(db, `tasks/${id}`)),

  // Users
  getUsers: (callback: (data: any) => void) => {
    return onValue(ref(db, 'users'), (snapshot) => callback(snapshot.val()));
  },
  updateUserBalance: (userId: string, newBalance: number) => update(ref(db, `users/${userId}`), { balance: newBalance }),

  // Withdrawals
  getWithdrawals: (callback: (data: any) => void) => {
    return onValue(ref(db, 'withdrawal_requests'), (snapshot) => callback(snapshot.val()));
  },
  updateWithdrawalStatus: (id: string, status: string) => update(ref(db, `withdrawal_requests/${id}`), { status }),
  deleteWithdrawal: (id: string) => remove(ref(db, `withdrawal_requests/${id}`))
};

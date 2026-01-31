
import React, { useState } from 'react';
import { Task } from '../types';
import { dbService } from '../firebaseService';

interface TaskManagerProps {
  tasks: { [id: string]: Task };
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '', description: '', url: '', reward: 0, category: 'telegram'
  });

  // Fix: Explicitly cast task to resolve 'Spread types may only be created from object types' error
  const taskList = Object.entries(tasks || {}).map(([id, task]) => ({ id, ...(task as Task) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await dbService.updateTask(editingId, formData);
    } else {
      await dbService.addTask(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', description: '', url: '', reward: 0, category: 'telegram' });
  };

  const openEdit = (task: any) => {
    setEditingId(task.id);
    setFormData(task);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dbService.deleteTask(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Available Tasks ({taskList.length})</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskList.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-2xl">
                  {task.category === 'youtube' ? '📺' : task.category === 'telegram' ? '✈️' : task.category === 'facebook' ? '👥' : '⭐'}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(task)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.364 5.636l-3.536 3.536m3.536-3.536L15.172 3.828M18.364 5.636l-3.536 3.536" /></svg>
                </button>
                <button onClick={() => handleDelete(task.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h4>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{task.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-green-600 font-bold">৳{task.reward}</span>
              <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-1 rounded-md">{task.category}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingId ? 'Edit Task' : 'Create New Task'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Reward (৳)</label>
                  <input required type="number" step="0.01" value={formData.reward} onChange={e => setFormData({...formData, reward: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="telegram">Telegram</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">URL</label>
                <input required type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;


import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import { dbService } from '../firebaseService';

interface ConfigEditorProps {
  config: SiteConfig | null;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({ config }) => {
  const [formData, setFormData] = useState<SiteConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev!,
        [parent]: {
          ...(prev as any)[parent],
          [child]: val
        }
      }));
    } else {
      setFormData(prev => ({ ...prev!, [name]: val }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.updateConfig(formData);
      setSuccessMsg('Configurations updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Error updating config');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Ad Settings (Monetag & Adexora)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Monetag Zone ID</label>
                <input type="text" name="monetagZoneId" value={formData.monetagZoneId || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Ad Reward (৳)</label>
                <input type="number" step="0.01" name="monetagAdReward" value={formData.monetagAdReward || 0} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Daily Ad Limit</label>
                <input type="number" name="monetagDailyAdLimit" value={formData.monetagDailyAdLimit || 0} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Adexora Zone ID</label>
                <input type="text" name="adexoraZoneId" value={formData.adexoraZoneId || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              Referral Program
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Referral Bonus (৳)</label>
                <input type="number" step="0.01" name="referralBonus" value={formData.referralBonus || 0} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Commission (%)</label>
                <input type="number" name="referralCommissionPercentage" value={formData.referralCommissionPercentage || 0} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Min Referrals for W.D</label>
                <input type="number" name="minReferralsForWithdrawal" value={formData.minReferralsForWithdrawal || 0} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Support Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Telegram Channel</label>
                <input type="text" name="supportLinks.channel" value={formData.supportLinks?.channel || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Contact Admin Link</label>
                <input type="text" name="supportLinks.chat" value={formData.supportLinks?.chat || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>

          {successMsg && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 font-medium">
              {successMsg}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              disabled={isSaving}
              type="submit"
              className={`px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Saving Changes...' : 'Save Global Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConfigEditor;

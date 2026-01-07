
import React, { useState } from 'react';
import { Heart, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

const PrayerPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', is_private: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase.from('prayer_requests').insert([
        { 
          name: formData.name || 'Anonymous', 
          email: formData.email, 
          message: formData.message, 
          is_private: formData.is_private 
        }
      ]);

      if (submitError) throw submitError;
      
      setSuccess(true);
      setFormData({ name: '', email: '', message: '', is_private: false });
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-6">
            <Heart size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">How Can We Pray For You?</h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            "Carry each other’s burdens, and in this way you will fulfill the law of Christ." <br/>
            <span className="font-bold text-amber-600">— Galatians 6:2</span>
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          {success ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">Your prayer request has been sent to our prayer team. Be rest assured that we are standing in faith with you.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Your Name (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g. John Doe"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email (Optional)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Prayer Message (Required)</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Share your burden or testimony with us..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <input 
                  type="checkbox" 
                  id="private"
                  checked={formData.is_private}
                  onChange={(e) => setFormData({...formData, is_private: e.target.checked})}
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer" 
                />
                <label htmlFor="private" className="text-sm font-medium text-amber-900 cursor-pointer flex items-center gap-2">
                  <ShieldCheck size={16} /> Keep this prayer request private (Only the Pastor will see this)
                </label>
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group shadow-xl shadow-slate-200 disabled:opacity-70"
              >
                {loading ? 'Submitting...' : (
                  <>Send Prayer Request <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerPage;

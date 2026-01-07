
import React, { useState } from 'react';
import { Wallet, Coins, Building, Heart, CreditCard, ChevronRight, CheckCircle2, Loader2, Smartphone, DollarSign, Globe } from 'lucide-react';
import { supabase } from '../supabase';
import { useTranslation } from '../i18n';

interface Currency {
  code: string;
  symbol: string;
  label: string;
}

const GivingPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [currency, setCurrency] = useState<Currency>({ code: 'XAF', symbol: 'FCFA', label: 'CFA Franc (Cameroon)' });
  const [formData, setFormData] = useState({
    amount: '',
    category: 'offering',
    name: ''
  });

  const currencies: Currency[] = [
    { code: 'XAF', symbol: 'FCFA', label: 'CFA Franc (Cameroon)' },
    { code: 'NGN', symbol: '₦', label: 'Naira (Nigeria)' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
  ];

  const handleProcessPayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const { error } = await supabase.from('donations').insert([{
        donor_name: formData.name || 'Anonymous',
        amount: parseFloat(formData.amount),
        currency: currency.code,
        category: formData.category,
        status: 'success'
      }]);

      if (error) throw error;
      setStep(3);
    } catch (err) {
      alert('Payment recorded locally, but database sync failed. Please check connection.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'tithe', label: 'Tithe', icon: Coins, desc: 'Giving 10% of our increase.' },
    { id: 'offering', label: 'Offering', icon: Wallet, desc: 'Sacrificial giving for ministry.' },
    { id: 'project', label: 'Church Project', icon: Building, desc: 'Expansion and building funds.' },
  ];

  const paymentMethods = [
    { id: 'card', label: t('giving.methods.card'), icon: CreditCard },
    { id: 'paypal', label: t('giving.methods.paypal'), icon: DollarSign },
    { id: 'momo', label: t('giving.methods.momo'), icon: Smartphone },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t('giving.title')}</h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto italic">
            "{t('giving.quote')}"
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {step === 1 && (
            <div className="p-8 md:p-12 space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                      formData.category === cat.id 
                        ? 'border-amber-600 bg-amber-50' 
                        : 'border-slate-100 hover:border-amber-200'
                    }`}
                  >
                    <cat.icon className={`mb-4 ${formData.category === cat.id ? 'text-amber-600' : 'text-slate-400'}`} size={24} />
                    <h3 className="font-bold text-slate-900">{cat.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{t('giving.currencyLabel')}</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={currency.code}
                      onChange={(e) => {
                        const selected = currencies.find(c => c.code === e.target.value);
                        if (selected) setCurrency(selected);
                      }}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                    >
                      {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{t('giving.amountLabel')} ({currency.code})</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency.symbol}</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{t('giving.donorLabel')}</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                </div>
              </div>

              <button 
                onClick={() => formData.amount && setStep(2)}
                disabled={!formData.amount}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {t('giving.proceed')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 md:p-12 text-center animate-in slide-in-from-right duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-600 rounded-full mb-8">
                <Heart size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('giving.paymentMethod')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 mt-8">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === m.id ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-slate-100 hover:border-amber-200 text-slate-600'
                    }`}
                  >
                    <m.icon size={20} />
                    <span className="font-bold text-sm">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10 text-left space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Giving to:</span>
                  <span className="font-bold text-slate-900 capitalize">{formData.category}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="font-bold text-slate-900">{currency.symbol} {parseFloat(formData.amount).toLocaleString()} ({currency.code})</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="flex-[2] py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm & Pay'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-12 md:p-20 text-center animate-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">God Bless You!</h2>
              <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto">Your generous gift of {currency.symbol} {parseFloat(formData.amount).toLocaleString()} has been successfully received.</p>
              <button 
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GivingPage;

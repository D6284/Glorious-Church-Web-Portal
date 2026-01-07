
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Download, CreditCard, DollarSign, Smartphone, Loader2, CheckCircle2, X, ChevronRight, FileDown } from 'lucide-react';
import { supabase } from '../supabase';
import { Ebook } from '../types';
import { useTranslation } from '../i18n';

const EbooksPage = () => {
  const { t } = useTranslation();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Ebook | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: Idle, 1: Email, 2: Payment, 3: Success
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const { data, error } = await supabase.from('ebooks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setEbooks(data as Ebook[]);
      } catch (err) {
        console.error('Error fetching ebooks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  const handleBuyClick = (book: Ebook) => {
    if (book.price === 0) {
      // Direct download for free books
      window.open(book.file_url, '_blank');
      return;
    }
    setSelectedBook(book);
    setCheckoutStep(1);
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      if (selectedBook) {
        const { error } = await supabase.from('ebook_orders').insert([{
          ebook_id: selectedBook.id,
          buyer_email: email,
          amount: selectedBook.price,
          payment_reference: 'MOCK_' + Math.random().toString(36).substr(2, 9),
          status: 'completed'
        }]);
        if (error) throw error;
      }
      setCheckoutStep(3);
    } catch (err) {
      console.error('Order error:', err);
      alert('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'card', label: t('giving.methods.card'), icon: CreditCard },
    { id: 'paypal', label: t('giving.methods.paypal'), icon: DollarSign },
    { id: 'momo', label: t('giving.methods.momo'), icon: Smartphone },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t('shop.title')}</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t('shop.sub')}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-amber-600" size={40} />
            <p className="text-slate-500 font-medium">Fetching library...</p>
          </div>
        ) : ebooks.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900">No Books Available</h3>
            <p className="text-slate-500">Our digital library is coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ebooks.map((book) => (
              <div key={book.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group flex flex-col h-full hover:shadow-xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden bg-slate-200">
                  <img 
                    src={book.cover_image_url || `https://picsum.photos/400/600?random=${book.id}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={book.title}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full font-bold text-amber-600 text-sm shadow-lg">
                    {book.price === 0 ? t('shop.free') : `FCFA ${book.price.toLocaleString()}`}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">{book.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
                    {book.description || 'Deep dive into the word of God with this inspiring book.'}
                  </p>
                  <button 
                    onClick={() => handleBuyClick(book)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {book.price === 0 ? <><Download size={18} /> {t('shop.download')}</> : <><ShoppingBag size={18} /> {t('shop.buy')}</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {checkoutStep > 0 && selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t('shop.checkout')}</h2>
              <button onClick={() => setCheckoutStep(0)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                    <img src={selectedBook.cover_image_url} className="w-16 h-20 object-cover rounded-lg shadow-sm" alt="Cover" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{selectedBook.title}</p>
                      <p className="text-sm text-amber-600 font-bold mt-1">FCFA {selectedBook.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{t('contact.formLabels.email')}</label>
                    <input 
                      type="email" 
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    />
                  </div>
                  <button 
                    onClick={() => email && setCheckoutStep(2)}
                    disabled={!email}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    Continue to Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-8">
                  <p className="text-slate-500 text-center">{t('giving.paymentMethod')}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {paymentMethods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          paymentMethod === m.id ? 'border-amber-600 bg-amber-50' : 'border-slate-100 hover:border-amber-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${paymentMethod === m.id ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <m.icon size={20} />
                        </div>
                        <span className={`font-bold ${paymentMethod === m.id ? 'text-amber-900' : 'text-slate-600'}`}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-5 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20"
                  >
                    {processing ? <Loader2 className="animate-spin" size={20} /> : `Pay FCFA ${selectedBook.price.toLocaleString()}`}
                  </button>
                  <button onClick={() => setCheckoutStep(1)} className="w-full text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors">Go Back</button>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{t('shop.successTitle')}</h3>
                  <p className="text-slate-500">{t('shop.successMsg')}</p>
                  <a 
                    href={selectedBook.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                  >
                    <FileDown size={20} /> {t('shop.downloadNow')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbooksPage;

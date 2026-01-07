
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, BookOpen, Calendar, Tv, LayoutDashboard, Heart, Coins, ChevronRight, Globe, MessageCircle, ShoppingBag } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import SermonsPage from './pages/SermonsPage';
import EventsPage from './pages/EventsPage';
import LivePage from './pages/LivePage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import PrayerPage from './pages/PrayerPage';
import GivingPage from './pages/GivingPage';
import EbooksPage from './pages/EbooksPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { supabase } from './supabase';
import { LanguageProvider, useTranslation } from './i18n';

const WhatsAppButton = () => {
  const churchNumber = "2348001234567"; // Replace with real church number
  const message = encodeURIComponent("Hello Glorious Church, I would like to inquire about...");
  const url = `https://wa.me/${churchNumber}?text=${message}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[60] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center animate-bounce duration-[2000ms]"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
    </a>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: <Home size={18} /> },
    { name: t('nav.about'), path: '/about', icon: <Info size={18} /> },
    { name: t('nav.sermons'), path: '/sermons', icon: <BookOpen size={18} /> },
    { name: t('nav.events'), path: '/events', icon: <Calendar size={18} /> },
    { name: t('nav.live'), path: '/live', icon: <Tv size={18} /> },
    { name: t('nav.shop'), path: '/shop', icon: <ShoppingBag size={18} /> },
    { name: t('nav.prayer'), path: '/prayer', icon: <Heart size={18} /> },
    { name: t('nav.giving'), path: '/giving', icon: <Coins size={18} /> },
  ];

  if (isAdminPath) return null;

  return (
    <nav className="fixed w-full z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-amber-600 p-2 rounded-lg group-hover:bg-amber-700 transition-colors">
              <span className="text-white font-bold text-xl">GC</span>
            </div>
            <div className="flex flex-col">
              <span className="brand-font font-bold text-xl text-slate-900 leading-tight">Glorious Church</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-700 font-semibold">Experiencing God's Presence</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1 lg:space-x-3 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  location.pathname === link.path 
                    ? 'text-amber-700 bg-amber-50' 
                    : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 ml-4 px-2 py-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${language === 'en' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('fr')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all ${language === 'fr' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'}`}
              >
                FR
              </button>
            </div>

            <Link to="/admin/login" className="ml-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
              <LayoutDashboard size={14} /> {t('nav.portal')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="p-2 text-slate-500 hover:text-amber-600"
            >
              <Globe size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-amber-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden glass border-b border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50"
              >
                {link.icon} {link.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-900 bg-amber-100 mt-4"
            >
              <LayoutDashboard size={18} /> {t('nav.portal')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-amber-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">GC</span>
              </div>
              <span className="brand-font font-bold text-2xl text-white">Glorious Church</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Dedicated to spreading the love of Christ and building a community of believers rooted in the word of God.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Service Times</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex justify-between"><span>Sunday Worship</span> <span>9:00 AM</span></li>
              <li className="flex justify-between"><span>Mid-week Prayer</span> <span>6:30 PM</span></li>
              <li className="flex justify-between"><span>Youth Night</span> <span>Friday 7:00 PM</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/prayer" className="hover:text-amber-500 transition-colors">{t('nav.prayer')}</Link></li>
              <li><Link to="/giving" className="hover:text-amber-500 transition-colors">{t('nav.giving')}</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest updates.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full text-sm focus:ring-2 focus:ring-amber-500" />
              <button className="bg-amber-600 px-4 py-2 rounded-r-lg hover:bg-amber-700 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Glorious Church. All rights reserved. Built with love.
        </div>
      </div>
    </footer>
  );
};

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const session = supabase.auth.getSession();
  return session ? <>{children}</> : <Navigate to="/admin/login" />;
};

const App = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <WhatsAppButton />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sermons" element={<SermonsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/prayer" element={<PrayerPage />} />
              <Route path="/giving" element={<GivingPage />} />
              <Route path="/shop" element={<EbooksPage />} />
              
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;

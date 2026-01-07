
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, MapPin, Heart, ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation } from '../i18n';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Church Worship"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-600/20 text-amber-400 text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm border border-amber-500/30">
            {t('landing.welcome')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            {t('landing.heroTitle')} <br/>
            <span className="text-amber-500 italic">{t('landing.heroSub')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('landing.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/live" className="px-8 py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20">
              <Play fill="white" size={18} /> {t('landing.joinLive')}
            </Link>
            <Link to="/about" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all">
              {t('landing.newHere')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2"><MapPin size={16} /> {t('landing.location')}</div>
          <div className="flex items-center gap-2"><Calendar size={16} /> Sun: 9:00 AM</div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-amber-200 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('landing.visionTitle')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('landing.visionDesc')}</p>
            </div>
            
            <div className="p-10 rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-900/20 md:-mt-8 md:mb-8">
              <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-6">
                <Calendar size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('landing.upcomingEvents')}</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">{t('landing.upcomingDesc')}</p>
              <Link to="/events" className="text-amber-400 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                {t('landing.seeCalendar')} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-amber-200 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Bible Study</h3>
              <p className="text-slate-600 leading-relaxed">Diving deep into the scriptures every Wednesday. Join us to grow in knowledge and wisdom.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

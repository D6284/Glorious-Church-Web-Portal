
import React from 'react';
import { Camera, PlayCircle } from 'lucide-react';

const GalleryPage = () => {
  const categories = ['All', 'Worship', 'Youth', 'Community', 'Outreach'];
  
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Gallery</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Moments of joy, worship, and fellowship captured in time.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button key={cat} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${idx === 0 ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-600'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div key={i} className="relative group rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all break-inside-avoid">
              <img 
                src={`https://picsum.photos/800/${i % 2 === 0 ? '1000' : '600'}?random=gallery${i}`} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Church Life"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 text-white mb-2">
                  {i % 3 === 0 ? <PlayCircle size={20} className="text-amber-500" /> : <Camera size={20} className="text-amber-500" />}
                  <span className="font-bold text-sm uppercase tracking-widest">Worship Service</span>
                </div>
                <p className="text-slate-300 text-xs">May {i + 5}, 2024 • Main Sanctuary</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;


import React, { useState, useEffect } from 'react';
import { Play, FileText, Share2, Search, Filter, BookOpen } from 'lucide-react';
import { supabase } from '../supabase';
import { Sermon } from '../types';

const SermonsPage = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const { data, error } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false });
        if (error) throw error;
        if (data) setSermons(data as Sermon[]);
      } catch (err) {
        console.error('Error fetching sermons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  const filteredSermons = sermons.filter(sermon => 
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Latest Sermons</h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Revisit the messages that inspired us. Access video recordings, audio podcasts, and downloadable sermon notes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sermons by title, topic or speaker..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="text-slate-500 font-medium">Loading message library...</p>
          </div>
        ) : filteredSermons.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl mb-6">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Sermons Found</h3>
            <p className="text-slate-500">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
                <div className="relative h-56">
                  <img 
                    src={sermon.image_url || `https://picsum.photos/600/400?random=${sermon.id}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={sermon.title}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button className="w-14 h-14 bg-amber-600 text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                      <Play fill="white" size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
                    <span>{sermon.preacher}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-slate-400">{new Date(sermon.sermon_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">
                    {sermon.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {sermon.content || 'Join us as we explore this powerful message from the word of God.'}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-4">
                      {sermon.notes_url && (
                        <a href={sermon.notes_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Download Notes">
                          <FileText size={20} />
                        </a>
                      )}
                      <button className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Share Sermon">
                        <Share2 size={20} />
                      </button>
                    </div>
                    <button className="text-slate-900 font-bold text-sm flex items-center gap-1 hover:text-amber-600 transition-colors">
                      {sermon.video_url ? 'Watch Now' : 'Listen Now'} <Play size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SermonsPage;

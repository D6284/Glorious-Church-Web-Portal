
import React, { useState, useEffect } from 'react';
import { Heart, Target, Lightbulb, Users, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { Leader } from '../types';

const AboutPage = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data, error } = await supabase
          .from('leaders')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        if (data) setLeaders(data);
      } catch (err) {
        console.error('Error fetching leaders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <div className="pt-24 animate-in fade-in duration-700">
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Our Story</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From a small prayer meeting to a global family in Kumba, Cameroon, the Glorious Church journey is a testament to God's faithfulness and power.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* Mission/Vision Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 rounded-[3rem] bg-amber-50 border border-amber-100">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-8">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-700 leading-relaxed italic">
                "To lead people into a growing relationship with Jesus Christ through gospel-centered community and worship."
              </p>
            </div>
            <div className="p-12 rounded-[3rem] bg-slate-900 text-white">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-8">
                <Lightbulb size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-lg text-slate-300 leading-relaxed italic">
                "To see a world transformed by the grace of God, where every tribe and tongue finds a home in the kingdom."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Leadership</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Meet the visionary leaders dedicated to serving the Glorious Church community in Kumba and beyond.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-amber-600" size={40} />
              <p className="text-slate-400 font-medium">Loading leadership team...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((leader) => (
                <div key={leader.id} className="group text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative mb-6 overflow-hidden rounded-[2rem] h-96 shadow-lg shadow-slate-200">
                    <img 
                      src={leader.image_url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={leader.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-8">
                      <p className="text-white text-sm font-medium italic">Servant of the Most High</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {leader.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-4 bg-amber-200"></span>
                    <p className="text-amber-600 text-sm font-bold uppercase tracking-widest">
                      {leader.role}
                    </p>
                    <span className="h-px w-4 bg-amber-200"></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

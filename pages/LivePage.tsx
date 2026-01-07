
import React, { useState, useEffect } from 'react';
import { Tv, Share2, Users, MessageCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { LiveStream } from '../types';

const LivePage = () => {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data, error } = await supabase.from('live_streams').select('*').eq('is_live', true).limit(1);
        if (error) throw error;
        if (data && data.length > 0) setStream(data[0] as LiveStream);
      } catch (err) {
        console.error('Error fetching live stream:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStream();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Area */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {stream ? (
                    <>
                      <div className="absolute inset-0 bg-red-500 animate-ping rounded-full opacity-75"></div>
                      <div className="relative h-3 w-3 bg-red-500 rounded-full"></div>
                    </>
                  ) : (
                    <div className="relative h-3 w-3 bg-slate-600 rounded-full"></div>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {stream ? `LIVE NOW: ${stream.title}` : 'OFFLINE: Stay Tuned'}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-1"><Users size={16} className="text-red-500" /> 1.2K watching</span>
                <button className="flex items-center gap-1 hover:text-white transition-colors"><Share2 size={16} /> Share</button>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/50 border border-slate-800">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
              ) : stream ? (
                <iframe 
                  className="w-full h-full"
                  src={stream.embed_url}
                  title="Live Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <Tv size={64} className="text-slate-800 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Service is currently offline</h2>
                  <p className="text-slate-500 max-w-md">Join us every Sunday at 9:00 AM for our live broadcast. You can also watch previous messages on our Sermons page.</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-4">About this Broadcast</h3>
              <p className="text-slate-400 leading-relaxed">
                Join us for our main worship service. Today we are exploring the depth of God's love and how it transforms our daily lives. If you have prayer requests, please feel free to share them in the chat.
              </p>
              <div className="mt-8 flex gap-4">
                <button className="px-6 py-3 bg-amber-600 rounded-xl font-bold hover:bg-amber-700 transition-all">Support Ministry</button>
                <button className="px-6 py-3 bg-slate-700 rounded-xl font-bold hover:bg-slate-600 transition-all">Prayer Request</button>
              </div>
            </div>
          </div>

          {/* Sidebar Chat Mockup */}
          <div className="lg:w-1/4">
            <div className="h-full min-h-[500px] flex flex-col bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                <MessageCircle size={18} className="text-amber-500" />
                <span className="font-bold">Live Interaction</span>
              </div>
              <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[600px]">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex gap-3 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <img src={`https://i.pravatar.cc/100?u=chat${i}`} className="w-8 h-8 rounded-lg shrink-0" alt="User" />
                    <div>
                      <p className="text-xs font-bold text-slate-400">User_{i}</p>
                      <p className="text-sm text-slate-200">Blessings to everyone watching! Feeling the presence of God today.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-900">
                <div className="flex gap-2">
                  <input type="text" placeholder="Say something..." className="bg-slate-800 border-none rounded-lg px-4 py-2 w-full text-sm focus:ring-1 focus:ring-amber-500" />
                  <button className="bg-amber-600 p-2 rounded-lg"><Share2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;


import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Users, Heart, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../supabase';
import { ChurchEvent } from '../types';

const EventsPage = () => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
        if (error) throw error;
        if (data) setEvents(data as ChurchEvent[]);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Upcoming Events</h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Stay connected with our community. Join us for these upcoming gatherings and special events.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="text-slate-500 font-medium">Loading upcoming events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl mb-6">
              <CalendarIcon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Scheduled Events</h3>
            <p className="text-slate-500">Check back soon for upcoming services and programs.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row hover:shadow-xl transition-all duration-300">
                <div className="md:w-1/3 h-64 md:h-auto relative">
                  <img 
                    src={event.image_url || `https://picsum.photos/600/400?random=${event.id}`} 
                    className="w-full h-full object-cover" 
                    alt={event.title} 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-center shadow-lg">
                    <span className="block text-2xl font-bold text-amber-600">{new Date(event.event_date).getDate()}</span>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                      {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">{event.title}</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3 text-slate-500">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-600">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Time</p>
                          <p className="text-sm font-semibold">{event.event_time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-600">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                          <p className="text-sm font-semibold">{event.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <img key={i} src={`https://i.pravatar.cc/100?u=${i + event.id}`} className="w-8 h-8 rounded-full border-2 border-white" alt="Attendee" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-500">
                        <Users size={14} className="inline mr-1" /> {event.rsvp_count || 0}+ attending
                      </span>
                    </div>
                    <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                      <Heart size={18} /> RSVP Now
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

export default EventsPage;

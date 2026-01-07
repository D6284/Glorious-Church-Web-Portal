
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';
import { Post, ChurchEvent, LiveStream } from './types';

// Supabase Credentials - Priority given to environment variables for Netlify/Production
const SUPABASE_URL = (typeof process !== 'undefined' && process.env.SUPABASE_URL) 
  || 'https://dphjqrmqnsjkhrxofzlh.supabase.co';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) 
  || 'sb_publishable_cStsfXehFUBbG5ZeFJlmhw_5FZ0snFu';

// Initialize the real Supabase Client
const realClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Supabase Wrapper:
 * Handles Authentication and Table access.
 * Only admins can write/delete, public can read (handled via RLS policies in Supabase).
 */
export const supabase = {
  auth: {
    signIn: async (email: string, password?: string) => {
      const { data, error } = await realClient.auth.signInWithPassword({ 
        email, 
        password: password || '' 
      });
      
      if (!error && data.session) {
        localStorage.setItem('church_session', JSON.stringify(data.session));
      }
      return { data, error };
    },
    signOut: async () => {
      const { error } = await realClient.auth.signOut();
      localStorage.removeItem('church_session');
      return { error };
    },
    getSession: () => {
      const session = localStorage.getItem('church_session');
      return session ? JSON.parse(session) : null;
    }
  },
  from: (table: string) => realClient.from(table),
  storage: realClient.storage
};

// Mock data for initial hydration or dev reference
export const mockData = {
  posts: [
    { id: '1', title: 'The Power of Faith', content: 'Faith is the substance of things hoped for...', type: 'sermon', author: 'Apostle Divine', created_at: new Date().toISOString(), is_published: true, media_url: 'https://picsum.photos/800/400?random=1' },
  ] as Post[],
  events: [
    { id: '1', title: 'Sunday Worship Service', description: 'Main service at Faingo Sanctuary', event_date: '2024-05-20', event_time: '09:00 AM', location: 'Kumba (Faingo)', image_url: 'https://picsum.photos/600/400?random=10', rsvp_count: 120, created_at: new Date().toISOString() },
  ] as ChurchEvent[],
};

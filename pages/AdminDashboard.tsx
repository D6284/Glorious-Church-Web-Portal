
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Calendar, Tv, Image, Settings, 
  Plus, Search, LogOut, Bell, User, BarChart, ExternalLink, Trash2, Edit,
  Heart, Coins, ShieldCheck, Eye, EyeOff, ShoppingBag, BookOpen, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabase';
import { PrayerRequest, Donation, Ebook, EbookOrder, Post, ChurchEvent } from '../types';

const StatsCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+{change}%</span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

const Overview = () => {
  const [counts, setCounts] = useState({ posts: 0, events: 0, donations: 0, ebooks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [p, e, d, b] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('donations').select('amount'),
        supabase.from('ebooks').select('id', { count: 'exact' })
      ]);
      
      const totalDonations = d.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      setCounts({
        posts: p.count || 0,
        events: e.count || 0,
        donations: totalDonations,
        ebooks: b.count || 0
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', views: 400 },
    { name: 'Tue', views: 700 },
    { name: 'Wed', views: 600 },
    { name: 'Thu', views: 900 },
    { name: 'Fri', views: 1100 },
    { name: 'Sat', views: 1400 },
    { name: 'Sun', views: 2400 },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Posts" value={counts.posts} change="12" icon={FileText} color="bg-blue-600" />
        <StatsCard title="Upcoming Events" value={counts.events} change="5" icon={Calendar} color="bg-amber-600" />
        <StatsCard title="Donations (FCFA)" value={counts.donations.toLocaleString()} change="40" icon={Coins} color="bg-green-600" />
        <StatsCard title="Digital Books" value={counts.ebooks} change="8" icon={ShoppingBag} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Traffic Stats</h3>
              <p className="text-slate-400 text-sm">Site engagement from Kumba & Diaspora</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Recent Activities</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Heart size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold">New Prayer Request</p>
                <p className="text-xs text-slate-500">Anonymous sender from Faingo</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Just now</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ShoppingBag size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold">eBook Purchased</p>
                <p className="text-xs text-slate-500">New order for 'The Grace of Kumba'</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrayerManager = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayers = async () => {
      const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
      if (data) setPrayers(data);
      setLoading(false);
    };
    fetchPrayers();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-2xl font-bold">Prayer Requests</h3>
        <p className="text-slate-400 text-sm">Review requests from the congregation.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Sender</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Message</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></td></tr> : prayers.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-5">
                  <p className="font-bold">{p.name || 'Anonymous'}</p>
                  <p className="text-xs text-slate-400">{p.email}</p>
                </td>
                <td className="px-8 py-5 text-sm text-slate-600 line-clamp-1">{p.message}</td>
                <td className="px-8 py-5">
                  {p.is_private ? <span className="text-red-500 flex items-center gap-1 text-xs font-bold"><EyeOff size={14}/> Private</span> : <span className="text-green-500 flex items-center gap-1 text-xs font-bold"><Eye size={14}/> Public</span>}
                </td>
                <td className="px-8 py-5 text-sm text-slate-400">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Sermons', icon: BookOpen, path: '/admin/sermons' },
    { label: 'Events', icon: Calendar, path: '/admin/events' },
    { label: 'Ebooks', icon: ShoppingBag, path: '/admin/shop' },
    { label: 'Prayers', icon: Heart, path: '/admin/prayers' },
    { label: 'Donations', icon: Coins, path: '/admin/donations' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2 rounded-lg"><span className="text-white font-bold text-xl">GC</span></div>
            <span className="brand-font font-bold text-xl text-slate-900">Glorious Portal</span>
          </div>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}>
                <item.icon size={20} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-white border-b border-slate-100 h-20 px-8 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
          <div className="flex items-center gap-4">
            <Link to="/" target="_blank" className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><ExternalLink size={20} /></Link>
            <div className="h-10 w-px bg-slate-100 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Administrator</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Kumba Branch</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-amber-600">AD</div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="prayers" element={<PrayerManager />} />
            <Route path="/" element={<Overview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

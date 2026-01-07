
export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'sermon';
  author: string;
  media_url?: string;
  created_at: string;
  is_published: boolean;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  rsvp_count: number;
  created_at: string;
}

export interface LiveStream {
  id: string;
  platform: 'YouTube' | 'Facebook';
  embed_url: string;
  is_live: boolean;
  title: string;
  created_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  audio_url?: string;
  video_url?: string;
  notes_url?: string;
  image_url?: string;
  content?: string;
  created_at: string;
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  price: number;
  cover_image_url: string;
  file_url: string;
  created_at: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  image_url: string;
  display_order: number;
}

export interface EbookOrder {
  id: string;
  ebook_id: string;
  buyer_email: string;
  amount: number;
  payment_reference: string;
  status: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  full_name: string;
}

export interface PrayerRequest {
  id: string;
  name?: string;
  email?: string;
  message: string;
  is_private: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name?: string;
  amount: number;
  category: 'tithe' | 'offering' | 'project';
  status: string;
  created_at: string;
}

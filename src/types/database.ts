export type UserRole = 'user' | 'developer';
export type AppStatus = 'published' | 'draft' | 'suspended';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Developer {
  id: string;
  user_id: string;
  company_name: string | null;
  website: string | null;
  bio: string | null;
  support_email: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

export interface App {
  id: string;
  developer_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  icon_url: string | null;
  manifest_url: string | null;
  website_url: string | null;
  privacy_policy_url: string | null;
  support_url: string | null;
  category_id: string | null;
  tags: string[];
  status: AppStatus;
  is_featured: boolean;
  pwa_offline: boolean;
  pwa_push_notifications: boolean;
  pwa_installable: boolean;
  view_count: number;
  install_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  developer?: Developer;
  screenshots?: AppScreenshot[];
  average_rating?: number;
  review_count?: number;
}

export interface AppScreenshot {
  id: string;
  app_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  app_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  helpful_count: number;
  developer_response: string | null;
  developer_response_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  app_id: string;
  created_at: string;
  app?: App;
}

export interface AppHistory {
  id: string;
  user_id: string;
  app_id: string;
  action_type: 'view' | 'install';
  created_at: string;
  app?: App;
}

export interface AnalyticsEvent {
  id: string;
  app_id: string;
  event_type: 'view' | 'install' | 'favorite';
  source: 'search' | 'category' | 'featured' | 'trending' | 'direct' | 'share' | null;
  country: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  total_views: number;
  total_installs: number;
  total_favorites: number;
  views_by_date: { date: string; count: number }[];
  installs_by_date: { date: string; count: number }[];
  sources: { source: string; count: number }[];
  countries: { country: string; count: number }[];
}
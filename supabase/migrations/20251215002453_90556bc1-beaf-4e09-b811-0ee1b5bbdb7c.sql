-- Create enums for roles and app status
CREATE TYPE public.user_role AS ENUM ('user', 'developer');
CREATE TYPE public.app_status AS ENUM ('published', 'draft', 'suspended');

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create developers table for developer-specific info
CREATE TABLE public.developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  website TEXT,
  bio TEXT,
  support_email TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create apps table
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  icon_url TEXT,
  manifest_url TEXT,
  website_url TEXT,
  privacy_policy_url TEXT,
  support_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  tags TEXT[] DEFAULT '{}',
  status app_status NOT NULL DEFAULT 'published',
  is_featured BOOLEAN DEFAULT false,
  pwa_offline BOOLEAN DEFAULT false,
  pwa_push_notifications BOOLEAN DEFAULT false,
  pwa_installable BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create app_screenshots table
CREATE TABLE public.app_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  developer_response TEXT,
  developer_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(app_id, user_id)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, app_id)
);

-- Create app_history table (installations/views)
CREATE TABLE public.app_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'install')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create analytics_events table for developer analytics
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'install', 'favorite')),
  source TEXT CHECK (source IN ('search', 'category', 'featured', 'trending', 'direct', 'share')),
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_apps_category ON public.apps(category_id);
CREATE INDEX idx_apps_developer ON public.apps(developer_id);
CREATE INDEX idx_apps_status ON public.apps(status);
CREATE INDEX idx_apps_featured ON public.apps(is_featured) WHERE is_featured = true;
CREATE INDEX idx_reviews_app ON public.reviews(app_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_app_history_user ON public.app_history(user_id);
CREATE INDEX idx_analytics_app ON public.analytics_events(app_id);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Developers policies
CREATE POLICY "Developers are viewable by everyone" ON public.developers FOR SELECT USING (true);
CREATE POLICY "Users can create developer profile" ON public.developers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Developers can update own profile" ON public.developers FOR UPDATE USING (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Apps policies
CREATE POLICY "Published apps are viewable by everyone" ON public.apps FOR SELECT USING (status = 'published');
CREATE POLICY "Developers can view own apps" ON public.apps FOR SELECT USING (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can insert apps" ON public.apps FOR INSERT WITH CHECK (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can update own apps" ON public.apps FOR UPDATE USING (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can delete own apps" ON public.apps FOR DELETE USING (
  developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
);

-- Screenshots policies
CREATE POLICY "Screenshots are viewable for published apps" ON public.app_screenshots FOR SELECT USING (
  app_id IN (SELECT id FROM public.apps WHERE status = 'published')
);
CREATE POLICY "Developers can manage screenshots" ON public.app_screenshots FOR ALL USING (
  app_id IN (SELECT id FROM public.apps WHERE developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid()))
);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- App history policies
CREATE POLICY "Users can view own history" ON public.app_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add history" ON public.app_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics policies (developers can view their app analytics)
CREATE POLICY "Developers can view own app analytics" ON public.analytics_events FOR SELECT USING (
  app_id IN (SELECT id FROM public.apps WHERE developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid()))
);
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON public.apps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, description) VALUES
('Games', 'games', 'Gamepad2', 'Fun and entertaining games'),
('Productivity', 'productivity', 'Briefcase', 'Tools to boost your productivity'),
('Social', 'social', 'Users', 'Connect with others'),
('Entertainment', 'entertainment', 'Film', 'Music, videos, and more'),
('Utilities', 'utilities', 'Wrench', 'Handy utility apps'),
('Education', 'education', 'GraduationCap', 'Learn something new'),
('Business', 'business', 'Building2', 'Business and finance tools'),
('Lifestyle', 'lifestyle', 'Heart', 'Health, fitness, and lifestyle');

-- Create storage buckets for app assets
INSERT INTO storage.buckets (id, name, public) VALUES ('app-icons', 'app-icons', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('app-screenshots', 'app-screenshots', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "App icons are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'app-icons');
CREATE POLICY "App screenshots are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'app-screenshots');
CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload app icons" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'app-icons' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'app-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
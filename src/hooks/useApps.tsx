import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { App, Category, Review, Favorite } from '@/types/database';
import { useAuth } from './useAuth';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useFeaturedApps() {
  return useQuery({
    queryKey: ['apps', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*),
          developer:developers(*, profile:profiles(*))
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .limit(6);
      
      if (error) throw error;
      return data as App[];
    },
  });
}

export function useTrendingApps() {
  return useQuery({
    queryKey: ['apps', 'trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*),
          developer:developers(*, profile:profiles(*))
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data as App[];
    },
  });
}

export function useNewApps() {
  return useQuery({
    queryKey: ['apps', 'new'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*),
          developer:developers(*, profile:profiles(*))
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data as App[];
    },
  });
}

export function useAppsByCategory(categorySlug: string | undefined) {
  return useQuery({
    queryKey: ['apps', 'category', categorySlug],
    queryFn: async () => {
      if (!categorySlug) return [];

      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (!category) return [];

      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*),
          developer:developers(*, profile:profiles(*))
        `)
        .eq('status', 'published')
        .eq('category_id', category.id)
        .order('view_count', { ascending: false });
      
      if (error) throw error;
      return data as App[];
    },
    enabled: !!categorySlug,
  });
}

export function useSearchApps(query: string) {
  return useQuery({
    queryKey: ['apps', 'search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*),
          developer:developers(*, profile:profiles(*))
        `)
        .eq('status', 'published')
        .or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20);
      
      if (error) throw error;
      return data as App[];
    },
    enabled: query.length >= 2,
  });
}

export function useApp(slug: string | undefined) {
  return useQuery({
    queryKey: ['app', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          category:categories(*),
          developer:developers(*, profile:profiles(*)),
          screenshots:app_screenshots(*)
        `)
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data as App | null;
    },
    enabled: !!slug,
  });
}

export function useAppReviews(appId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', appId],
    queryFn: async () => {
      if (!appId) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('app_id', appId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!appId,
  });
}

export function useUserFavorites() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          app:apps(*, category:categories(*), developer:developers(*, profile:profiles(*)))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ appId, isFavorite }: { appId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('app_id', appId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, app_id: appId });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ appId, rating, title, content }: { appId: string; rating: number; title?: string; content?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reviews')
        .upsert({
          app_id: appId,
          user_id: user.id,
          rating,
          title,
          content,
        }, { onConflict: 'app_id,user_id' });
      
      if (error) throw error;
    },
    onSuccess: (_, { appId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', appId] });
    },
  });
}

export function useRecordAnalytics() {
  return useMutation({
    mutationFn: async ({ appId, eventType, source }: { appId: string; eventType: 'view' | 'install' | 'favorite'; source?: string }) => {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          app_id: appId,
          event_type: eventType,
          source: source || 'direct',
        });
      
      if (error) throw error;
    },
  });
}
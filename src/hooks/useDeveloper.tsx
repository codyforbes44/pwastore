import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { App, AppHistory, AnalyticsSummary } from '@/types/database';
import { useAuth } from './useAuth';

export function useDeveloperApps() {
  const { developer } = useAuth();

  return useQuery({
    queryKey: ['developer-apps', developer?.id],
    queryFn: async () => {
      if (!developer) return [];

      const { data, error } = await supabase
        .from('apps')
        .select(`*, category:categories(*), screenshots:app_screenshots(*)`)
        .eq('developer_id', developer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as App[];
    },
    enabled: !!developer,
  });
}

export function useDeveloperAnalytics(appId: string | undefined) {
  const { developer } = useAuth();

  return useQuery({
    queryKey: ['developer-analytics', appId],
    queryFn: async () => {
      if (!appId || !developer) return null;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('app_id', appId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      const views = events.filter(e => e.event_type === 'view');
      const installs = events.filter(e => e.event_type === 'install');
      const favorites = events.filter(e => e.event_type === 'favorite');

      // Group by date
      const groupByDate = (items: typeof events) => {
        const grouped: Record<string, number> = {};
        items.forEach(item => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          grouped[date] = (grouped[date] || 0) + 1;
        });
        return Object.entries(grouped).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
      };

      // Group by source
      const sources = events.reduce((acc, e) => {
        const source = e.source || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by country
      const countries = events.reduce((acc, e) => {
        const country = e.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total_views: views.length,
        total_installs: installs.length,
        total_favorites: favorites.length,
        views_by_date: groupByDate(views),
        installs_by_date: groupByDate(installs),
        sources: Object.entries(sources).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
        countries: Object.entries(countries).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count),
      } as AnalyticsSummary;
    },
    enabled: !!appId && !!developer,
  });
}

export function useAppHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['app-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('app_history')
        .select(`*, app:apps(*, category:categories(*))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AppHistory[];
    },
    enabled: !!user,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();
  const { developer } = useAuth();

  return useMutation({
    mutationFn: async (appData: {
      name: string;
      slug: string;
      tagline?: string;
      description?: string;
      icon_url?: string;
      manifest_url?: string;
      website_url?: string;
      privacy_policy_url?: string;
      support_url?: string;
      category_id?: string;
      tags?: string[];
      pwa_offline?: boolean;
      pwa_push_notifications?: boolean;
      pwa_installable?: boolean;
    }) => {
      if (!developer) throw new Error('Not a developer');

      const { data, error } = await supabase
        .from('apps')
        .insert({ ...appData, developer_id: developer.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-apps'] });
    },
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...appData }: { id: string } & Partial<App>) => {
      const { data, error } = await supabase
        .from('apps')
        .update(appData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['developer-apps'] });
      queryClient.invalidateQueries({ queryKey: ['app', data.slug] });
    },
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('apps').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-apps'] });
    },
  });
}

export function useRecordView() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ appId, source }: { appId: string; source?: string }) => {
      // Record analytics event
      await supabase.from('analytics_events').insert({
        app_id: appId,
        event_type: 'view',
        source: source || 'direct',
      });

      // Record to history if logged in
      if (user) {
        await supabase.from('app_history').insert({
          user_id: user.id,
          app_id: appId,
          action_type: 'view',
        });
      }
    },
  });
}

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ExternalLink, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { AppGrid } from '@/components/apps/AppGrid';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Developer, App } from '@/types/database';

export default function DeveloperPublicProfile() {
  const { id } = useParams<{ id: string }>();

  const { data: developer, isLoading: devLoading } = useQuery({
    queryKey: ['developer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('*, profile:profiles(*)')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Developer | null;
    },
    enabled: !!id,
  });

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['developer-public-apps', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apps')
        .select('*, category:categories(*)')
        .eq('developer_id', id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as App[];
    },
    enabled: !!id,
  });

  if (devLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-40 rounded-xl mb-8" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!developer) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Developer not found</h1>
          <Button asChild><Link to="/browse">Browse Apps</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
        </Button>

        <div className="p-6 rounded-xl bg-card border border-border/50 mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={developer.profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {developer.company_name?.charAt(0) || developer.profile?.full_name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">
                  {developer.company_name || developer.profile?.full_name || 'Developer'}
                </h1>
                {developer.is_verified && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              {developer.bio && (
                <p className="text-muted-foreground mb-4">{developer.bio}</p>
              )}
              <div className="flex items-center gap-3">
                {developer.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={developer.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" /> Website
                    </a>
                  </Button>
                )}
                {developer.support_email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${developer.support_email}`}>
                      <Mail className="h-4 w-4 mr-1" /> Contact
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Apps by this Developer</h2>
        <AppGrid apps={apps || []} loading={appsLoading} columns={4} />
      </div>
    </Layout>
  );
}

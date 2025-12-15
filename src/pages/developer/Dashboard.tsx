import { Link } from 'react-router-dom';
import { Plus, Eye, Download, Heart, Star, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/developer/StatsCard';
import { AppListItem } from '@/components/developer/AppListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useDeveloperApps, useDeleteApp } from '@/hooks/useDeveloper';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

function DashboardContent() {
  const { data: apps, isLoading } = useDeveloperApps();
  const { mutate: deleteApp } = useDeleteApp();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalViews = apps?.reduce((sum, app) => sum + app.view_count, 0) || 0;
  const totalInstalls = apps?.reduce((sum, app) => sum + app.install_count, 0) || 0;

  const handleDelete = () => {
    if (!deleteId) return;
    deleteApp(deleteId, {
      onSuccess: () => {
        toast({ title: 'App deleted' });
        setDeleteId(null);
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to delete app', variant: 'destructive' });
      },
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-muted-foreground">Manage your apps and view analytics</p>
          </div>
          <Button asChild className="gradient-primary shadow-glow">
            <Link to="/developer/submit"><Plus className="mr-2 h-4 w-4" /> Submit App</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Apps" value={apps?.length || 0} icon={TrendingUp} />
          <StatsCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} />
          <StatsCard title="Total Installs" value={totalInstalls.toLocaleString()} icon={Download} />
          <StatsCard title="Published" value={apps?.filter(a => a.status === 'published').length || 0} icon={Star} />
        </div>

        {/* Apps List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Apps</h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : apps && apps.length > 0 ? (
            <div className="space-y-3">
              {apps.map(app => (
                <AppListItem key={app.id} app={app} onDelete={setDeleteId} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Plus}
              title="No apps yet"
              description="Submit your first PWA to get started"
              actionLabel="Submit App"
              actionLink="/developer/submit"
            />
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete App?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your app and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

export default function DeveloperDashboard() {
  return (
    <ProtectedRoute requireDeveloper>
      <DashboardContent />
    </ProtectedRoute>
  );
}

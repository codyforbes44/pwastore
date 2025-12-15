import { App } from '@/types/database';
import { AppCard } from './AppCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AppGridProps {
  apps: App[];
  loading?: boolean;
  variant?: 'default' | 'featured' | 'compact';
  columns?: 2 | 3 | 4;
}

export function AppGrid({ apps, loading, variant = 'default', columns = 4 }: AppGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-card border border-border/50">
            <Skeleton className="aspect-video md:aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No apps found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {apps.map((app) => (
        <AppCard key={app.id} app={app} variant={variant} />
      ))}
    </div>
  );
}
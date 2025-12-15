import { App } from '@/types/database';
import { AppCard } from './AppCard';
import { AppCardSkeleton } from '@/components/common/AppCardSkeleton';

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
          <div key={i} className={`opacity-0 animate-scale-in stagger-${Math.min(i + 1, 8)}`}>
            <AppCardSkeleton variant={variant} />
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
      {apps.map((app, i) => (
        <div 
          key={app.id} 
          className={`opacity-0 animate-scale-in stagger-${Math.min(i + 1, 8)}`}
        >
          <AppCard app={app} variant={variant} />
        </div>
      ))}
    </div>
  );
}

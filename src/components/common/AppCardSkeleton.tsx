import { cn } from '@/lib/utils';

interface AppCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact';
}

export function AppCardSkeleton({ variant = 'default' }: AppCardSkeletonProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden bg-card border border-border/50",
        isFeatured && "md:flex md:items-stretch",
        isCompact && "flex items-center gap-4 p-3"
      )}
    >
      {/* Icon skeleton */}
      <div className={cn(
        "relative overflow-hidden bg-secondary flex-shrink-0",
        isFeatured ? "md:w-48 aspect-square md:aspect-auto" : "",
        isCompact ? "w-14 h-14 rounded-lg" : "aspect-video md:aspect-square",
        !isCompact && "p-6 flex items-center justify-center"
      )}>
        <div className={cn(
          "bg-muted rounded-2xl animate-shimmer",
          isCompact ? "w-full h-full rounded-lg" : "w-20 h-20"
        )} 
        style={{ 
          backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
          backgroundSize: '200% 100%'
        }}
        />
      </div>

      {/* Content skeleton */}
      <div className={cn("flex-1 min-w-0", !isCompact && "p-4")}>
        <div className={cn(
          "bg-muted rounded animate-shimmer mb-2",
          isCompact ? "h-4 w-24" : "h-5 w-3/4"
        )} 
        style={{ 
          backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
          backgroundSize: '200% 100%'
        }}
        />
        
        {!isCompact && (
          <>
            <div 
              className="bg-muted rounded h-4 w-full mb-1 animate-shimmer"
              style={{ 
                backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
                backgroundSize: '200% 100%',
                animationDelay: '0.1s'
              }}
            />
            <div 
              className="bg-muted rounded h-4 w-2/3 mb-3 animate-shimmer"
              style={{ 
                backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
                backgroundSize: '200% 100%',
                animationDelay: '0.2s'
              }}
            />
            <div className="flex gap-2">
              <div 
                className="bg-muted rounded h-6 w-16 animate-shimmer"
                style={{ 
                  backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
                  backgroundSize: '200% 100%',
                  animationDelay: '0.3s'
                }}
              />
              <div 
                className="bg-muted rounded h-6 w-20 animate-shimmer"
                style={{ 
                  backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
                  backgroundSize: '200% 100%',
                  animationDelay: '0.4s'
                }}
              />
            </div>
          </>
        )}
        
        {isCompact && (
          <div 
            className="bg-muted rounded h-3 w-16 animate-shimmer"
            style={{ 
              backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--muted-foreground) / 0.1), transparent)',
              backgroundSize: '200% 100%',
              animationDelay: '0.1s'
            }}
          />
        )}
      </div>
    </div>
  );
}

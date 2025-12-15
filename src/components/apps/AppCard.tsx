import { Link } from 'react-router-dom';
import { Star, Download, Heart } from 'lucide-react';
import { App } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: App;
  variant?: 'default' | 'featured' | 'compact';
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function AppCard({ app, variant = 'default', isFavorite, onToggleFavorite }: AppCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <Link
      to={`/app/${app.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300",
        "bg-card border border-border/50",
        "hover:border-primary/30 hover:shadow-glow",
        isFeatured && "md:flex md:items-stretch",
        isCompact && "flex items-center gap-4 p-3"
      )}
    >
      {/* App Icon */}
      <div className={cn(
        "relative overflow-hidden bg-secondary flex-shrink-0",
        isFeatured ? "md:w-48 aspect-square md:aspect-auto" : "",
        isCompact ? "w-14 h-14 rounded-lg" : "aspect-video md:aspect-square",
        !isCompact && "p-6 flex items-center justify-center"
      )}>
        {app.icon_url ? (
          <img
            src={app.icon_url}
            alt={app.name}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isCompact ? "w-full h-full rounded-lg" : "w-20 h-20 rounded-2xl shadow-lg"
            )}
          />
        ) : (
          <div className={cn(
            "gradient-primary flex items-center justify-center",
            isCompact ? "w-full h-full rounded-lg" : "w-20 h-20 rounded-2xl shadow-lg"
          )}>
            <span className="text-primary-foreground font-bold text-2xl">
              {app.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {app.is_featured && !isCompact && (
          <Badge className="absolute top-3 left-3 gradient-primary border-0">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 min-w-0",
        !isCompact && "p-4"
      )}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={cn(
            "font-semibold truncate group-hover:text-primary transition-colors",
            isCompact ? "text-sm" : "text-base"
          )}>
            {app.name}
          </h3>
          {onToggleFavorite && !isCompact && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite();
              }}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-primary text-primary")} />
            </Button>
          )}
        </div>

        {!isCompact && app.tagline && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {app.tagline}
          </p>
        )}

        {isCompact && app.category && (
          <p className="text-xs text-muted-foreground truncate">
            {app.category.name}
          </p>
        )}

        {!isCompact && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {app.average_rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>{app.average_rating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{app.install_count.toLocaleString()}</span>
            </div>
            {app.category && (
              <Badge variant="secondary" className="text-xs">
                {app.category.name}
              </Badge>
            )}
          </div>
        )}

        {/* PWA Badges */}
        {!isCompact && (app.pwa_offline || app.pwa_push_notifications || app.pwa_installable) && (
          <div className="flex gap-2 mt-3">
            {app.pwa_installable && (
              <Badge variant="outline" className="text-xs border-success/30 text-success">
                Installable
              </Badge>
            )}
            {app.pwa_offline && (
              <Badge variant="outline" className="text-xs border-info/30 text-info">
                Offline
              </Badge>
            )}
            {app.pwa_push_notifications && (
              <Badge variant="outline" className="text-xs border-warning/30 text-warning">
                Push
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
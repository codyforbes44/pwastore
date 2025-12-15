import { Link } from 'react-router-dom';
import { Star, Download, Heart, Share2 } from 'lucide-react';
import { App } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface AppCardProps {
  app: App;
  variant?: 'default' | 'featured' | 'compact';
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function AppCard({ app, variant = 'default', isFavorite, onToggleFavorite }: AppCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/app/${app.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: app.name,
          text: app.tagline || `Check out ${app.name} on PWA Store`,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Link
      to={`/app/${app.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300",
        "bg-card border border-border/50",
        "hover:border-primary/30 hover:shadow-glow hover-lift",
        isFeatured && "md:flex md:items-stretch",
        isCompact && "flex items-center gap-4 p-3"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            loading="lazy"
            className={cn(
              "object-cover transition-transform duration-500",
              isCompact ? "w-full h-full rounded-lg" : "w-20 h-20 rounded-2xl shadow-lg",
              isHovered && "scale-110"
            )}
          />
        ) : (
          <div className={cn(
            "gradient-primary flex items-center justify-center transition-transform duration-500",
            isCompact ? "w-full h-full rounded-lg" : "w-20 h-20 rounded-2xl shadow-lg",
            isHovered && "scale-110"
          )}>
            <span className="text-primary-foreground font-bold text-2xl">
              {app.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {app.is_featured && !isCompact && (
          <Badge className="absolute top-3 left-3 gradient-primary border-0 shadow-lg">
            Featured
          </Badge>
        )}

        {/* Quick Actions Overlay */}
        {!isCompact && (onToggleFavorite || true) && (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2",
            isHovered && "opacity-100"
          )}>
            {onToggleFavorite && (
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-card/90 backdrop-blur-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite();
                }}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-primary text-primary")} />
              </Button>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-card/90 backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 min-w-0",
        !isCompact && "p-4"
      )}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={cn(
            "font-semibold truncate transition-colors duration-300",
            isCompact ? "text-sm" : "text-base",
            isHovered && "text-primary"
          )}>
            {app.name}
          </h3>
          {onToggleFavorite && !isCompact && !isHovered && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                <span className="font-medium text-foreground">{app.average_rating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{app.install_count?.toLocaleString() || 0}</span>
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
          <div className="flex gap-2 mt-3 flex-wrap">
            {app.pwa_installable && (
              <Badge variant="outline" className="text-xs border-success/30 text-success bg-success/5">
                Installable
              </Badge>
            )}
            {app.pwa_offline && (
              <Badge variant="outline" className="text-xs border-info/30 text-info bg-info/5">
                Offline
              </Badge>
            )}
            {app.pwa_push_notifications && (
              <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/5">
                Push
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

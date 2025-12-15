import { Link } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, ExternalLink, BarChart2 } from 'lucide-react';
import { App } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppListItemProps {
  app: App;
  onDelete?: (id: string) => void;
}

export function AppListItem({ app, onDelete }: AppListItemProps) {
  const statusColors = {
    published: 'bg-success/10 text-success border-success/30',
    draft: 'bg-warning/10 text-warning border-warning/30',
    suspended: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
        {app.icon_url ? (
          <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">{app.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold truncate">{app.name}</h3>
          <Badge variant="outline" className={statusColors[app.status]}>
            {app.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{app.tagline}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>{app.view_count.toLocaleString()} views</span>
          <span>{app.install_count.toLocaleString()} installs</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/app/${app.slug}`}>
              <ExternalLink className="mr-2 h-4 w-4" /> View App
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/developer/edit/${app.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/developer/analytics/${app.id}`}>
              <BarChart2 className="mr-2 h-4 w-4" /> Analytics
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(app.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

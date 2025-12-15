import { Link } from 'react-router-dom';
import { ExternalLink, Mail, CheckCircle } from 'lucide-react';
import { Developer } from '@/types/database';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DeveloperCardProps {
  developer: Developer;
  showLink?: boolean;
}

export function DeveloperCard({ developer, showLink = true }: DeveloperCardProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={developer.profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {developer.company_name?.charAt(0) || developer.profile?.full_name?.charAt(0) || 'D'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">
              {developer.company_name || developer.profile?.full_name || 'Developer'}
            </span>
            {developer.is_verified && (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
          </div>
          {developer.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{developer.bio}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {developer.website && (
          <Button variant="outline" size="sm" asChild>
            <a href={developer.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Website
            </a>
          </Button>
        )}
        {developer.support_email && (
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${developer.support_email}`}>
              <Mail className="h-3.5 w-3.5 mr-1" /> Contact
            </a>
          </Button>
        )}
        {showLink && (
          <Button variant="ghost" size="sm" asChild className="ml-auto">
            <Link to={`/developer/${developer.id}`}>View All Apps</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

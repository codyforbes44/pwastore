import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Review } from '@/types/database';
import { StarRating } from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/50">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {review.profile?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium truncate">
              {review.profile?.full_name || 'Anonymous'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold mb-1">{review.title}</h4>
      )}

      {review.content && (
        <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
      )}

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Helpful ({review.helpful_count})
        </Button>
      </div>

      {review.developer_response && (
        <div className="mt-4 p-3 rounded-lg bg-secondary/50 border-l-2 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Developer Response</span>
          </div>
          <p className="text-sm text-muted-foreground">{review.developer_response}</p>
        </div>
      )}
    </div>
  );
}

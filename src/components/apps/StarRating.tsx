import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const partial = index === Math.floor(rating) && rating % 1 > 0;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(index)}
            className={cn(
              "relative transition-transform",
              interactive && "hover:scale-110 cursor-pointer disabled:cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled ? "fill-warning text-warning" : "text-muted-foreground/30",
                interactive && "hover:text-warning"
              )}
            />
            {partial && (
              <Star
                className={cn(
                  sizeClasses[size],
                  "absolute inset-0 fill-warning text-warning",
                  "clip-path-[inset(0_50%_0_0)]"
                )}
                style={{ clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
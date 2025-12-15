import { Review } from '@/types/database';
import { StarRating } from './StarRating';

interface RatingBreakdownProps {
  reviews: Review[];
}

export function RatingBreakdown({ reviews }: RatingBreakdownProps) {
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="flex gap-8 items-start">
      <div className="text-center">
        <div className="text-5xl font-bold mb-2">{avgRating.toFixed(1)}</div>
        <StarRating rating={avgRating} size="md" />
        <div className="text-sm text-muted-foreground mt-1">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {distribution.map(({ star, count }) => {
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm w-4">{star}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

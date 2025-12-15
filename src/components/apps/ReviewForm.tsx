import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from './StarRating';
import { useSubmitReview } from '@/hooks/useApps';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  appId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ appId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { mutate: submitReview, isPending } = useSubmitReview();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }

    submitReview(
      { appId, rating, title: title || undefined, content: content || undefined },
      {
        onSuccess: () => {
          toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
          setRating(0);
          setTitle('');
          setContent('');
          onSuccess?.();
        },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl bg-card border border-border/50">
      <div>
        <Label className="mb-2 block">Your Rating</Label>
        <StarRating rating={rating} size="lg" interactive onRatingChange={setRating} />
      </div>

      <div>
        <Label htmlFor="reviewTitle">Title (optional)</Label>
        <Input
          id="reviewTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="reviewContent">Review (optional)</Label>
        <Textarea
          id="reviewContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this app..."
          rows={4}
          maxLength={1000}
        />
      </div>

      <Button type="submit" disabled={isPending || rating === 0} className="gradient-primary">
        {isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}

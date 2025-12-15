import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AppScreenshot } from '@/types/database';
import { cn } from '@/lib/utils';

interface ScreenshotGalleryProps {
  screenshots: AppScreenshot[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sorted = [...screenshots].sort((a, b) => a.sort_order - b.sort_order);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => setSelectedIndex((i) => (i !== null ? (i + 1) % sorted.length : 0));
  const goPrev = () => setSelectedIndex((i) => (i !== null ? (i - 1 + sorted.length) % sorted.length : 0));

  if (sorted.length === 0) return null;

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {sorted.map((screenshot, index) => (
          <button
            key={screenshot.id}
            onClick={() => openLightbox(index)}
            className="flex-shrink-0 rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
          >
            <img
              src={screenshot.image_url}
              alt={`Screenshot ${index + 1}`}
              className="h-40 w-auto object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </Button>

            {sorted.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                  onClick={goPrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                  onClick={goNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {selectedIndex !== null && (
              <img
                src={sorted[selectedIndex].image_url}
                alt={`Screenshot ${selectedIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}

            {sorted.length > 1 && (
              <div className="flex justify-center gap-2 p-4">
                {sorted.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === selectedIndex ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { Image, Sparkles } from "lucide-react";

interface ProgressiveImageCarouselProps {
  storyId: string | null;
  imageUrls: string[];
  status: string | null;
  totalImages?: number;
}

export function ProgressiveImageCarousel({ 
  storyId, 
  imageUrls = [], 
  status,
  totalImages = 5 
}: ProgressiveImageCarouselProps) {
  // Create fixed slots for all images (memoized to prevent re-renders)
  const imageSlots = useMemo(() => {
    return Array.from({ length: totalImages }, (_, index) => ({
      index,
      url: imageUrls[index] || null,
      isLoading: index >= imageUrls.length && (status === 'gen_image' || status === 'pending' || status === 'gen_audio'),
    }));
  }, [imageUrls, status, totalImages]);

  const isGenerating = status === 'gen_image' || status === 'gen_audio' || status === 'pending';
  const hasSomeImages = imageUrls.length > 0;

  return (
    <Card className="border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Story Illustrations</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              {imageUrls.length} / {totalImages} ready
            </div>
          </div>

          {/* Carousel */}
          <Carousel className="w-full">
            <CarouselContent>
              {imageSlots.map((slot) => (
                <CarouselItem key={slot.index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-2">
                    <CardContent className="p-2">
                      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
                        {slot.url && storyId ? (
                          <img
                            src={`/api/audio/${storyId}?asset=image&index=${slot.index}`}
                            alt={`Story illustration ${slot.index + 1}`}
                            className="w-full h-full object-cover"
                            data-testid={`img-story-${slot.index}`}
                          />
                        ) : slot.isLoading ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Skeleton className="w-full h-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-primary/30 animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Image className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasSomeImages && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>

          {/* Status Messages */}
          {isGenerating && imageUrls.length < totalImages && (
            <p className="text-sm text-center text-muted-foreground">
              Creating magical illustrations... This may take a few minutes.
            </p>
          )}
          
          {status === 'gen_image_partial' && (
            <p className="text-sm text-center text-yellow-600 dark:text-yellow-400">
              Some illustrations couldn't be generated, but your story is ready to enjoy!
            </p>
          )}
          
          {status === 'failed_image' && (
            <p className="text-sm text-center text-destructive">
              Illustrations couldn't be generated, but your audio story is ready!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

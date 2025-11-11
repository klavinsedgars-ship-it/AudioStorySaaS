import { Card, CardContent } from "@/components/ui/card";
import { MagicalLoading } from "@/components/MagicalLoading";
import { BookOpen } from "lucide-react";
import { AudioStatusPanel } from "@/components/AudioStatusPanel";
import { ProgressiveImageCarousel } from "@/components/ProgressiveImageCarousel";

interface StorybookPreviewProps {
  storyText: string | null;
  isLoading: boolean;
  heroName: string;
  // New props for real-time generation tracking
  storyId?: string | null;
  status?: string | null;
  audioPath?: string | null;
  imageUrls?: string[];
  isPolling?: boolean;
}

export function StorybookPreview({ 
  storyText, 
  isLoading, 
  heroName,
  storyId,
  status,
  audioPath,
  imageUrls = [],
  isPolling = false,
}: StorybookPreviewProps) {
  // Derive display state from finite-state map
  const getDisplayState = () => {
    if (!storyText && !isLoading) return 'empty';
    if (isLoading && !status) return 'generating_text';
    if (storyText && !status) return 'preview_ready';
    if (status === 'pending' || status === 'gen_audio') return 'gen_audio';
    if (status === 'gen_image' && audioPath) return 'gen_image';
    if (status === 'gen_image_partial') return 'gen_image_partial';
    if (status === 'complete') return 'complete';
    if (status === 'failed_audio') return 'failed_audio';
    if (status === 'failed_image') return 'failed_image';
    if (audioPath && !status) return 'audio_ready';
    return 'preview_ready';
  };

  const displayState = getDisplayState();
  const hasGenerationStarted = status && status !== 'preview_ready';

  return (
    <Card 
      className="border-2 shadow-2xl overflow-hidden bg-gradient-to-br from-[hsl(38,77%,98%)] to-[hsl(38,60%,96%)] dark:from-[hsl(240,20%,18%)] dark:to-[hsl(240,15%,16%)]"
      data-testid="card-storybook-preview"
    >
      <CardContent className="p-8 min-h-[500px] flex flex-col">
        {/* Empty State */}
        {displayState === 'empty' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <BookOpen className="w-24 h-24 text-primary/30" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/5 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display text-muted-foreground">
                Your story is waiting to be written...
              </h3>
              <p className="text-sm text-muted-foreground/70 max-w-sm">
                Fill in the details on the left and let the magic begin!
              </p>
            </div>
          </div>
        )}

        {/* Loading State (Text Generation) */}
        {displayState === 'generating_text' && (
          <div className="flex-1 flex items-center justify-center">
            <MagicalLoading message="Asking the moon for a story..." />
          </div>
        )}

        {/* Story Text Display (all states except empty and text loading) */}
        {storyText && (
          <div className="flex-1 flex flex-col space-y-6">
            {/* Book Header */}
            <div className="mb-2 pb-4 border-b-2 border-primary/20">
              <h2 className="text-3xl font-display text-primary text-center">
                {heroName ? `${heroName}'s Adventure` : "Your Story"}
              </h2>
            </div>

            {/* Book Pages with Spine Effect */}
            <div className="relative">
              {/* Subtle spine shadow in the middle */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent transform -translate-x-1/2 pointer-events-none" />
              
              {/* Story Content */}
              <div className="max-h-[400px] overflow-y-auto pr-4 scroll-smooth">
                <p 
                  className="text-base leading-loose whitespace-pre-wrap font-serif text-foreground/90"
                  data-testid="text-story-preview"
                  style={{
                    textIndent: "2em",
                    lineHeight: "2",
                  }}
                >
                  {storyText}
                </p>
              </div>
            </div>

            {/* Media Gutter - Audio and Images */}
            {hasGenerationStarted && (
              <div className="space-y-4 pt-4 border-t border-primary/10">
                {/* Audio Generation Loading */}
                {displayState === 'gen_audio' && (
                  <div className="flex items-center justify-center py-8">
                    <MagicalLoading message="Creating your audio story..." />
                  </div>
                )}

                {/* Audio Player (when audio is ready) */}
                {(displayState === 'audio_ready' || displayState === 'gen_image' || displayState === 'gen_image_partial' || displayState === 'complete' || displayState === 'failed_image') && audioPath && (
                  <AudioStatusPanel
                    storyId={storyId || null}
                    audioPath={audioPath}
                    status={status}
                    heroName={heroName}
                  />
                )}

                {/* Image Carousel (when images are generating or ready) */}
                {(displayState === 'gen_image' || displayState === 'gen_image_partial' || displayState === 'complete' || displayState === 'failed_image') && (
                  <ProgressiveImageCarousel
                    storyId={storyId || null}
                    imageUrls={imageUrls}
                    status={status}
                    totalImages={5}
                  />
                )}

                {/* Failed Audio State */}
                {displayState === 'failed_audio' && (
                  <AudioStatusPanel
                    storyId={null}
                    audioPath={null}
                    status="failed_audio"
                    heroName={heroName}
                  />
                )}
              </div>
            )}

            {/* Decorative footer (only for preview_ready state) */}
            {displayState === 'preview_ready' && (
              <div className="mt-auto pt-4 border-t border-primary/10 flex justify-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

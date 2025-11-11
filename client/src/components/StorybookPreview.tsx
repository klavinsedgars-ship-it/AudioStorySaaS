import { Card, CardContent } from "@/components/ui/card";
import { MagicalLoading } from "@/components/MagicalLoading";
import { BookOpen, Music, Image as ImageIcon } from "lucide-react";

interface StorybookPreviewProps {
  storyText: string | null;
  isLoading: boolean;
  heroName: string;
  audioPath?: string | null;
  imagePath?: string | null;
  storyId?: string | null;
}

export function StorybookPreview({ 
  storyText, 
  isLoading, 
  heroName,
  audioPath,
  imagePath,
  storyId
}: StorybookPreviewProps) {
  return (
    <Card 
      className="border-2 shadow-2xl overflow-hidden bg-gradient-to-br from-[hsl(38,77%,98%)] to-[hsl(38,60%,96%)] dark:from-[hsl(240,20%,18%)] dark:to-[hsl(240,15%,16%)]"
      data-testid="card-storybook-preview"
    >
      <CardContent className="p-8 min-h-[500px] flex flex-col">
        {/* Empty State */}
        {!storyText && !isLoading && (
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <MagicalLoading message="Asking the moon for a story..." />
          </div>
        )}

        {/* Success State - The Book */}
        {storyText && !isLoading && (
          <div className="flex-1 flex flex-col">
            {/* Book Header */}
            <div className="mb-6 pb-4 border-b-2 border-primary/20">
              <h2 className="text-3xl font-display text-primary text-center">
                {heroName ? `${heroName}'s Adventure` : "Your Story"}
              </h2>
            </div>

            {/* Story Illustration */}
            {imagePath && storyId && (
              <div className="mb-6 rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg">
                <img 
                  src={`/api/audio/${storyId}?asset=image`}
                  alt={`${heroName}'s adventure`} 
                  className="w-full h-auto object-cover"
                  data-testid="story-illustration"
                />
              </div>
            )}

            {/* Audio Player */}
            {audioPath && storyId && (
              <div className="mb-6 p-4 rounded-2xl bg-primary/5 border">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-primary">
                  <Music className="w-4 h-4" />
                  <span>Listen to Your Story</span>
                </div>
                <audio
                  controls
                  className="w-full"
                  src={`/api/audio/${storyId}`}
                  data-testid="audio-player"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Book Pages with Spine Effect */}
            <div className="flex-1 relative">
              {/* Subtle spine shadow in the middle */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent transform -translate-x-1/2 pointer-events-none" />
              
              {/* Story Content */}
              <div className="max-h-[600px] overflow-y-auto pr-4 scroll-smooth">
                <p 
                  className="text-lg leading-loose whitespace-pre-wrap font-serif text-foreground/90"
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

            {/* Decorative footer */}
            <div className="mt-6 pt-4 border-t border-primary/10 flex justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                <div className="w-2 h-2 rounded-full bg-primary/20" />
                <div className="w-2 h-2 rounded-full bg-primary/20" />
                <div className="w-2 h-2 rounded-full bg-primary/20" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

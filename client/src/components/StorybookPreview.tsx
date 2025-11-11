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
      className="border overflow-hidden bg-card"
      data-testid="card-storybook-preview"
    >
      <CardContent className="p-8 min-h-[500px] flex flex-col">
        {/* Empty State */}
        {!storyText && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <BookOpen className="w-16 h-16 text-muted-foreground/40" strokeWidth={1.5} />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-muted-foreground">
                Your story preview will appear here
              </h3>
              <p className="text-sm text-muted-foreground/70 max-w-sm">
                Fill in the details and generate your story
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <MagicalLoading message="Generating your story..." />
          </div>
        )}

        {/* Success State - The Book */}
        {storyText && !isLoading && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-6 pb-4 border-b">
              <h2 className="text-2xl font-semibold text-foreground text-center">
                {heroName ? `${heroName}'s Adventure` : "Your Story"}
              </h2>
            </div>

            {/* Story Illustration */}
            {imagePath && storyId && (
              <div className="mb-6 rounded-lg overflow-hidden border">
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
              <div className="mb-6 p-4 rounded-lg bg-muted border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Listen to Your Story</span>
                    <p className="text-xs text-muted-foreground">Professional narrator quality</p>
                  </div>
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

            {/* Story Content */}
            <div className="flex-1">
              <div className="max-h-[600px] overflow-y-auto">
                <p 
                  className="text-base leading-relaxed whitespace-pre-wrap text-foreground"
                  data-testid="text-story-preview"
                >
                  {storyText}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

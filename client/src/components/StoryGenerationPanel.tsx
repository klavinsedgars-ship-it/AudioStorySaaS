import { Loader2, Music, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StoryGenerationPanelProps {
  status: "idle" | "generating" | "complete" | "failed";
  storyId: string | null;
  audioPath: string | null;
  imagePath: string | null;
}

export function StoryGenerationPanel({
  status,
  storyId,
  audioPath,
  imagePath
}: StoryGenerationPanelProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "generating") {
    return (
      <Card className="mt-6 border-2 border-primary/20 bg-gradient-to-br from-purple-50/50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <h3 className="text-2xl font-display font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                Creating Your Magical Story
              </h3>
              <p className="text-muted-foreground">
                Sprinkling some stardust and weaving your tale...
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Generating audio narration</p>
                  <Progress value={undefined} className="mt-2 h-2" />
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-muted-foreground">Creating magical illustration</p>
                  <p className="text-sm text-muted-foreground">Will start after audio is ready...</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              This usually takes 30-60 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "complete" && storyId) {
    return (
      <Card className="mt-6 border-2 border-green-500/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Success message */}
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-semibold">Your story is ready!</p>
            </div>

            {/* Audio Player */}
            {audioPath && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Music className="w-4 h-4" />
                  <span>Audio Story</span>
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

            {/* Illustration */}
            {imagePath && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="w-4 h-4" />
                  <span>Story Illustration</span>
                </div>
                <img
                  src={`/api/audio/${storyId}?asset=image`}
                  alt="Story illustration"
                  className="w-full rounded-lg border-2 shadow-md"
                  data-testid="story-illustration"
                />
              </div>
            )}

            {/* Illustration generating message */}
            {!imagePath && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Illustration is being created in the background...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className="mt-6 border-2 border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <XCircle className="w-5 h-5" />
            <p className="font-semibold">Generation failed</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Please try generating your story again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}

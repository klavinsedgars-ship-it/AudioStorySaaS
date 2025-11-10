import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Music, Sparkles } from "lucide-react";
import { LANGUAGE_OPTIONS } from "@shared/schema";
import { format } from "date-fns";

type SharedStory = {
  id: string;
  heroName: string;
  additionalNames: string[];
  theme: string | null;
  storyText: string;
  audioPath: string | null;
  language: string;
  createdAt: string;
  sharedAt: Date;
};

export default function SharedStory() {
  const [match, params] = useRoute("/shared/:token");
  const shareToken = params?.token;

  const { data: story, isLoading, error } = useQuery<SharedStory>({
    queryKey: ["/api/shared", shareToken],
    enabled: !!shareToken,
    retry: false,
  });

  useEffect(() => {
    document.title = story
      ? `${story.heroName}'s ${story.theme || "Adventure"} - Shared Story`
      : "Shared Story";
  }, [story]);

  const getLangName = (code: string) => {
    return LANGUAGE_OPTIONS.find((l) => l.code === code)?.name || code;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background flex items-center justify-center p-4">
        <Card className="max-w-md border-2">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Story Not Found</h2>
            <p className="text-muted-foreground">
              This shared story link is invalid or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4" data-testid="badge-shared">
            Shared Story
          </Badge>
          <h1
            className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            data-testid="text-shared-title"
          >
            {story.heroName}'s {story.theme || "Adventure"}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" data-testid="badge-language">
              {getLangName(story.language)}
            </Badge>
            {story.createdAt && (
              <span data-testid="text-date">
                {format(new Date(story.createdAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        <Card className="border-2 mb-8" data-testid="card-story-content">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              The Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed whitespace-pre-wrap" data-testid="text-story">
              {story.storyText}
            </p>
          </CardContent>
        </Card>

        {story.audioPath && shareToken && (
          <Card className="border-2" data-testid="card-audio">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Listen to the Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <audio
                controls
                className="w-full"
                data-testid={`audio-player-${story.id}`}
              >
                <source src={`/api/shared-audio/${shareToken}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want to create your own personalized bedtime stories?
          </p>
          <a href="/" data-testid="link-create-own">
            <Badge className="px-6 py-2 cursor-pointer hover-elevate">
              Create Your Own Story
            </Badge>
          </a>
        </div>
      </div>
    </div>
  );
}

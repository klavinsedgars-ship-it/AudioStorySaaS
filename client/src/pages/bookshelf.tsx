import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Music } from "lucide-react";
import type { Story } from "@shared/schema";
import { LANGUAGE_OPTIONS } from "@shared/schema";
import { format } from "date-fns";

export default function Bookshelf() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: t('errors.unauthorized'),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast, t]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (storiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getLangName = (code: string) => {
    return LANGUAGE_OPTIONS.find(l => l.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" data-testid="text-bookshelf-title">
          {t('bookshelf.title')}
        </h1>

        {!stories || stories.length === 0 ? (
          <Card className="border-2 max-w-md mx-auto" data-testid="card-empty-state">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">{t('bookshelf.empty')}</h2>
              <p className="text-muted-foreground mb-6">{t('bookshelf.emptyDesc')}</p>
              <a href="/">
                <Button data-testid="button-create-first">
                  {t('bookshelf.createFirst')}
                </Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="border-2 hover-elevate transition-all overflow-hidden" data-testid={`card-story-${story.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2" data-testid={`text-story-title-${story.id}`}>
                      {story.heroName}'s {story.theme || "Adventure"}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0" data-testid={`badge-language-${story.id}`}>
                      {getLangName(story.language)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-story-date-${story.id}`}>
                    {story.createdAt && format(new Date(story.createdAt), 'MMM d, yyyy')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {story.additionalNames && story.additionalNames.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {story.additionalNames.map((name, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs" data-testid={`badge-character-${story.id}-${idx}`}>
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-sm line-clamp-4 leading-relaxed text-muted-foreground" data-testid={`text-story-excerpt-${story.id}`}>
                    {story.storyText}
                  </p>

                  {story.audioUrl && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Audio Story</span>
                      </div>
                      <audio
                        controls
                        className="w-full h-10"
                        data-testid={`audio-player-${story.id}`}
                      >
                        <source src={story.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

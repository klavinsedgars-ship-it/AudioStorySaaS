import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, BookOpen, Music, Star, Share2, Copy, Check } from "lucide-react";
import type { Story } from "@shared/schema";
import { LANGUAGE_OPTIONS } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Bookshelf() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<string>("date");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [shareToken, setShareToken] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
    enabled: isAuthenticated,
    retry: false,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (storyId: string) => {
      await apiRequest("POST", `/api/stories/${storyId}/favorite`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorite",
        variant: "destructive",
      });
    },
  });

  const shareStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const response = await apiRequest("POST", `/api/stories/${storyId}/share`, {});
      return response.shareToken;
    },
    onSuccess: (token: string) => {
      setShareToken(token);
      setShareDialogOpen(true);
      setCopied(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create share link",
        variant: "destructive",
      });
    },
  });

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const sortedStories = stories ? [...stories].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    } else if (sortBy === "name") {
      return a.heroName.localeCompare(b.heroName);
    } else if (sortBy === "theme") {
      return (a.theme || "Custom").localeCompare(b.theme || "Custom");
    } else if (sortBy === "favorites") {
      if (a.isFavorite === b.isFavorite) {
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      }
      return a.isFavorite === "true" ? -1 : 1;
    }
    return 0;
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" data-testid="text-bookshelf-title">
            {t('bookshelf.title')}
          </h1>
          {stories && stories.length > 0 && (
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date" data-testid="sort-date">Sort by Date</SelectItem>
                <SelectItem value="name" data-testid="sort-name">Sort by Name</SelectItem>
                <SelectItem value="theme" data-testid="sort-theme">Sort by Theme</SelectItem>
                <SelectItem value="favorites" data-testid="sort-favorites">Favorites First</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

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
            {sortedStories.map((story) => (
              <Card key={story.id} className="border-2 hover-elevate transition-all overflow-hidden" data-testid={`card-story-${story.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8"
                          onClick={() => toggleFavoriteMutation.mutate(story.id)}
                          data-testid={`button-favorite-${story.id}`}
                        >
                          <Star className={`w-5 h-5 ${story.isFavorite === 'true' ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                        </Button>
                        <CardTitle className="text-lg line-clamp-2" data-testid={`text-story-title-${story.id}`}>
                          {story.heroName}'s {story.theme || "Adventure"}
                        </CardTitle>
                      </div>
                    </div>
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

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedStoryId(story.id);
                      shareStoryMutation.mutate(story.id);
                    }}
                    disabled={shareStoryMutation.isPending && selectedStoryId === story.id}
                    data-testid={`button-share-${story.id}`}
                  >
                    {shareStoryMutation.isPending && selectedStoryId === story.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Share2 className="w-4 h-4 mr-2" />
                    )}
                    Share Story
                  </Button>

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

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent data-testid="dialog-share">
            <DialogHeader>
              <DialogTitle>Share Your Story</DialogTitle>
              <DialogDescription>
                Anyone with this link can view and listen to your story, even without an account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/shared/${shareToken}`}
                  className="flex-1 px-3 py-2 text-sm bg-muted border rounded-md"
                  data-testid="input-share-url"
                />
                <Button
                  onClick={handleCopyLink}
                  variant={copied ? "default" : "outline"}
                  data-testid="button-copy-link"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";
import { STORY_THEMES } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, X, Sparkles, Wand2, Rocket, Fish, TreePine, Tractor, Ship, Crown, Palmtree, Snowflake, Zap, Flame, Flower, Bot, Gem, Clock, type LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { MagicalLoading } from "@/components/MagicalLoading";
import { StorybookPreview } from "@/components/StorybookPreview";
import { StoryGenerationPanel } from "@/components/StoryGenerationPanel";

const THEME_ICONS: Record<string, LucideIcon> = {
  "Space Adventure": Rocket,
  "Under the Sea": Fish,
  "Dinosaurs": Sparkles,
  "Magical Forest": TreePine,
  "Farm Friends": Tractor,
  "Pirate Treasure Hunt": Ship,
  "Princess Castle": Crown,
  "Jungle Safari": Palmtree,
  "Arctic Animals": Snowflake,
  "Superhero Mission": Zap,
  "Dragon Quest": Flame,
  "Fairy Garden": Flower,
  "Robot Workshop": Bot,
  "Ocean Treasure": Gem,
  "Time Travel Adventure": Clock,
};

export default function Creator() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { toast } = useToast();

  const [heroName, setHeroName] = useState("");
  const [additionalNames, setAdditionalNames] = useState<string[]>([]);
  const [generationType, setGenerationType] = useState<"theme" | "custom">("theme");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [storyText, setStoryText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingAudio, setIsCreatingAudio] = useState(false);
  
  // Story generation state machine
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [storyStatus, setStoryStatus] = useState<"idle" | "generating" | "complete" | "failed">("idle");
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

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

  const handleGeneratePreview = async () => {
    if (!heroName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a main character name",
        variant: "destructive",
      });
      return;
    }

    if (generationType === "theme" && !selectedTheme) {
      toast({
        title: "Missing Information",
        description: "Please select a theme",
        variant: "destructive",
      });
      return;
    }

    if (generationType === "custom" && !customPrompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your story idea",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setStoryText(null);

    try {
      const response = await apiRequest("POST", "/api/generate-story-text", {
        heroName,
        additionalNames: additionalNames.filter(n => n.trim()),
        language: currentLang,
        generationType,
        theme: generationType === "theme" ? selectedTheme : null,
        customPrompt: generationType === "custom" ? customPrompt : null,
      });

      const data = await response.json();
      setStoryText(data.storyText);
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: t('errors.unauthorized'),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || t('errors.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAudio = async () => {
    if (!storyText) return;

    if ((user?.credits || 0) < 1) {
      toast({
        title: "No Credits",
        description: t('errors.noCredits'),
        variant: "destructive",
      });
      return;
    }

    setIsCreatingAudio(true);
    setStoryStatus("generating");

    try {
      const response = await apiRequest("POST", "/api/generate-story-audio", {
        storyText,
        language: currentLang,
        heroName,
        additionalNames: additionalNames.filter(n => n.trim()),
        theme: generationType === "theme" ? selectedTheme : "Custom",
        customPromptText: generationType === "custom" ? customPrompt : null,
      });

      const data = await response.json();
      setCurrentStoryId(data.storyId);

      toast({
        title: "Story Started!",
        description: "Creating your magical audio story...",
      });
    } catch (error: any) {
      setStoryStatus("failed");
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: t('errors.unauthorized'),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || t('errors.audioFailed'),
        variant: "destructive",
      });
    } finally {
      setIsCreatingAudio(false);
    }
  };
  
  // Poll story status when generating
  useEffect(() => {
    if (!currentStoryId || storyStatus !== "generating") return;
    
    let pollInterval: NodeJS.Timeout;
    let pollDelay = 1000; // Start with 1 second
    const maxDelay = 5000; // Cap at 5 seconds
    const timeout = 5 * 60 * 1000; // 5 minute timeout
    const startTime = Date.now();
    
    const pollStatus = async () => {
      try {
        // Check timeout
        if (Date.now() - startTime > timeout) {
          setStoryStatus("failed");
          toast({
            title: "Timeout",
            description: "Story generation took too long. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        const response = await apiRequest("GET", `/api/story/status/${currentStoryId}`);
        const data = await response.json();
        
        if (data.status === "complete") {
          setStoryStatus("complete");
          setAudioPath(data.audioPath);
          setImagePath(data.imagePath || data.imageUrl);
          toast({
            title: "Story Ready!",
            description: "Your audio story is ready to listen!",
          });
        } else if (data.status === "failed_audio") {
          setStoryStatus("failed");
          toast({
            title: "Generation Failed",
            description: "Failed to generate audio. Please try again.",
            variant: "destructive",
          });
        } else {
          // Continue polling with exponential backoff
          pollDelay = Math.min(pollDelay * 1.5, maxDelay);
          pollInterval = setTimeout(pollStatus, pollDelay);
        }
      } catch (error: any) {
        console.error("Poll error:", error);
        // Continue polling on errors (network issues, etc.)
        pollInterval = setTimeout(pollStatus, pollDelay);
      }
    };
    
    // Start first poll immediately
    pollStatus();
    
    // Cleanup
    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [currentStoryId, storyStatus, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Two-column grid for desktop, single column for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: The Form */}
          <div className="lg:order-1">
            <Card className="border-2 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-3xl text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" data-testid="text-creator-title">
              {t('creator.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heroName" className="text-base font-medium">
                {t('creator.heroName')}
              </Label>
              <Input
                id="heroName"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder={t('creator.heroPlaceholder')}
                className="h-12 text-lg"
                data-testid="input-hero-name"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t('creator.addName')}
              </Label>
              {additionalNames.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => {
                      const newNames = [...additionalNames];
                      newNames[index] = e.target.value;
                      setAdditionalNames(newNames);
                    }}
                    placeholder={t('creator.namePlaceholder')}
                    className="h-10"
                    data-testid={`input-additional-name-${index}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setAdditionalNames(additionalNames.filter((_, i) => i !== index));
                    }}
                    data-testid={`button-remove-name-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setAdditionalNames([...additionalNames, ""])}
                className="w-full gap-2"
                data-testid="button-add-name"
              >
                <Plus className="w-4 h-4" />
                {t('creator.addName')}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={generationType === "theme" ? "default" : "outline"}
                  onClick={() => setGenerationType("theme")}
                  size="lg"
                  className="h-28 flex-col gap-3"
                  data-testid="button-mode-theme"
                >
                  <Sparkles className="w-8 h-8" />
                  <span className="text-base">{t('creator.chooseTheme')}</span>
                </Button>
                <Button
                  variant={generationType === "custom" ? "default" : "outline"}
                  onClick={() => setGenerationType("custom")}
                  size="lg"
                  className="h-28 flex-col gap-3"
                  data-testid="button-mode-custom"
                >
                  <Wand2 className="w-8 h-8" />
                  <span className="text-base">{t('creator.customPrompt')}</span>
                </Button>
              </div>
            </div>

            {generationType === "theme" && (
              <div className="space-y-3">
                <Label className="text-base font-medium font-display">{t('creator.theme')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {STORY_THEMES.map((theme) => {
                    const Icon = THEME_ICONS[theme] || Sparkles;
                    const isSelected = selectedTheme === theme;
                    return (
                      <Card
                        key={theme}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedTheme(theme)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedTheme(theme);
                          }
                        }}
                        className={`
                          cursor-pointer transition-all hover:scale-[1.02] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                          ${isSelected 
                            ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary/5' 
                            : 'border-2 border-transparent hover:border-primary/30'
                          }
                        `}
                        data-testid={`card-theme-${theme.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <CardContent className="p-0 flex flex-col items-center justify-center gap-3 min-h-[100px]">
                          <div className={`
                            p-3 rounded-xl transition-colors
                            ${isSelected 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-primary/10 text-primary'
                            }
                          `}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-display font-medium text-center leading-tight">
                            {t(`themes.${theme}`)}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {generationType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customPrompt" className="text-base font-medium">
                  {t('creator.customPrompt')}
                </Label>
                <Textarea
                  id="customPrompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t('creator.customPromptPlaceholder')}
                  className="min-h-32 text-base resize-none"
                  data-testid="textarea-custom-prompt"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Button - Always visible in left column */}
        <Button
          onClick={handleGeneratePreview}
          disabled={isGenerating}
          className="w-full h-12 gap-2 text-base mt-6"
          data-testid="button-generate-preview"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('creator.generating')}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {t('creator.generatePreview')}
            </>
          )}
        </Button>
      </div>

      {/* RIGHT COLUMN: The Storybook */}
      <div className="lg:order-2 lg:sticky lg:top-24 lg:h-fit">
        <StorybookPreview 
          storyText={storyText}
          isLoading={isGenerating}
          heroName={heroName}
        />

        {/* Approval Buttons - Show when story is ready and not generating */}
        {storyText && !isGenerating && storyStatus === "idle" && (
          <div className="flex gap-3 flex-wrap mt-6">
            <Button
              variant="outline"
              onClick={handleGeneratePreview}
              disabled={isGenerating}
              className="flex-1 gap-2"
              data-testid="button-try-again"
            >
              <Wand2 className="w-4 h-4" />
              {t('creator.tryAgain')}
            </Button>
            <Button
              onClick={handleCreateAudio}
              disabled={isCreatingAudio}
              className="flex-1 gap-2"
              data-testid="button-create-audio"
            >
              {isCreatingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('creator.creatingAudio')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('creator.createAudio')}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Story Generation Panel - Show when generating or complete */}
        <StoryGenerationPanel
          status={storyStatus}
          storyId={currentStoryId}
          audioPath={audioPath}
          imagePath={imagePath}
        />
      </div>

        </div>
      </div>
    </div>
  );
}

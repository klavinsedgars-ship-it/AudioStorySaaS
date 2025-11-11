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
import { Plus, X, Sparkles, Wand2, Rocket, Fish, TreePine, Tractor, Ship, Crown, Palmtree, Snowflake, Zap, Flame, Flower, Bot, Gem, Clock, Check, type LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { MagicalLoading } from "@/components/MagicalLoading";
import { StorybookPreview } from "@/components/StorybookPreview";
import { MagicalLoadingBar } from "@/components/MagicalLoadingBar";
import { ProgressConstellation } from "@/components/ProgressConstellation";
import { FloatingBook } from "@/components/FloatingBook";
import { MagicalSparkles } from "@/components/MagicalSparkles";
import { Badge } from "@/components/ui/badge";

const THEME_DESCRIPTIONS: Record<string, string> = {
  "Space Adventure": "Rocket through the cosmos on a thrilling mission among the stars",
  "Under the Sea": "Dive deep into an underwater kingdom filled with ocean treasures",
  "Dinosaurs": "Journey back to the age of mighty dinosaurs and ancient discoveries",
  "Magical Forest": "Wander through enchanted woods where trees whisper secrets",
  "Farm Friends": "Meet playful animals on a sunny day at the friendly farm",
  "Pirate Treasure Hunt": "Set sail on the high seas searching for legendary treasure",
  "Princess Castle": "Rule a magnificent kingdom from a fairy tale castle",
  "Jungle Safari": "Trek through wild jungles discovering exotic creatures",
  "Arctic Animals": "Explore the frozen tundra with polar friends",
  "Superhero Mission": "Save the day with incredible powers and bravery",
  "Dragon Quest": "Befriend mighty dragons on an epic adventure",
  "Fairy Garden": "Dance with fairies in a magical blooming wonderland",
  "Robot Workshop": "Build amazing inventions in a futuristic laboratory",
  "Ocean Treasure": "Uncover sparkling gems hidden beneath the waves",
  "Time Travel Adventure": "Journey through history in an incredible time machine",
};

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

    // Clear previous story data before generating new text
    setIsGenerating(true);
    setStoryText(null);
    setCurrentStoryId(null);
    setAudioPath(null);
    setImagePath(null);
    setStoryStatus("idle");

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
      
      // Only start polling after we have the new storyId
      setStoryStatus("generating");

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

  // Determine current progress step
  const getCurrentStep = (): 'hero' | 'theme' | 'story' | 'audio' | 'complete' => {
    if (storyStatus === 'complete') return 'complete';
    if (storyStatus === 'generating' || isCreatingAudio) return 'audio';
    if (storyText) return 'story';
    if (selectedTheme || customPrompt) return 'theme';
    return 'hero';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/30 dark:from-purple-950/20 dark:via-background dark:to-background pt-20 pb-16 relative overflow-hidden">
      {/* Magical floating decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <MagicalSparkles count={6} />
        <div className="absolute top-10 left-5">
          <FloatingBook delay={0} />
        </div>
        <div className="absolute top-32 right-10">
          <FloatingBook delay={1.5} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Progress Constellation */}
        <ProgressConstellation currentStep={getCurrentStep()} className="mb-8" />
        
        {/* Contextual Tip Banner */}
        {!storyText && (user?.credits || 0) > 0 && (
          <div className="mb-6 text-center">
            <Badge variant="secondary" className="text-sm px-6 py-2 gap-2">
              <Sparkles className="w-4 h-4" />
              Tip: Most parents create 3-5 unique stories per child!
            </Badge>
          </div>
        )}

        {/* Low Credits Warning */}
        {(user?.credits || 0) < 3 && (user?.credits || 0) > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-300/50">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <p className="text-sm">
                <strong>Running low on credits!</strong> Save 40% with the Family Pack — perfect for creating more magical moments.
              </p>
              <a href="/api/login">
                <Button variant="default" size="sm">
                  Get Credits
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* Two-column grid for desktop, single column for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: The Form */}
          <div className="lg:order-1">
            <Card className="shadow-2xl relative overflow-hidden">
              {/* Corner sparkles */}
              <div className="absolute top-4 right-4 text-yellow-400 twinkle">
                <Sparkles className="w-6 h-6" />
              </div>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wand2 className="w-8 h-8 text-primary" />
              <CardTitle className="font-display text-3xl text-center bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-creator-title">
                Story Workshop
              </CardTitle>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Create a personalized adventure in 3 easy steps
            </p>
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
                <p className="text-xs text-muted-foreground mb-4">Choose the magical world for your story</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STORY_THEMES.map((theme) => {
                    const Icon = THEME_ICONS[theme] || Sparkles;
                    const isSelected = selectedTheme === theme;
                    const description = THEME_DESCRIPTIONS[theme] || "";
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
                          cursor-pointer transition-all duration-200 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                          ${isSelected 
                            ? 'border-primary/60 ring-4 ring-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 scale-105 shadow-xl' 
                            : 'hover:scale-102 hover:shadow-lg hover-elevate'
                          }
                        `}
                        data-testid={`card-theme-${theme.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <CardContent className="p-0 flex items-start gap-4">
                          <div className={`
                            p-3 rounded-2xl transition-all duration-200 flex-shrink-0
                            ${isSelected 
                              ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg' 
                              : 'bg-primary/10 text-primary'
                            }
                          `}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-display font-bold mb-1">
                              {t(`themes.${theme}`)}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </div>
                            </div>
                          )}
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

      {/* RIGHT COLUMN: The Storybook / Loading States */}
      <div className="lg:order-2 lg:sticky lg:top-24 lg:h-fit">
        
        {/* 1. Show text generation loader (typing animation) */}
        {isGenerating && (
          <StorybookPreview 
            storyText={null}
            isLoading={true}
            heroName={heroName}
          />
        )}

        {/* 2. Show audio/image generation loader (progress bar) */}
        {!isGenerating && (storyStatus === 'generating' || storyStatus === 'failed') && (
          <Card className="border-2 shadow-2xl">
            <CardContent className="p-8 min-h-[500px] flex items-center justify-center">
              <MagicalLoadingBar status={storyStatus} />
            </CardContent>
          </Card>
        )}

        {/* 3. Show completed story with audio/image */}
        {!isGenerating && storyStatus === 'complete' && (
          <StorybookPreview 
            storyText={storyText}
            isLoading={false}
            heroName={heroName}
            audioPath={audioPath}
            imagePath={imagePath}
            storyId={currentStoryId}
          />
        )}

        {/* 4. Show text preview (ready for approval) */}
        {!isGenerating && storyStatus === 'idle' && storyText && (
          <>
            <StorybookPreview 
              storyText={storyText}
              isLoading={false}
              heroName={heroName}
            />
            {/* Approval Buttons */}
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
          </>
        )}

        {/* 5. Show default empty state */}
        {!isGenerating && storyStatus === 'idle' && !storyText && (
          <StorybookPreview 
            storyText={null}
            isLoading={false}
            heroName={heroName}
          />
        )}

      </div>

        </div>
      </div>
    </div>
  );
}

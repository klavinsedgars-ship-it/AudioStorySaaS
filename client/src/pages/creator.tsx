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

    try {
      await apiRequest("POST", "/api/generate-story-audio", {
        storyText,
        language: currentLang,
        heroName,
        additionalNames: additionalNames.filter(n => n.trim()),
        theme: generationType === "theme" ? selectedTheme : "Custom",
        customPromptText: generationType === "custom" ? customPrompt : null,
      });

      toast({
        title: "Success!",
        description: "Story created! Check your bookshelf.",
      });

      setTimeout(() => {
        window.location.href = "/bookshelf";
      }, 1000);
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
        description: error.message || t('errors.audioFailed'),
        variant: "destructive",
      });
    } finally {
      setIsCreatingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-8">
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
                  className="h-24 flex-col gap-2"
                  data-testid="button-mode-theme"
                >
                  <Sparkles className="w-6 h-6" />
                  <span className="text-sm">{t('creator.chooseTheme')}</span>
                </Button>
                <Button
                  variant={generationType === "custom" ? "default" : "outline"}
                  onClick={() => setGenerationType("custom")}
                  className="h-24 flex-col gap-2"
                  data-testid="button-mode-custom"
                >
                  <Wand2 className="w-6 h-6" />
                  <span className="text-sm">{t('creator.customPrompt')}</span>
                </Button>
              </div>
            </div>

            {generationType === "theme" && (
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('creator.theme')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STORY_THEMES.map((theme) => {
                    const Icon = THEME_ICONS[theme] || Sparkles;
                    return (
                      <Button
                        key={theme}
                        variant={selectedTheme === theme ? "default" : "outline"}
                        onClick={() => setSelectedTheme(theme)}
                        className="h-20 flex-col gap-2 text-sm"
                        data-testid={`button-theme-${theme.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Icon className="w-5 h-5" />
                        {t(`themes.${theme}`)}
                      </Button>
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

            {!isGenerating && (
              <Button
                onClick={handleGeneratePreview}
                disabled={isGenerating}
                className="w-full h-12 gap-2 text-base"
                data-testid="button-generate-preview"
              >
                <Sparkles className="w-4 h-4" />
                {t('creator.generatePreview')}
              </Button>
            )}

            {isGenerating && (
              <div className="my-8">
                <MagicalLoading message={t('creator.generating')} />
              </div>
            )}

            {storyText && !isCreatingAudio && (
              <Card className="border-2 bg-card/50" data-testid="card-story-preview">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t('creator.preview')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-96 overflow-y-auto pr-2">
                    <p className="text-lg leading-loose whitespace-pre-wrap" data-testid="text-story-preview">
                      {storyText}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
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
                      <Sparkles className="w-4 h-4" />
                      {t('creator.createAudio')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isCreatingAudio && (
              <div className="my-8">
                <MagicalLoading message={t('creator.creatingAudio')} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

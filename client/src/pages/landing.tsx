import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, Sparkles } from "lucide-react";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent" data-testid="text-title">
            {t('landing.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed" data-testid="text-subtitle">
            {t('landing.subtitle')}
          </p>
          <a href="/api/login">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
              data-testid="button-cta"
            >
              <Sparkles className="w-5 h-5" />
              {t('landing.cta')}
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <Card className="border-2 hover-elevate transition-all" data-testid="card-feature-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.feature1')}</h3>
              <p className="text-muted-foreground">{t('landing.feature1Desc')}</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover-elevate transition-all" data-testid="card-feature-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.feature2')}</h3>
              <p className="text-muted-foreground">{t('landing.feature2Desc')}</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover-elevate transition-all" data-testid="card-feature-3">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.feature3')}</h3>
              <p className="text-muted-foreground">{t('landing.feature3Desc')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

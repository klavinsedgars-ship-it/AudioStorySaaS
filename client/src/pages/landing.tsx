import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, User, Mic, BookHeart, Gift, Wand2 } from "lucide-react";
import { CREDIT_PACKAGES } from "@shared/schema";
import { Helmet } from "react-helmet";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('landing.seo.title')}</title>
        <meta name="description" content={t('landing.seo.description')} />
        <meta property="og:title" content={t('landing.seo.title')} />
        <meta property="og:description" content={t('landing.seo.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourapp.replit.app" />
        <meta property="og:image" content="https://yourapp.replit.app/og-image.png" />
      </Helmet>

      <div className="min-h-screen">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text (Left) */}
            <div className="space-y-6 text-center md:text-left">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent" data-testid="text-title">
                {t('landing.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed" data-testid="text-subtitle">
                {t('landing.subtitle')}
              </p>
              <a href="/api/login">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all font-display font-bold"
                  data-testid="button-cta"
                >
                  <Sparkles className="w-5 h-5" />
                  {t('landing.cta')}
                </Button>
              </a>
            </div>

            {/* Hero Image (Right) */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
                <div className="relative flex items-center justify-center h-full">
                  <BookHeart className="w-64 h-64 text-primary/30" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wavy Divider */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full h-16 text-background dark:text-card" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 md:py-24 bg-background dark:bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <h2 className="font-display text-4xl font-bold text-center mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">It's as easy as 1-2-3!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="border-2 rounded-2xl text-center" data-testid="card-step-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-display">{t('landing.howItWorks.step1Title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t('landing.howItWorks.step1Desc')}</p>
                </CardContent>
              </Card>
              {/* Step 2 */}
              <Card className="border-2 rounded-2xl text-center" data-testid="card-step-2">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-display">{t('landing.howItWorks.step2Title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t('landing.howItWorks.step2Desc')}</p>
                </CardContent>
              </Card>
              {/* Step 3 */}
              <Card className="border-2 rounded-2xl text-center" data-testid="card-step-3">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-display">{t('landing.howItWorks.step3Title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t('landing.howItWorks.step3Desc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS SECTION */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {/* Feature 1: Multilingual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full" />
                  <div className="relative flex items-center justify-center h-full">
                    <Wand2 className="w-48 h-48 text-primary/20" strokeWidth={1} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="font-display">{t('landing.feature1.badge')}</Badge>
                <h3 className="font-display text-3xl font-bold">{t('landing.feature1.title')}</h3>
                <p className="text-lg text-muted-foreground">{t('landing.feature1.desc')}</p>
              </div>
            </div>
            {/* Feature 2: Personalization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 md:order-2">
                <Badge variant="secondary" className="font-display">{t('landing.feature2.badge')}</Badge>
                <h3 className="font-display text-3xl font-bold">{t('landing.feature2.title')}</h3>
                <p className="text-lg text-muted-foreground">{t('landing.feature2.desc')}</p>
              </div>
              <div className="md:order-1 flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-500/10 rounded-full" />
                  <div className="relative flex items-center justify-center h-full">
                    <User className="w-48 h-48 text-purple-600/20" strokeWidth={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* "COMING SOON" UPSELL TEASER */}
        <section className="py-16 md:py-24 bg-background dark:bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
            <h2 className="font-display text-4xl font-bold mb-12">
              {t('landing.upsell.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upsell 1: Voice Cloning */}
              <Card className="border-2 rounded-2xl" data-testid="card-upsell-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">{t('landing.upsell.voiceTitle')}</h3>
                  <p className="text-muted-foreground">{t('landing.upsell.voiceDesc')}</p>
                </CardContent>
              </Card>
              {/* Upsell 2: Hardcover Books */}
              <Card className="border-2 rounded-2xl" data-testid="card-upsell-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookHeart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">{t('landing.upsell.bookTitle')}</h3>
                  <p className="text-muted-foreground">{t('landing.upsell.bookDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* PRICING / CREDIT PACKAGES SECTION */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 font-display text-base px-6 py-2" data-testid="badge-pricing">
                No Subscription! Your credits never expire
              </Badge>
              <h2 className="font-display text-4xl font-bold mb-4">
                {t('landing.pricing.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('landing.pricing.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {CREDIT_PACKAGES.map((pkg, index) => (
                <Card
                  key={index}
                  className={`border-2 relative ${pkg.popular ? 'border-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/5 to-purple-500/5' : 'shadow-lg'} flex flex-col`}
                  data-testid={`card-package-${index}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1.5 px-4 py-1.5 shadow-lg font-display bg-gradient-to-r from-primary to-purple-600" data-testid="badge-popular">
                        <Sparkles className="w-3 h-3" />
                        Best Value
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4 pt-8 text-center">
                    <CardTitle className="font-display text-5xl font-bold mb-2" data-testid={`text-credits-${index}`}>
                      {pkg.credits} {t('credits.label')}
                    </CardTitle>
                    <p className="text-4xl font-bold" data-testid={`text-price-${index}`}>
                      ${pkg.price}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 p-8 space-y-6">
                    <ul className="space-y-3 flex-1">
                      <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /><span>{pkg.credits} {t('landing.pricing.stories')}</span></li>
                      <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /><span>{t('landing.pricing.unlimitedPreviews')}</span></li>
                      <li className="flex items-center gap-2"><Check className="w-5 h-5 text-primary" /><span>{t('landing.pricing.saveForever')}</span></li>
                    </ul>
                    <a href="/api/login" className="w-full">
                      <Button
                        className="w-full h-12 gap-2 text-base font-display font-bold"
                        variant={pkg.popular ? "default" : "outline"}
                        data-testid={`button-buy-${index}`}
                      >
                        {t('landing.pricing.getStarted')}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold mb-4">
              {t('landing.finalCta.title')}
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              {t('landing.finalCta.subtitle')}
            </p>
            <a href="/api/login">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all font-display font-bold bg-white text-primary hover:bg-white/90"
                data-testid="button-final-cta"
              >
                <Sparkles className="w-5 h-5" />
                {t('landing.cta')}
              </Button>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

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
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text (Left) */}
            <div className="space-y-6 text-center md:text-left relative z-10">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary drop-shadow-lg" data-testid="text-title">
                {t('landing.title')}
              </h1>
              <p className="text-xl md:text-2xl text-foreground max-w-2xl leading-relaxed font-medium" data-testid="text-subtitle">
                {t('landing.subtitle')}
              </p>
              <a href="/api/login">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-16 px-10 text-xl gap-3 shadow-2xl hover:shadow-xl transition-all font-display font-bold border-4 border-white/50 animate-bounce"
                  data-testid="button-cta"
                >
                  <Sparkles className="w-6 h-6" />
                  {t('landing.cta')}
                </Button>
              </a>
            </div>

            {/* Hero Image (Right) */}
            <div className="hidden md:flex items-center justify-center relative">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-accent via-primary to-secondary rounded-full blur-3xl opacity-40 animate-pulse" />
                <div className="relative flex items-center justify-center h-full">
                  <BookHeart className="w-64 h-64 text-primary drop-shadow-2xl" strokeWidth={1.5} />
                </div>
                {/* Floating decorative elements */}
                <Sparkles className="absolute top-10 right-10 w-8 h-8 text-accent animate-bounce" style={{animationDelay: '0.2s'}} />
                <Sparkles className="absolute bottom-20 left-10 w-6 h-6 text-secondary animate-bounce" style={{animationDelay: '0.5s'}} />
                <Wand2 className="absolute top-1/3 left-0 w-10 h-10 text-primary animate-bounce" style={{animationDelay: '0.8s'}} />
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
        <section className="py-16 md:py-24 bg-gradient-to-br from-accent/30 via-accent/20 to-accent/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-3xl" />
          <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-center text-foreground mb-12 text-xl font-semibold">It's as easy as 1-2-3!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="border-4 border-primary/30 text-center shadow-2xl hover:scale-105 transition-transform bg-gradient-to-br from-primary/10 to-primary/5" data-testid="card-step-1">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <User className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="font-display text-xl">{t('landing.howItWorks.step1Title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">{t('landing.howItWorks.step1Desc')}</p>
                </CardContent>
              </Card>
              {/* Step 2 */}
              <Card className="border-4 border-secondary/30 text-center shadow-2xl hover:scale-105 transition-transform bg-gradient-to-br from-secondary/10 to-secondary/5" data-testid="card-step-2">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Sparkles className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="font-display text-xl">{t('landing.howItWorks.step2Title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">{t('landing.howItWorks.step2Desc')}</p>
                </CardContent>
              </Card>
              {/* Step 3 */}
              <Card className="border-4 border-accent/50 text-center shadow-2xl hover:scale-105 transition-transform bg-gradient-to-br from-accent/20 to-accent/10" data-testid="card-step-3">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Mic className="w-10 h-10 text-accent-foreground" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="font-display text-xl">{t('landing.howItWorks.step3Title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">{t('landing.howItWorks.step3Desc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/20 via-primary/15 to-secondary/20 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-40 left-20 w-32 h-32 rounded-full bg-primary/30 blur-2xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
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
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/25 via-accent/25 to-primary/25">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 text-primary">
              {t('landing.upsell.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upsell 1: Voice Cloning */}
              <Card className="border-4 border-secondary/30 shadow-2xl hover:scale-105 transition-transform" data-testid="card-upsell-1">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Mic className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{t('landing.upsell.voiceTitle')}</h3>
                  <p className="text-foreground font-medium">{t('landing.upsell.voiceDesc')}</p>
                </CardContent>
              </Card>
              {/* Upsell 2: Hardcover Books */}
              <Card className="border-4 border-primary/30 shadow-2xl hover:scale-105 transition-transform" data-testid="card-upsell-2">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <BookHeart className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{t('landing.upsell.bookTitle')}</h3>
                  <p className="text-foreground font-medium">{t('landing.upsell.bookDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* PRICING / CREDIT PACKAGES SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-accent/30 via-secondary/20 to-accent/30 relative overflow-hidden">
          {/* Decorative sparkles */}
          <div className="absolute top-10 left-1/4 w-24 h-24 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-secondary/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 font-display text-lg px-8 py-3 border-4 border-white/50 shadow-xl" data-testid="badge-pricing">
                No Subscription! Your credits never expire
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-primary">
                {t('landing.pricing.title')}
              </h2>
              <p className="text-xl text-foreground max-w-2xl mx-auto font-semibold">
                {t('landing.pricing.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {CREDIT_PACKAGES.map((pkg, index) => {
                const colors = [
                  { border: 'border-primary/40', bg: 'from-primary/20 to-primary/10', badge: 'from-primary via-primary/90 to-primary/80' },
                  { border: 'border-secondary/40', bg: 'from-secondary/20 to-secondary/10', badge: 'from-secondary via-secondary/90 to-secondary/80' },
                  { border: 'border-accent/50', bg: 'from-accent/30 to-accent/15', badge: 'from-accent via-accent/90 to-accent/80' },
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <Card
                    key={index}
                    className={`border-4 ${colorScheme.border} relative ${pkg.popular ? 'shadow-2xl scale-110 ring-4 ring-primary/20' : 'shadow-xl hover:scale-105'} flex flex-col transition-all bg-gradient-to-br ${colorScheme.bg}`}
                    data-testid={`card-package-${index}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                        <Badge className={`gap-2 px-6 py-2.5 shadow-2xl font-display text-base bg-gradient-to-r ${colorScheme.badge} border-4 border-white/50 animate-pulse`} data-testid="badge-popular">
                          <Sparkles className="w-5 h-5" />
                          Best Value
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4 pt-10 text-center">
                      <CardTitle className="font-display text-6xl font-black mb-3 text-primary" data-testid={`text-credits-${index}`}>
                        {pkg.credits}
                      </CardTitle>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">{t('credits.label')}</p>
                      <p className="text-5xl font-black text-foreground" data-testid={`text-price-${index}`}>
                        ${pkg.price}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 p-8 space-y-6">
                      <ul className="space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-base font-semibold"><Check className="w-6 h-6 text-primary" strokeWidth={3} /><span>{pkg.credits} {t('landing.pricing.stories')}</span></li>
                        <li className="flex items-center gap-3 text-base font-semibold"><Check className="w-6 h-6 text-primary" strokeWidth={3} /><span>{t('landing.pricing.unlimitedPreviews')}</span></li>
                        <li className="flex items-center gap-3 text-base font-semibold"><Check className="w-6 h-6 text-primary" strokeWidth={3} /><span>{t('landing.pricing.saveForever')}</span></li>
                      </ul>
                      <a href="/api/login" className="w-full">
                        <Button
                          className="w-full h-14 gap-2 text-lg font-display font-black shadow-xl border-4 border-white/30"
                          variant={pkg.popular ? "default" : "secondary"}
                          data-testid={`button-buy-${index}`}
                        >
                          <Sparkles className="w-5 h-5" />
                          {t('landing.pricing.getStarted')}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-secondary to-accent text-white relative overflow-hidden">
          {/* Floating decorative elements */}
          <Sparkles className="absolute top-20 left-20 w-12 h-12 text-white/30 animate-bounce" style={{animationDelay: '0.3s'}} />
          <BookHeart className="absolute top-40 right-20 w-16 h-16 text-white/20 animate-bounce" style={{animationDelay: '0.7s'}} />
          <Wand2 className="absolute bottom-20 left-1/3 w-10 h-10 text-white/25 animate-bounce" style={{animationDelay: '1s'}} />
          <Gift className="absolute bottom-40 right-1/3 w-14 h-14 text-white/20 animate-bounce" style={{animationDelay: '0.5s'}} />
          
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/40 shadow-2xl">
              <Gift className="w-14 h-14 text-white" strokeWidth={2} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4 drop-shadow-lg">
              {t('landing.finalCta.title')}
            </h2>
            <p className="text-xl md:text-2xl mb-10 font-semibold drop-shadow-md">
              {t('landing.finalCta.subtitle')}
            </p>
            <a href="/api/login">
              <Button 
                size="lg" 
                className="h-16 px-12 text-xl gap-3 shadow-2xl hover:shadow-xl transition-all font-display font-black bg-white text-primary hover:scale-110 border-4 border-white/50"
                data-testid="button-final-cta"
              >
                <Sparkles className="w-6 h-6" />
                {t('landing.cta')}
              </Button>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

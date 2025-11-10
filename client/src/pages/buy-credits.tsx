import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, Check, Sparkles } from "lucide-react";
import { CREDIT_PACKAGES } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function BuyCredits() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

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

  const purchaseMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { amount });
      return response;
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error: any) => {
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
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" data-testid="text-credits-title">
            {t('credits.title')}
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
            <span>{t('credits.current')}:</span>
            <Badge variant="secondary" className="text-lg px-4 py-1.5 gap-2" data-testid="badge-current-credits">
              <Coins className="w-4 h-4" />
              {user?.credits || 0}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <Card
              key={index}
              className={`border-2 relative ${pkg.popular ? 'border-primary shadow-xl scale-105' : ''} hover-elevate transition-all`}
              data-testid={`card-package-${index}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1.5 px-4 py-1.5 shadow-lg" data-testid="badge-popular">
                    <Sparkles className="w-3 h-3" />
                    {t('credits.popular')}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4 pt-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                    <Coins className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-6xl font-bold mb-2" data-testid={`text-credits-${index}`}>
                    {pkg.credits}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Credits</p>
                  <div className="text-4xl font-bold mt-4" data-testid={`text-price-${index}`}>
                    ${pkg.price}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{t('credits.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{t('credits.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{t('credits.feature3')}</span>
                  </li>
                </ul>
                <Button
                  className="w-full h-11 gap-2"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => purchaseMutation.mutate(pkg.price)}
                  disabled={purchaseMutation.isPending}
                  data-testid={`button-buy-${index}`}
                >
                  {purchaseMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      {t('credits.buy')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Coins, TrendingUp, Calendar } from "lucide-react";
import type { Story } from "@shared/schema";
import { format, startOfMonth, isAfter } from "date-fns";

type Payment = {
  id: string;
  userId: string;
  creditsAdded: number;
  createdAt: string;
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payment-history"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your dashboard",
        variant: "destructive",
      });
    }
  }, [authLoading, isAuthenticated, toast]);

  if (authLoading || storiesLoading || paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const totalStories = stories?.length || 0;
  const totalCreditsPurchased = payments?.reduce((sum, p) => sum + p.creditsAdded, 0) || 0;
  const totalCreditsUsed = totalCreditsPurchased + 3 - user.credits; // 3 is initial free credits
  const storiesThisMonth = stories?.filter(s => 
    s.createdAt && isAfter(new Date(s.createdAt), startOfMonth(new Date()))
  ).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8">
          <h1 
            className="font-display text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            data-testid="text-dashboard-title"
          >
            My Dashboard
          </h1>
          <p className="text-muted-foreground" data-testid="text-welcome">
            Welcome back, {user.firstName || user.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2" data-testid="card-total-stories">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Total Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-stories">{totalStories}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-this-month">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-stories-this-month">{storiesThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Stories created</p>
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-credits-balance">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Credit Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-credits-balance">{user.credits}</div>
              <p className="text-xs text-muted-foreground mt-1">Available credits</p>
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-credits-used">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Credits Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-credits-used">{totalCreditsUsed}</div>
              <p className="text-xs text-muted-foreground mt-1">Total used</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2" data-testid="card-recent-stories">
            <CardHeader>
              <CardTitle>Recent Stories</CardTitle>
            </CardHeader>
            <CardContent>
              {!stories || stories.length === 0 ? (
                <p className="text-muted-foreground text-center py-8" data-testid="text-no-stories">
                  No stories yet. Create your first one!
                </p>
              ) : (
                <div className="space-y-3">
                  {stories.slice(0, 5).map((story) => (
                    <div
                      key={story.id}
                      className="flex items-start justify-between gap-4 p-3 rounded-lg hover-elevate border"
                      data-testid={`item-recent-story-${story.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" data-testid={`text-story-title-${story.id}`}>
                          {story.heroName}'s {story.theme || "Adventure"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {story.createdAt && format(new Date(story.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      {story.isFavorite === 'true' && (
                        <Badge variant="secondary" className="shrink-0">Favorite</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-purchase-history">
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              {!payments || payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8" data-testid="text-no-purchases">
                  No credit purchases yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      data-testid={`item-payment-${payment.id}`}
                    >
                      <div>
                        <div className="font-medium" data-testid={`text-credits-added-${payment.id}`}>
                          +{payment.creditsAdded} Credits
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.createdAt && format(new Date(payment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      <Badge variant="default">Completed</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

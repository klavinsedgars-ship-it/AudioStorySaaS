import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Users, DollarSign, BookOpen, Search, Shield } from "lucide-react";
import type { User } from "@shared/schema";
import { format } from "date-fns";

type Payment = {
  id: string;
  userId: string;
  creditsAdded: number;
  createdAt: string;
};

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.isAdmin === 'true',
    retry: false,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
    enabled: isAuthenticated && user?.isAdmin === 'true',
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.isAdmin !== 'true')) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
    }
  }, [authLoading, isAuthenticated, user, toast]);

  if (authLoading || usersLoading || paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.isAdmin !== 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md border-2">
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You do not have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md border-2">
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Error loading admin data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalRevenue = payments?.reduce((sum, p) => {
    const creditPrices: { [key: number]: number } = { 5: 4.99, 15: 12.99, 30: 19.99 };
    return sum + (creditPrices[p.creditsAdded] || 0);
  }, 0) || 0;
  const totalStoriesCreated = users?.reduce((sum, u) => sum + u.totalStories, 0) || 0;

  const filteredUsers = users?.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Shield className="w-10 h-10 text-primary" />
          <div>
            <h1 
              className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              data-testid="text-admin-title"
            >
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Platform Overview & User Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2" data-testid="card-total-users">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-users">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-total-revenue">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-revenue">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From credit purchases</p>
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-total-stories">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Stories Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-stories-created">{totalStoriesCreated}</div>
              <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2" data-testid="card-users-list">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Users</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                    data-testid="input-search-users"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border"
                    data-testid={`item-user-${u.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate flex items-center gap-2" data-testid={`text-user-name-${u.id}`}>
                        {u.firstName || u.email}
                        {u.isAdmin === 'true' && <Badge variant="destructive" className="text-xs">Admin</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined: {u.createdAt && format(new Date(u.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="secondary">{u.credits} credits</Badge>
                      <div className="text-xs text-muted-foreground mt-1">{u.totalStories} stories</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2" data-testid="card-transactions">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {!payments || payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8" data-testid="text-no-transactions">
                  No transactions yet.
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {payments.slice(0, 20).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      data-testid={`item-transaction-${payment.id}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium" data-testid={`text-transaction-credits-${payment.id}`}>
                          +{payment.creditsAdded} Credits
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          User: {users?.find(u => u.id === payment.userId)?.email || payment.userId.slice(0, 8)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {payment.createdAt && format(new Date(payment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      <Badge variant="default">
                        ${((payment.creditsAdded === 5 ? 4.99 : payment.creditsAdded === 15 ? 12.99 : 19.99)).toFixed(2)}
                      </Badge>
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

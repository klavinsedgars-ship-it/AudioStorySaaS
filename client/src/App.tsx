import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/landing";
import Creator from "@/pages/creator";
import Bookshelf from "@/pages/bookshelf";
import BuyCredits from "@/pages/buy-credits";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import SharedStory from "@/pages/shared-story";
import StoryLoading from "@/pages/story-loading";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Navbar />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Creator} />
            <Route path="/bookshelf" component={Bookshelf} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/admin" component={Admin} />
            <Route path="/buy-credits" component={BuyCredits} />
            <Route path="/story/generating/:storyId" component={StoryLoading} />
          </>
        )}
        <Route path="/shared/:token" component={SharedStory} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="fixed inset-0 -z-10 magical-bg-pattern" aria-hidden="true" />
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

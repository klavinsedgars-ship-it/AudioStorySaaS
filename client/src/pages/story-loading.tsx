import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Music, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

type StoryStatus = 'pending' | 'gen_audio' | 'gen_image' | 'complete' | 'failed_audio' | 'failed_image';

interface StoryStatusResponse {
  id: string;
  status: StoryStatus;
  audioPath: string | null;
  imageUrl: string | null;
}

export default function StoryLoading() {
  const { storyId } = useParams<{ storyId: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [status, setStatus] = useState<StoryStatus>('pending');
  const [pollingInterval, setPollingInterval] = useState(2500);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasTimeout, setHasTimeout] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

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

  useEffect(() => {
    if (!storyId || !isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;
    let elapsedTimerId: NodeJS.Timeout;

    const pollStoryStatus = async () => {
      try {
        const response = await fetch(`/api/story/status/${storyId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast({
              title: "Unauthorized",
              description: "You don't have access to this story",
              variant: "destructive",
            });
            setLocation("/");
            return;
          }
          throw new Error("Failed to fetch story status");
        }

        const data: StoryStatusResponse = await response.json();
        setStatus(data.status);

        if (data.status === 'complete') {
          toast({
            title: "Story Ready!",
            description: "Your magical story is complete",
          });
          setTimeout(() => {
            setLocation("/bookshelf");
          }, 1000);
        } else if (data.status === 'failed_audio' || data.status === 'failed_image') {
          setIsFailed(true);
        } else {
          timeoutId = setTimeout(pollStoryStatus, pollingInterval);
        }
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
        } else {
          console.error("Poll error:", error);
          timeoutId = setTimeout(pollStoryStatus, pollingInterval);
        }
      }
    };

    pollStoryStatus();

    elapsedTimerId = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        if (newTime === 30) {
          setPollingInterval(5000);
        }
        
        if (newTime >= 300) {
          setHasTimeout(true);
          return newTime;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(elapsedTimerId);
    };
  }, [storyId, isAuthenticated, pollingInterval, toast, t, setLocation]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-auth" />
      </div>
    );
  }

  const getStatusStep = () => {
    if (status === 'complete') return 3;
    if (status === 'gen_image' || status === 'failed_image') return 2;
    if (status === 'gen_audio' || status === 'failed_audio') return 1;
    return 0;
  };

  const currentStep = getStatusStep();

  const steps = [
    { label: "Preparing story", icon: Sparkles, step: 0 },
    { label: "Creating audio narration", icon: Music, step: 1 },
    { label: "Generating magical illustration", icon: ImageIcon, step: 2 },
    { label: "Story complete", icon: CheckCircle, step: 3 },
  ];

  if (hasTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <Card className="max-w-lg w-full shadow-2xl" data-testid="card-timeout">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" data-testid="icon-timeout" />
            <h2 className="text-2xl font-bold mb-4">Generation Taking Longer Than Expected</h2>
            <p className="text-muted-foreground mb-6">
              Your story is still being created, but it's taking longer than usual. 
              Please check your bookshelf in a few moments.
            </p>
            <Button 
              onClick={() => setLocation("/bookshelf")} 
              className="w-full"
              data-testid="button-go-to-bookshelf"
            >
              Go to Bookshelf
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <Card className="max-w-lg w-full shadow-2xl" data-testid="card-failed">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" data-testid="icon-failed" />
            <h2 className="text-2xl font-bold mb-4">Story Generation Failed</h2>
            <p className="text-muted-foreground mb-6">
              {status === 'failed_audio' 
                ? "We couldn't generate the audio for your story. Your credit has been preserved."
                : "We couldn't generate the illustration for your story, but your audio is ready!"}
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setLocation("/bookshelf")} 
                className="w-full"
                data-testid="button-view-story"
              >
                {status === 'failed_audio' ? 'Back to Creator' : 'View Story'}
              </Button>
              <Button 
                onClick={() => setLocation("/")} 
                variant="outline"
                className="w-full"
                data-testid="button-try-again"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <Card className="max-w-2xl w-full shadow-2xl" data-testid="card-loading">
        <CardContent className="p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 animate-pulse" data-testid="icon-magic-wand">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-quicksand bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
              Creating Your Magical Story
            </h1>
            <p className="text-muted-foreground text-lg">
              Sprinkling some stardust and weaving your tale...
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step;
              
              return (
                <div 
                  key={item.step}
                  className="flex items-center gap-4"
                  data-testid={`step-${item.step}`}
                >
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full transition-all
                    ${isCompleted ? 'bg-green-500 dark:bg-green-600' : ''}
                    ${isActive ? 'bg-purple-500 dark:bg-purple-600 animate-pulse' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 dark:bg-gray-700' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" data-testid={`icon-completed-${item.step}`} />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} data-testid={`icon-step-${item.step}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </p>
                  </div>
                  {isActive && (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" data-testid={`loader-step-${item.step}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-muted rounded-lg p-4 text-center" data-testid="text-elapsed-time">
            <p className="text-sm text-muted-foreground">
              Elapsed time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This usually takes 30-60 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

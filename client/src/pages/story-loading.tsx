import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { MagicalLoading } from "@/components/MagicalLoading";

interface StoryStatus {
  id: string;
  status: string;
  audioPath: string | null;
  imageUrl: string | null;
}

interface Step {
  id: string;
  label: string;
  completedStatuses: string[];
}

const GENERATION_STEPS: Step[] = [
  {
    id: "preparing",
    label: "Preparing your story...",
    completedStatuses: ["gen_audio", "gen_image", "complete"],
  },
  {
    id: "audio",
    label: "Creating audio narration...",
    completedStatuses: ["gen_image", "complete"],
  },
  {
    id: "illustration",
    label: "Generating magical illustration...",
    completedStatuses: ["complete"],
  },
];

export default function StoryLoading() {
  const [, params] = useRoute("/story/generating/:storyId");
  const [, setLocation] = useLocation();
  const storyId = params?.storyId;

  const [storyStatus, setStoryStatus] = useState<StoryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    if (!storyId) {
      setLocation("/");
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let pollDelay = 2500; // Start with 2.5 seconds
    const maxDelay = 5000; // Cap at 5 seconds
    const timeout = 5 * 60 * 1000; // 5 minute timeout
    const startTime = Date.now();
    let backoffStartTime = startTime;

    const pollStoryStatus = async () => {
      try {
        // Check timeout
        if (Date.now() - startTime > timeout) {
          setTimeoutReached(true);
          setError("Story generation is taking longer than expected. Please check your bookshelf in a few moments.");
          // Redirect to bookshelf after showing message
          setTimeout(() => {
            setLocation("/bookshelf");
          }, 5000);
          return;
        }

        const response = await apiRequest("GET", `/api/story/status/${storyId}`);
        const data = (await response.json()) as StoryStatus;
        setStoryStatus(data);

        if (data.status === "complete") {
          // Success! Redirect to bookshelf
          setTimeout(() => {
            setLocation("/bookshelf");
          }, 1500); // Brief delay to show completion
          return;
        } else if (data.status === "failed_audio") {
          setError("Audio generation failed. Your story has been saved but without audio. Please try again.");
          setTimeout(() => {
            setLocation("/bookshelf");
          }, 5000);
          return;
        } else if (data.status === "failed_image") {
          setError("Illustration generation failed, but your audio story is ready! Redirecting to your bookshelf...");
          setTimeout(() => {
            setLocation("/bookshelf");
          }, 3000);
          return;
        } else {
          // Continue polling with exponential backoff after 30 seconds
          if (Date.now() - backoffStartTime > 30000) {
            pollDelay = Math.min(pollDelay * 1.5, maxDelay);
          }
          pollInterval = setTimeout(pollStoryStatus, pollDelay);
        }
      } catch (error: any) {
        console.error("Poll error:", error);
        // Continue polling on network errors
        pollInterval = setTimeout(pollStoryStatus, pollDelay);
      }
    };

    // Start first poll immediately
    pollStoryStatus();

    // Cleanup
    return () => {
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [storyId, setLocation]);

  const getStepStatus = (step: Step): "pending" | "in-progress" | "completed" | "failed" => {
    if (!storyStatus) return "pending";

    const currentStatus = storyStatus.status;

    // Check if failed
    if (currentStatus === "failed_audio" || currentStatus === "failed_image") {
      if (step.id === "audio" && currentStatus === "failed_audio") return "failed";
      if (step.id === "illustration" && currentStatus === "failed_image") return "failed";
    }

    // Check if completed
    if (step.completedStatuses.includes(currentStatus)) {
      return "completed";
    }

    // Check if in progress
    if (step.id === "preparing" && currentStatus === "pending") return "in-progress";
    if (step.id === "audio" && currentStatus === "gen_audio") return "in-progress";
    if (step.id === "illustration" && currentStatus === "gen_image") return "in-progress";

    return "pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-background to-background dark:from-purple-950/20 dark:via-background dark:to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 shadow-2xl" data-testid="card-story-loading">
        <CardContent className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" data-testid="text-loading-title">
              Creating Your Magical Story
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              This usually takes 30-60 seconds. Please don't close this page.
            </p>
          </div>

          {/* Magical Loading Animation */}
          <div className="flex justify-center mb-8">
            <MagicalLoading message="Sprinkling stardust and magic..." />
          </div>

          {/* Progress Steps */}
          {!timeoutReached && !error && (
            <div className="space-y-4 mb-6">
              {GENERATION_STEPS.map((step) => {
                const status = getStepStatus(step);
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 transition-all"
                    data-testid={`step-${step.id}`}
                  >
                    <div className="flex-shrink-0">
                      {status === "completed" && (
                        <CheckCircle className="w-6 h-6 text-green-500" data-testid={`icon-${step.id}-completed`} />
                      )}
                      {status === "in-progress" && (
                        <Loader2 className="w-6 h-6 text-primary animate-spin" data-testid={`icon-${step.id}-in-progress`} />
                      )}
                      {status === "failed" && (
                        <XCircle className="w-6 h-6 text-destructive" data-testid={`icon-${step.id}-failed`} />
                      )}
                      {status === "pending" && (
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" data-testid={`icon-${step.id}-pending`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          status === "in-progress"
                            ? "text-foreground"
                            : status === "completed"
                            ? "text-muted-foreground"
                            : status === "failed"
                            ? "text-destructive"
                            : "text-muted-foreground/60"
                        }`}
                        data-testid={`text-${step.id}`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Error or Timeout Message */}
          {(error || timeoutReached) && (
            <div className="mt-6 p-6 rounded-xl bg-destructive/10 border border-destructive/20" data-testid="error-message">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">
                    {timeoutReached ? "Taking Longer Than Expected" : "Generation Issue"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/bookshelf")}
                  className="flex-1"
                  data-testid="button-go-to-bookshelf"
                >
                  Go to Bookshelf
                </Button>
                <Button
                  onClick={() => setLocation("/")}
                  className="flex-1"
                  data-testid="button-try-again"
                >
                  Create New Story
                </Button>
              </div>
            </div>
          )}

          {/* Current Status Debug Info (only shown if we have status data) */}
          {storyStatus && !error && !timeoutReached && (
            <div className="mt-6 text-center text-xs text-muted-foreground" data-testid="status-debug">
              Status: {storyStatus.status}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface MagicalLoadingBarProps {
  status: string;
}

const messages: Record<string, string> = {
  gen_audio: "Generating audio...",
  gen_image: "Creating illustration...",
  complete: "Your story is ready!",
  failed: "Something went wrong. Please try again.",
  generating: "Processing your story..."
};

export function MagicalLoadingBar({ status }: MagicalLoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'gen_audio' || status === 'gen_image' || status === 'generating') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + (100 / 90);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const isLoading = status === 'gen_audio' || status === 'gen_image' || status === 'generating';

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-4 text-center" data-testid="magical-loading-bar">
      <div className="flex justify-center items-center gap-3">
        {isLoading && <Loader2 className="w-6 h-6 text-foreground animate-spin" />}
        <h3 className="text-lg font-medium text-foreground">
          {messages[status] || "Loading..."}
        </h3>
      </div>

      <div className="w-full">
        <Progress 
          value={isLoading ? progress : (status === 'complete' ? 100 : 0)} 
          className="h-2"
          data-testid="progress-bar"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {isLoading ? "This usually takes 60-90 seconds." : (status === 'complete' ? "Complete!" : "")}
      </p>
    </div>
  );
}

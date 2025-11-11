import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MagicalLoadingProps {
  message?: string;
}

export function MagicalLoading({ message = "Loading..." }: MagicalLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 8;
        return Math.min(prev + increment, 95);
      });
    }, 600);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-4" data-testid="magical-loading">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-foreground animate-spin" />

        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">
            {message}
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" data-testid="progress-bar" />
        <p className="text-xs text-center text-muted-foreground" data-testid="text-progress">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

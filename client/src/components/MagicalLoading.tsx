import { useEffect, useState } from "react";
import { Sparkles, Star, Wand2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MagicalLoadingProps {
  message?: string;
}

export function MagicalLoading({ message = "Creating magic..." }: MagicalLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    "Sprinkling stardust...",
    "Weaving the story...",
    "Adding magical touches...",
    "Almost ready..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 10;
        return Math.min(prev + increment, 95);
      });
    }, 500);

    const phaseInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phases.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto p-8 space-y-6" data-testid="magical-loading">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-75" />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-pink-400 rounded-full animate-pulse delay-150" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-500" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Wand2 className="w-16 h-16 text-primary animate-bounce" />
          <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          <Star className="w-6 h-6 text-purple-400 absolute -bottom-1 -left-1 animate-ping" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-display font-semibold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            {message}
          </h3>
          <p className="text-sm text-muted-foreground animate-pulse" data-testid="text-loading-phase">
            {phases[phase]}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-3" data-testid="progress-bar" />
        <p className="text-xs text-center text-muted-foreground" data-testid="text-progress">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

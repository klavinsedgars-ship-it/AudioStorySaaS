import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Wand2 } from "lucide-react";

interface MagicalLoadingBarProps {
  status: string;
}

const messages: Record<string, string> = {
  gen_audio: "Warming up the narrator's voice...",
  gen_image: "Painting your magical illustration...",
  complete: "Your story is ready!",
  failed: "Oh no! The magic fizzled. Please try again.",
  generating: "Sprinkling stardust on your story..."
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
    <div className="w-full max-w-md mx-auto p-8 space-y-6 text-center" data-testid="magical-loading-bar">
      <div className="flex justify-center items-center gap-4">
        <Wand2 className="w-8 h-8 text-primary animate-bounce" />
        <h3 className="text-xl font-display font-semibold text-primary">
          {messages[status] || "Creating magic..."}
        </h3>
      </div>

      <div className="relative w-full">
        <Progress 
          value={isLoading ? progress : (status === 'complete' ? 100 : 0)} 
          className="h-4 transition-all duration-1000 ease-linear"
          data-testid="progress-bar"
        />
        {isLoading && (
          <Sparkles 
            className="w-5 h-5 text-yellow-400 absolute -top-1 transition-all duration-1000 ease-linear" 
            style={{ left: `calc(${progress}% - 10px)` }} 
          />
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {isLoading ? "It usually takes 60-90 seconds to generate." : (status === 'complete' ? "All done!" : "")}
      </p>
    </div>
  );
}

import { Check, User, Sparkles, Wand2, Music, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressConstellationProps {
  currentStep: 'hero' | 'theme' | 'story' | 'audio' | 'complete';
  className?: string;
}

const steps = [
  { id: 'hero', label: 'Name Your Hero', icon: User },
  { id: 'theme', label: 'Choose Adventure', icon: Sparkles },
  { id: 'story', label: 'Read Preview', icon: Wand2 },
  { id: 'audio', label: 'Create Magic', icon: Music },
  { id: 'complete', label: 'Story Ready!', icon: Star },
];

export function ProgressConstellation({ currentStep, className }: ProgressConstellationProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className={cn("relative py-8", className)}>
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center relative flex-1">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute left-1/2 top-6 h-0.5 w-full z-0",
                    isComplete ? "bg-primary" : "bg-primary/20"
                  )}
                  style={{
                    background: isComplete 
                      ? 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))' 
                      : undefined
                  }}
                />
              )}

              {/* Star/Circle */}
              <div 
                className={cn(
                  "relative z-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
                  isComplete && "w-12 h-12 bg-primary text-primary-foreground shadow-lg",
                  isCurrent && "w-14 h-14 bg-gradient-to-br from-primary to-accent text-white shadow-xl twinkle magical-glow",
                  isUpcoming && "w-10 h-10 bg-background border-2 border-primary/30 text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className={cn(
                    "transition-all",
                    isCurrent && "w-7 h-7",
                    isUpcoming && "w-5 h-5"
                  )} />
                )}
              </div>

              {/* Label */}
              <p className={cn(
                "text-xs text-center font-display transition-all",
                isCurrent && "font-bold text-primary scale-110",
                isComplete && "text-foreground",
                isUpcoming && "text-muted-foreground"
              )}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

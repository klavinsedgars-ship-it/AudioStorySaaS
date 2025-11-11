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
    <div className={cn("relative py-6", className)}>
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
                    "absolute left-1/2 top-5 h-0.5 w-full z-0",
                    isComplete ? "bg-foreground" : "bg-border"
                  )}
                />
              )}

              {/* Circle */}
              <div 
                className={cn(
                  "relative z-10 rounded-full flex items-center justify-center mb-2 transition-all",
                  isComplete && "w-10 h-10 bg-foreground text-background",
                  isCurrent && "w-11 h-11 bg-foreground text-background border-2 border-foreground",
                  isUpcoming && "w-9 h-9 bg-background border-2 border-border text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className={cn(
                    "transition-all",
                    isCurrent && "w-5 h-5",
                    isUpcoming && "w-4 h-4"
                  )} />
                )}
              </div>

              {/* Label */}
              <p className={cn(
                "text-xs text-center font-medium transition-all",
                isCurrent && "font-semibold text-foreground",
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

import { Star, Check } from 'lucide-react';

interface ConstellationStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface ConstellationProps {
  steps: ConstellationStep[];
  className?: string;
}

export function Constellation({ steps, className = '' }: ConstellationProps) {
  return (
    <div className={`flex items-center justify-between ${className}`} data-testid="constellation-tracker">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Star node */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${step.completed ? 'bg-primary border-primary magical-glow' : ''}
                ${step.active ? 'bg-primary/20 border-primary scale-110' : ''}
                ${!step.completed && !step.active ? 'bg-muted border-border' : ''}
              `}
            >
              {step.completed ? (
                <Check className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Star className={`w-5 h-5 ${step.active ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
            </div>
            <span className="text-xs mt-2 font-medium text-center max-w-[80px]">{step.label}</span>
          </div>
          
          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 relative" style={{ top: '-20px' }}>
              <div className="absolute inset-0 bg-border" />
              <div 
                className={`absolute inset-0 bg-primary transition-all duration-500 ${
                  steps[index + 1].completed || steps[index + 1].active ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

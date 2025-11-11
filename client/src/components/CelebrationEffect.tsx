import { useEffect, useState } from 'react';
import { Sparkles, PartyPopper } from 'lucide-react';

interface CelebrationEffectProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export function CelebrationEffect({ show, message = "Story Complete!", onComplete }: CelebrationEffectProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['text-primary', 'text-secondary', 'text-accent', 'text-yellow-400'][Math.floor(Math.random() * 4)]
      }));
      setConfetti(pieces);

      // Clear after animation completes
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`absolute top-0 ${piece.color} confetti-fall`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`
          }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
      ))}

      {/* Center celebration message */}
      <div className="bg-white dark:bg-card rounded-3xl shadow-2xl p-8 border-4 border-primary/30 magical-glow pointer-events-auto book-open">
        <div className="flex flex-col items-center gap-4">
          <PartyPopper className="w-16 h-16 text-primary balloon-float" />
          <h2 className="text-3xl font-display font-bold text-primary text-center">
            {message}
          </h2>
          <div className="flex gap-2">
            <Sparkles className="w-6 h-6 text-accent sparkle-effect" />
            <Sparkles className="w-6 h-6 text-primary sparkle-effect" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="w-6 h-6 text-secondary sparkle-effect" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

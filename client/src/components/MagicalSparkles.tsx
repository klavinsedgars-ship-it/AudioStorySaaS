import { Sparkles } from 'lucide-react';

interface MagicalSparklesProps {
  count?: number;
  className?: string;
}

export function MagicalSparkles({ count = 5, className = '' }: MagicalSparklesProps) {
  const colorClasses = ['text-primary', 'text-accent', 'text-secondary', 'text-yellow-400', 'text-pink-400', 'text-purple-400'];
  
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)]
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
          }}
        >
          <Sparkles
            className={`${sparkle.colorClass} twinkle`}
            style={{
              width: sparkle.size,
              height: sparkle.size,
              animationDelay: `${sparkle.delay}s`
            }}
          />
        </div>
      ))}
    </div>
  );
}

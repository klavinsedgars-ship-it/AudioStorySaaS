import { BookOpen } from 'lucide-react';

interface FloatingBookProps {
  delay?: number;
  className?: string;
}

export function FloatingBook({ delay = 0, className = '' }: FloatingBookProps) {
  return (
    <div 
      className={`gentle-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative">
        {/* Book shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-primary/10 rounded-full blur-md" />
        
        {/* Book */}
        <div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4 rounded-lg shadow-lg border-2 border-primary/30">
          <BookOpen className="w-8 h-8 text-primary" />
          
          {/* Sparkle */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full sparkle-effect" />
        </div>
      </div>
    </div>
  );
}

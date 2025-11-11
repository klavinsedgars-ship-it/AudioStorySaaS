interface StoryPortalProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StoryPortal({ size = 'md', className = '' }: StoryPortalProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-primary/30 portal-swirl" />
      
      {/* Middle ring */}
      <div className="absolute inset-4 rounded-full border-4 border-primary/50 portal-swirl" style={{ animationDelay: '-0.5s' }} />
      
      {/* Inner ring */}
      <div className="absolute inset-8 rounded-full border-4 border-primary/70 portal-swirl" style={{ animationDelay: '-1s' }} />
      
      {/* Center glow */}
      <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 blur-xl" />
      
      {/* Sparkles */}
      <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full sparkle-effect" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full sparkle-effect" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 right-0 w-2 h-2 bg-secondary rounded-full sparkle-effect" style={{ animationDelay: '1s' }} />
    </div>
  );
}

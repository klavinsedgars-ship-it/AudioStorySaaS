import { MagicalSparkles } from './MagicalSparkles';

interface ScallopedDividerProps {
  flip?: boolean;
  withSparkles?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'background';
  className?: string;
}

export function ScallopedDivider({ 
  flip = false, 
  withSparkles = true,
  color = 'background',
  className = '' 
}: ScallopedDividerProps) {
  const colorMap = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))'
  };

  return (
    <div className={`relative w-full h-16 ${className}`}>
      <svg
        className={`absolute w-full h-full ${flip ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill={colorMap[color]}
          d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z"
        />
        <path
          fill={colorMap[color]}
          fillOpacity="0.5"
          d="M0,80 C240,100 480,100 720,80 C960,60 1200,60 1440,80 L1440,120 L0,120 Z"
        />
      </svg>
      
      {withSparkles && (
        <div className="absolute inset-0">
          <MagicalSparkles count={3} />
        </div>
      )}
    </div>
  );
}

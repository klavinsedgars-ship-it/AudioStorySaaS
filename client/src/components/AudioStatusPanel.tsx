import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AudioStatusPanelProps {
  storyId: string | null;
  audioPath: string | null;
  status: string | null;
  heroName: string;
}

export function AudioStatusPanel({ storyId, audioPath, status, heroName }: AudioStatusPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Failed audio state
  if (status === 'failed_audio') {
    return (
      <Card className="border-2 border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <div className="flex-1">
              <h4 className="font-semibold text-destructive mb-1">Audio Generation Failed</h4>
              <p className="text-sm text-muted-foreground">
                We couldn't create the audio for this story. Your credit has been preserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No audio yet
  if (!audioPath || !storyId) {
    return null;
  }

  const audioSrc = `/api/audio/${storyId}`;

  return (
    <Card className="border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Volume2 className="w-6 h-6 text-primary" />
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Listen to {heroName}'s Story</h4>
            
            {/* Audio Element */}
            <audio ref={audioRef} src={audioSrc} data-testid="audio-player" />
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="default"
                onClick={togglePlay}
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

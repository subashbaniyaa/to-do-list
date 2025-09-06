import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, Square, Clock } from 'lucide-react';

interface TimeTrackerProps {
  taskId: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  isRunning?: boolean;
  onStart: (taskId: string) => void;
  onPause: (taskId: string) => void;
  onStop: (taskId: string, totalMinutes: number) => void;
}

export function TimeTracker({ 
  taskId, 
  estimatedMinutes, 
  actualMinutes = 0, 
  isRunning = false,
  onStart, 
  onPause, 
  onStop 
}: TimeTrackerProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 60000);
        setSessionTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    setStartTime(Date.now());
    setSessionTime(0);
    onStart(taskId);
  };

  const handlePause = () => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 60000);
      onStop(taskId, actualMinutes + elapsed + sessionTime);
    }
    setStartTime(null);
    setSessionTime(0);
    onPause(taskId);
  };

  const handleStop = () => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 60000);
      onStop(taskId, actualMinutes + elapsed + sessionTime);
    }
    setStartTime(null);
    setSessionTime(0);
  };

  const totalMinutes = actualMinutes + sessionTime;
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{formatTime(totalMinutes)}</span>
        {estimatedMinutes && (
          <>
            <span>/</span>
            <span className={totalMinutes > estimatedMinutes ? 'text-red-500' : 'text-green-500'}>
              {formatTime(estimatedMinutes)}
            </span>
          </>
        )}
      </div>
      
      <div className="flex gap-1">
        {!isRunning ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStart}
            className="h-6 w-6 p-0"
          >
            <Play className="w-3 h-3" />
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePause}
              className="h-6 w-6 p-0"
            >
              <Pause className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleStop}
              className="h-6 w-6 p-0"
            >
              <Square className="w-3 h-3" />
            </Button>
          </>
        )}
      </div>

      {isRunning && (
        <Badge variant="secondary" className="text-xs">
          Recording
        </Badge>
      )}
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { Save, Check, Download } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from 'sonner';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function AutoSaveIndicator() {
  const { exportJSON } = useResume();
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [displayTime, setDisplayTime] = useState('just now');
  const [showCheck, setShowCheck] = useState(false);

  // Listen for localStorage writes to detect auto-saves
  useEffect(() => {
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key: string, value: string) {
      originalSetItem(key, value);
      if (key === 'resumeforge_data') {
        setLastSaved(new Date());
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 2000);
      }
    };
    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Update display time every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(timeAgo(lastSaved));
    }, 10000);
    setDisplayTime(timeAgo(lastSaved));
    return () => clearInterval(interval);
  }, [lastSaved]);

  const handleManualSave = useCallback(() => {
    exportJSON();
    toast.success('Resume saved as JSON file');
  }, [exportJSON]);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        {showCheck ? (
          <Check className="size-3.5 text-green-500 animate-in fade-in duration-200" />
        ) : (
          <Save className="size-3.5" />
        )}
        <span className="font-medium">
          Saved {displayTime}
        </span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleManualSave}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Save as JSON"
          >
            <Download className="size-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Save as JSON file</TooltipContent>
      </Tooltip>
    </div>
  );
}

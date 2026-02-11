import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShortcutItem {
  keys: string[];
  label: string;
  category: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['?'], label: 'Toggle keyboard shortcuts', category: 'General' },
  { keys: ['Esc'], label: 'Close modal / overlay', category: 'General' },
  { keys: ['Ctrl', 'P'], label: 'Print resume', category: 'Export' },
  { keys: ['Ctrl', 'S'], label: 'Export as JSON', category: 'Export' },
  { keys: ['Ctrl', 'Shift', 'E'], label: 'Export as PDF', category: 'Export' },
  { keys: ['1'], label: 'Personal tab', category: 'Navigation' },
  { keys: ['2'], label: 'Experience tab', category: 'Navigation' },
  { keys: ['3'], label: 'Education tab', category: 'Navigation' },
  { keys: ['4'], label: 'Skills tab', category: 'Navigation' },
  { keys: ['5'], label: 'Projects tab', category: 'Navigation' },
  { keys: ['6'], label: 'Certifications tab', category: 'Navigation' },
  { keys: ['7'], label: 'Section Order tab', category: 'Navigation' },
];

function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i}>
          {i > 0 && <span className="text-muted-foreground mx-0.5">+</span>}
          <kbd
            className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[11px] font-mono font-medium rounded-md"
            style={{
              background: 'var(--md3-surface-container-highest)',
              border: '1px solid var(--md3-outline-variant)',
              color: 'var(--md3-on-surface)',
              boxShadow: '0 1px 0 var(--md3-outline-variant)',
            }}
          >
            {key}
          </kbd>
        </span>
      ))}
    </div>
  );
}

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  const grouped = SHORTCUTS.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      e.preventDefault();
      setOpen(prev => !prev);
      return;
    }

    if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (isInput) return;
  }, [open]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="relative w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden rounded-3xl"
            style={{
              background: 'var(--md3-surface-container)',
              border: '1px solid var(--md3-outline-variant)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
              <div className="flex items-center gap-3">
                <Keyboard className="size-5" style={{ color: 'var(--md3-primary)' }} />
                <h2 className="font-display text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <Button variant="ghost" size="icon" className="size-9 rounded-full" onClick={() => setOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] px-6 py-4 space-y-5">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3
                    className="text-[11px] font-display font-semibold uppercase tracking-wider mb-2.5"
                    style={{ color: 'var(--md3-on-surface-variant)' }}
                  >
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {items.map((shortcut, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <span className="text-sm">{shortcut.label}</span>
                        <KeyCombo keys={shortcut.keys} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="px-6 py-3 text-center"
              style={{ borderTop: '1px solid var(--md3-outline-variant)', background: 'var(--md3-surface-container-low)' }}
            >
              <span className="text-xs text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded" style={{ background: 'var(--md3-surface-container-highest)', border: '1px solid var(--md3-outline-variant)' }}>?</kbd> anywhere to toggle this overlay
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, List, AlignLeft, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulletPointEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Optimal bullet length: 60–120 chars ≈ 1–2 lines on a resume
const OPTIMAL_MIN = 60;
const OPTIMAL_MAX = 120;
const WARNING_MAX = 160;

function getLengthStatus(len: number): { label: string; color: string; bg: string } {
  if (len === 0) return { label: '', color: 'var(--md3-on-surface-variant)', bg: 'var(--md3-outline-variant)' };
  if (len < OPTIMAL_MIN) return { label: 'Short', color: 'var(--md3-on-tertiary-container)', bg: 'var(--md3-tertiary-container)' };
  if (len <= OPTIMAL_MAX) return { label: 'Good', color: 'var(--md3-on-primary-container)', bg: 'var(--md3-primary-container)' };
  if (len <= WARNING_MAX) return { label: 'Long', color: 'var(--md3-on-tertiary-container)', bg: 'var(--md3-tertiary-container)' };
  return { label: 'Too long', color: 'var(--md3-on-error-container)', bg: 'var(--md3-error-container)' };
}

function getProgressPercent(len: number): number {
  if (len === 0) return 0;
  return Math.min(100, (len / OPTIMAL_MAX) * 100);
}

function getProgressColor(len: number): string {
  if (len === 0) return 'var(--md3-outline-variant)';
  if (len < OPTIMAL_MIN) return 'var(--md3-tertiary)';
  if (len <= OPTIMAL_MAX) return 'var(--md3-primary)';
  if (len <= WARNING_MAX) return 'var(--md3-tertiary)';
  return 'var(--md3-error)';
}

function parseBullets(text: string): string[] {
  if (!text.trim()) return [''];
  const lines = text.split('\n').filter(l => l.trim());
  return lines.length > 0
    ? lines.map(l => l.replace(/^[\-\•\*]\s*/, '').trim())
    : [''];
}

function serializeBullets(bullets: string[]): string {
  return bullets
    .filter(b => b.trim())
    .map(b => `- ${b}`)
    .join('\n');
}

export default function BulletPointEditor({ value, onChange, placeholder }: BulletPointEditorProps) {
  const [mode, setMode] = useState<'bullets' | 'text'>(() => {
    if (!value.trim()) return 'bullets';
    const lines = value.split('\n').filter(l => l.trim());
    const hasBullets = lines.some(l => /^[\-\•\*]\s/.test(l));
    return hasBullets || lines.length > 1 ? 'bullets' : 'text';
  });

  const [bullets, setBullets] = useState<string[]>(() => parseBullets(value));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const justAddedRef = useRef(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const parsed = parseBullets(value);
    const currentSerialized = serializeBullets(bullets);
    if (value !== currentSerialized) {
      setBullets(parsed);
    }
  }, [value]);

  useEffect(() => {
    if (justAddedRef.current) {
      const lastIdx = bullets.length - 1;
      inputRefs.current[lastIdx]?.focus();
      justAddedRef.current = false;
    }
  }, [bullets.length]);

  const updateBullet = useCallback((index: number, text: string) => {
    setBullets(prev => {
      const next = [...prev];
      next[index] = text;
      onChange(serializeBullets(next));
      return next;
    });
  }, [onChange]);

  const addBullet = useCallback(() => {
    justAddedRef.current = true;
    setBullets(prev => [...prev, '']);
  }, []);

  const removeBullet = useCallback((index: number) => {
    setBullets(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        onChange('');
        return [''];
      }
      onChange(serializeBullets(next));
      return next;
    });
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      justAddedRef.current = true;
      setBullets(prev => {
        const next = [...prev];
        next.splice(index + 1, 0, '');
        return next;
      });
    } else if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault();
      removeBullet(index);
      setTimeout(() => {
        const prevIdx = Math.max(0, index - 1);
        inputRefs.current[prevIdx]?.focus();
      }, 50);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.min(bullets.length - 1, index + 1);
      inputRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = Math.max(0, index - 1);
      inputRefs.current[prevIdx]?.focus();
    }
  }, [bullets, removeBullet]);

  // Drag handlers
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      setBullets(prev => {
        const next = [...prev];
        const [removed] = next.splice(dragIndex, 1);
        next.splice(dragOverIndex, 0, removed);
        onChange(serializeBullets(next));
        return next;
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, dragOverIndex, onChange]);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const switchToText = useCallback(() => {
    setMode('text');
  }, []);

  const switchToBullets = useCallback(() => {
    setMode('bullets');
    setBullets(parseBullets(value));
  }, [value]);

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Description</span>
        <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'var(--md3-surface-container-high)' }}>
          <button
            type="button"
            onClick={switchToBullets}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200"
            style={{
              background: mode === 'bullets' ? 'var(--md3-primary-container)' : 'transparent',
              color: mode === 'bullets' ? 'var(--md3-on-primary-container)' : 'var(--md3-on-surface-variant)',
            }}
          >
            <List className="size-3.5" />
            Bullets
          </button>
          <button
            type="button"
            onClick={switchToText}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200"
            style={{
              background: mode === 'text' ? 'var(--md3-primary-container)' : 'transparent',
              color: mode === 'text' ? 'var(--md3-on-primary-container)' : 'var(--md3-on-surface-variant)',
            }}
          >
            <AlignLeft className="size-3.5" />
            Paragraph
          </button>
        </div>
      </div>

      {mode === 'text' ? (
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Key responsibilities and achievements...'}
          rows={4}
          className="text-base min-h-[120px] resize-none"
        />
      ) : (
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {bullets.map((bullet, index) => {
              const len = bullet.trim().length;
              const status = getLengthStatus(len);
              const progress = getProgressPercent(len);
              const progressColor = getProgressColor(len);
              const isDragging = dragIndex === index;
              const isDragOver = dragOverIndex === index && dragIndex !== index;

              return (
                <motion.div
                  key={`bullet-${index}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="group"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragLeave={handleDragLeave}
                  style={{
                    opacity: isDragging ? 0.4 : 1,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {/* Drop indicator line */}
                  {isDragOver && (
                    <div
                      className="h-0.5 rounded-full mb-1 transition-all duration-150"
                      style={{ background: 'var(--md3-primary)', marginLeft: '28px', marginRight: '28px' }}
                    />
                  )}

                  <div className="flex items-center gap-1">
                    {/* Drag handle */}
                    <div
                      className="flex-shrink-0 cursor-grab active:cursor-grabbing p-0.5 rounded opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                      style={{ color: 'var(--md3-on-surface-variant)' }}
                      onMouseDown={(e) => {
                        // Prevent text selection while dragging
                        e.stopPropagation();
                      }}
                    >
                      <GripVertical className="size-3.5" />
                    </div>

                    {/* Bullet number indicator */}
                    <div
                      className="flex-shrink-0 size-5 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{
                        background: bullet.trim() ? 'var(--md3-primary)' : 'var(--md3-outline-variant)',
                        color: bullet.trim() ? 'var(--md3-on-primary)' : 'var(--md3-on-surface-variant)',
                        fontSize: '10px',
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Input */}
                    <Input
                      ref={el => { inputRefs.current[index] = el; }}
                      value={bullet}
                      onChange={e => updateBullet(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      placeholder={index === 0 ? (placeholder || 'Key achievement or responsibility...') : 'Another bullet point...'}
                      className="h-10 text-sm flex-1"
                    />

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeBullet(index)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>

                  {/* Character count bar — only show when bullet has content */}
                  {len > 0 && (
                    <div className="flex items-center gap-2 mt-1 ml-8 pl-1">
                      {/* Progress bar */}
                      <div
                        className="flex-1 h-1 rounded-full overflow-hidden"
                        style={{ background: 'var(--md3-surface-container-highest)', maxWidth: '120px' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            background: progressColor,
                          }}
                        />
                      </div>

                      {/* Count + status */}
                      <span
                        className="text-xs font-medium tabular-nums"
                        style={{ color: status.color, fontSize: '10px' }}
                      >
                        {len}
                        {status.label && (
                          <span
                            className="ml-1 px-1.5 py-0.5 rounded-full"
                            style={{ background: status.bg, color: status.color, fontSize: '9px' }}
                          >
                            {status.label}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add bullet button */}
          <Button
            type="button"
            variant="ghost"
            onClick={addBullet}
            className="w-full h-9 gap-1.5 text-xs border border-dashed rounded-lg mt-1"
            style={{
              borderColor: 'var(--md3-outline-variant)',
              color: 'var(--md3-primary)',
            }}
          >
            <Plus className="size-3.5" />
            Add bullet point
          </Button>

          {/* Helper text */}
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--md3-on-surface-variant)' }}>
              <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--md3-surface-container-high)' }}>Enter</kbd> new bullet
              {' · '}
              <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--md3-surface-container-high)' }}>Backspace</kbd> remove empty
              {' · '}
              <span style={{ color: 'var(--md3-on-surface-variant)' }}>Drag to reorder</span>
            </p>
            <p className="text-xs" style={{ color: 'var(--md3-on-surface-variant)', fontSize: '10px' }}>
              Optimal: {OPTIMAL_MIN}–{OPTIMAL_MAX} chars
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

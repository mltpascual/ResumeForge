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

/**
 * Parse a description string into bullet items.
 * Lines starting with "- ", "• ", or "* " are treated as bullets.
 * If no bullet prefix is found, each non-empty line becomes a bullet.
 */
function parseBullets(text: string): string[] {
  if (!text.trim()) return [''];
  const lines = text.split('\n').filter(l => l.trim());
  return lines.length > 0
    ? lines.map(l => l.replace(/^[\-\•\*]\s*/, '').trim())
    : [''];
}

/**
 * Serialize bullet items back to a description string with "- " prefixes.
 */
function serializeBullets(bullets: string[]): string {
  return bullets
    .filter(b => b.trim())
    .map(b => `- ${b}`)
    .join('\n');
}

export default function BulletPointEditor({ value, onChange, placeholder }: BulletPointEditorProps) {
  const [mode, setMode] = useState<'bullets' | 'text'>(() => {
    // Auto-detect: if value has bullet prefixes or multiple lines, start in bullet mode
    if (!value.trim()) return 'bullets';
    const lines = value.split('\n').filter(l => l.trim());
    const hasBullets = lines.some(l => /^[\-\•\*]\s/.test(l));
    return hasBullets || lines.length > 1 ? 'bullets' : 'text';
  });

  const [bullets, setBullets] = useState<string[]>(() => parseBullets(value));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const justAddedRef = useRef(false);

  // Sync bullets when value changes externally (e.g., sample data loaded)
  useEffect(() => {
    const parsed = parseBullets(value);
    const currentSerialized = serializeBullets(bullets);
    if (value !== currentSerialized) {
      setBullets(parsed);
    }
  }, [value]);

  // Focus the last input when a new bullet is added
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
    setBullets(prev => {
      const next = [...prev, ''];
      // Don't serialize yet — empty bullet shouldn't be saved
      return next;
    });
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
      // Focus previous input
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
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {bullets.map((bullet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 group"
              >
                {/* Bullet indicator */}
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
              </motion.div>
            ))}
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

          <p className="text-xs text-muted-foreground" style={{ color: 'var(--md3-on-surface-variant)' }}>
            Press <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--md3-surface-container-high)' }}>Enter</kbd> to add a new bullet, <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--md3-surface-container-high)' }}>Backspace</kbd> on empty to remove.
          </p>
        </div>
      )}
    </div>
  );
}

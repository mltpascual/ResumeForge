import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthPickerProps {
  value: string; // "YYYY-MM" format (e.g., "2021-03")
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function parseValue(val: string): { year: number; month: number } | null {
  if (!val) return null;
  const [y, m] = val.split('-').map(Number);
  if (!y || !m) return null;
  return { year: y, month: m };
}

function formatDisplay(val: string): string {
  const parsed = parseValue(val);
  if (!parsed) return '';
  return `${MONTH_FULL[parsed.month - 1]} ${parsed.year}`;
}

function toValue(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export default function MonthPicker({ value, onChange, placeholder, disabled }: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(() => parsed?.year || new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Reset view year when opening
  useEffect(() => {
    if (open) {
      setViewYear(parsed?.year || new Date().getFullYear());
    }
  }, [open]);

  const handleSelect = useCallback((month: number) => {
    onChange(toValue(viewYear, month));
    setOpen(false);
  }, [viewYear, onChange]);

  const isSelected = (month: number) => {
    return parsed?.year === viewYear && parsed?.month === month;
  };

  const isCurrentMonth = (month: number) => {
    const now = new Date();
    return now.getFullYear() === viewYear && now.getMonth() + 1 === month;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* MD3 Outlined Text Field */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full h-11 px-3 flex items-center justify-between rounded-xl border text-sm transition-all duration-200 text-left"
        style={{
          borderColor: open ? 'var(--md3-primary)' : 'var(--md3-outline-variant)',
          borderWidth: open ? '2px' : '1px',
          background: 'transparent',
          color: value ? 'var(--md3-on-surface)' : 'var(--md3-on-surface-variant)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span className={value ? '' : 'opacity-60'}>
          {value ? formatDisplay(value) : (placeholder || 'Select month')}
        </span>
        <Calendar
          className="size-4 flex-shrink-0"
          style={{ color: 'var(--md3-on-surface-variant)' }}
        />
      </button>

      {/* MD3 Dropdown Calendar */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-2xl p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: 'var(--md3-surface-container)',
            border: '1px solid var(--md3-outline-variant)',
            minWidth: '260px',
          }}
        >
          {/* Year navigation header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewYear(y => y - 1)}
              className="size-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{ color: 'var(--md3-on-surface-variant)' }}
            >
              <ChevronLeft className="size-4" />
            </button>

            <span
              className="text-sm font-medium select-none"
              style={{ color: 'var(--md3-on-surface)' }}
            >
              {viewYear}
            </span>

            <button
              type="button"
              onClick={() => setViewYear(y => y + 1)}
              className="size-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{ color: 'var(--md3-on-surface-variant)' }}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((name, idx) => {
              const monthNum = idx + 1;
              const selected = isSelected(monthNum);
              const current = isCurrentMonth(monthNum);

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelect(monthNum)}
                  className="h-9 rounded-xl text-xs font-medium transition-all duration-150 hover:opacity-80"
                  style={{
                    background: selected
                      ? 'var(--md3-primary)'
                      : 'transparent',
                    color: selected
                      ? 'var(--md3-on-primary)'
                      : current
                        ? 'var(--md3-primary)'
                        : 'var(--md3-on-surface)',
                    border: current && !selected
                      ? '1px solid var(--md3-primary)'
                      : '1px solid transparent',
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* Clear button */}
          {value && (
            <div className="flex justify-end mt-3 pt-2" style={{ borderTop: '1px solid var(--md3-outline-variant)' }}>
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                style={{ color: 'var(--md3-primary)' }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

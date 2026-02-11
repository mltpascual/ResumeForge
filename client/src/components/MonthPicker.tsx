import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react';

interface MonthPickerProps {
  value: string; // "YYYY-MM" format (e.g., "2021-03")
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Enable "Present" toggle — for end date fields */
  showPresent?: boolean;
  /** Whether "Present" is currently active */
  isPresent?: boolean;
  /** Called when user toggles "Present" on/off */
  onPresentChange?: (present: boolean) => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type View = 'month' | 'year';

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

function getYearRange(centerYear: number): number[] {
  const startYear = centerYear - 5;
  return Array.from({ length: 12 }, (_, i) => startYear + i);
}

export default function MonthPicker({
  value,
  onChange,
  placeholder,
  disabled,
  showPresent,
  isPresent,
  onPresentChange,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(() => parsed?.year || new Date().getFullYear());
  const [view, setView] = useState<View>('month');
  const [yearRangeCenter, setYearRangeCenter] = useState(() => parsed?.year || new Date().getFullYear());
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

  // Reset view when opening
  useEffect(() => {
    if (open) {
      const yr = parsed?.year || new Date().getFullYear();
      setViewYear(yr);
      setYearRangeCenter(yr);
      setView('month');
    }
  }, [open]);

  const handleSelectMonth = useCallback((month: number) => {
    if (isPresent && onPresentChange) {
      onPresentChange(false);
    }
    onChange(toValue(viewYear, month));
    setOpen(false);
  }, [viewYear, onChange, isPresent, onPresentChange]);

  const handleSelectYear = useCallback((year: number) => {
    setViewYear(year);
    setView('month');
  }, []);

  const handlePresentToggle = useCallback(() => {
    if (onPresentChange) {
      const newPresent = !isPresent;
      onPresentChange(newPresent);
      if (newPresent) {
        onChange('');
        setOpen(false);
      }
    }
  }, [isPresent, onPresentChange, onChange]);

  const isSelectedMonth = (month: number) => {
    return parsed?.year === viewYear && parsed?.month === month;
  };

  const isCurrentMonth = (month: number) => {
    const now = new Date();
    return now.getFullYear() === viewYear && now.getMonth() + 1 === month;
  };

  const isSelectedYear = (year: number) => {
    return parsed?.year === year;
  };

  const isCurrentYear = (year: number) => {
    return new Date().getFullYear() === year;
  };

  const yearRange = getYearRange(yearRangeCenter);

  // Display text
  const displayText = isPresent
    ? 'Present'
    : value
      ? formatDisplay(value)
      : (placeholder || 'Select month');

  const isShowingPlaceholder = !isPresent && !value;

  return (
    <div ref={containerRef} className="relative">
      {/* MD3 Outlined Text Field */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full h-11 px-3 flex items-center justify-between rounded-xl border text-sm transition-all duration-200 text-left"
        style={{
          borderColor: isPresent
            ? 'var(--md3-primary)'
            : open
              ? 'var(--md3-primary)'
              : 'var(--md3-outline-variant)',
          borderWidth: open || isPresent ? '2px' : '1px',
          background: isPresent ? 'var(--md3-primary-container)' : 'transparent',
          color: isPresent
            ? 'var(--md3-on-primary-container)'
            : value
              ? 'var(--md3-on-surface)'
              : 'var(--md3-on-surface-variant)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span className={isShowingPlaceholder ? 'opacity-60' : ''}>
          {displayText}
        </span>
        <Calendar
          className="size-4 flex-shrink-0"
          style={{
            color: isPresent ? 'var(--md3-on-primary-container)' : 'var(--md3-on-surface-variant)',
          }}
        />
      </button>

      {/* MD3 Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-2xl p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: 'var(--md3-surface-container)',
            border: '1px solid var(--md3-outline-variant)',
            minWidth: '260px',
          }}
        >
          {/* Present toggle — shown at top when enabled */}
          {showPresent && (
            <button
              type="button"
              onClick={handlePresentToggle}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 transition-all duration-150"
              style={{
                background: isPresent ? 'var(--md3-primary)' : 'var(--md3-surface-container-high)',
                color: isPresent ? 'var(--md3-on-primary)' : 'var(--md3-on-surface)',
              }}
            >
              <span className="text-sm font-medium">Present</span>
              {/* MD3-style toggle indicator */}
              <div
                className="w-10 h-6 rounded-full p-0.5 transition-all duration-200 flex items-center"
                style={{
                  background: isPresent ? 'var(--md3-on-primary)' : 'var(--md3-outline)',
                  justifyContent: isPresent ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  className="size-5 rounded-full transition-all duration-200"
                  style={{
                    background: isPresent ? 'var(--md3-primary)' : 'var(--md3-surface-container-highest)',
                  }}
                />
              </div>
            </button>
          )}

          {!isPresent && view === 'month' ? (
            <>
              {/* Year navigation header — clickable year label */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setViewYear(y => y - 1)}
                  className="size-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ color: 'var(--md3-on-surface-variant)' }}
                >
                  <ChevronLeft className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYearRangeCenter(viewYear);
                    setView('year');
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-150 hover:opacity-80"
                  style={{
                    color: 'var(--md3-on-surface)',
                    background: 'var(--md3-surface-container-high, var(--md3-surface-container))',
                  }}
                >
                  <span className="text-sm font-medium">{viewYear}</span>
                  <ChevronDown className="size-3.5" />
                </button>

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
                  const selected = isSelectedMonth(monthNum);
                  const current = isCurrentMonth(monthNum);

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelectMonth(monthNum)}
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
            </>
          ) : !isPresent && view === 'year' ? (
            <>
              {/* Year selection view */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setYearRangeCenter(c => c - 12)}
                  className="size-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ color: 'var(--md3-on-surface-variant)' }}
                >
                  <ChevronLeft className="size-4" />
                </button>

                <span
                  className="text-sm font-medium select-none"
                  style={{ color: 'var(--md3-on-surface-variant)' }}
                >
                  {yearRange[0]} – {yearRange[yearRange.length - 1]}
                </span>

                <button
                  type="button"
                  onClick={() => setYearRangeCenter(c => c + 12)}
                  className="size-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ color: 'var(--md3-on-surface-variant)' }}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Year grid: 3 columns × 4 rows */}
              <div className="grid grid-cols-3 gap-1">
                {yearRange.map((year) => {
                  const selected = isSelectedYear(year);
                  const current = isCurrentYear(year);
                  const isViewYear = year === viewYear;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectYear(year)}
                      className="h-9 rounded-xl text-xs font-medium transition-all duration-150 hover:opacity-80"
                      style={{
                        background: selected
                          ? 'var(--md3-primary)'
                          : isViewYear
                            ? 'var(--md3-primary-container, var(--md3-primary))'
                            : 'transparent',
                        color: selected
                          ? 'var(--md3-on-primary)'
                          : isViewYear
                            ? 'var(--md3-on-primary-container, var(--md3-on-primary))'
                            : current
                              ? 'var(--md3-primary)'
                              : 'var(--md3-on-surface)',
                        border: current && !selected && !isViewYear
                          ? '1px solid var(--md3-primary)'
                          : '1px solid transparent',
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {/* Clear button — only when not in Present mode and has a value */}
          {!isPresent && value && view === 'month' && (
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

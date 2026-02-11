import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOUR_KEY = 'resumeforge_tour_completed';

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="tabs"]',
    title: 'Navigation Tabs',
    description: 'Switch between Personal info, Experience, Education, Skills, Projects, and Certifications to fill in your resume sections.',
    position: 'bottom',
  },
  {
    target: '[data-tour="design-tabs"]',
    title: 'Design Controls',
    description: 'Customize your resume with Templates, Fonts, Size adjustments, and Color themes.',
    position: 'bottom',
  },
  {
    target: '[data-tour="ats-score"]',
    title: 'ATS Score Checker',
    description: 'See how ATS-friendly your resume is. Click for detailed analysis with actionable tips.',
    position: 'top',
  },
  {
    target: '[data-tour="job-matcher"]',
    title: 'Job Description Matcher',
    description: 'Paste a job posting to see which keywords match your resume and which are missing.',
    position: 'bottom',
  },
  {
    target: '[data-tour="cover-letter"]',
    title: 'Cover Letter Generator',
    description: 'Generate a tailored cover letter from your resume data with one click.',
    position: 'bottom',
  },
  {
    target: '[data-tour="preview"]',
    title: 'Live Preview',
    description: 'Your resume updates in real-time as you type. Zoom in/out and switch templates to see changes instantly.',
    position: 'left',
  },
  {
    target: '[data-tour="export"]',
    title: 'Export Options',
    description: 'Export your resume as PDF, DOCX, or JSON. You can also import previously saved resumes.',
    position: 'bottom',
  },
];

export default function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  // Check if tour was completed
  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      // Delay tour start to let page render
      const timer = setTimeout(() => setActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const positionTooltip = useCallback(() => {
    if (!active || step >= TOUR_STEPS.length) return;
    const currentStep = TOUR_STEPS[step];
    const el = document.querySelector(currentStep.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setHighlightRect({
      top: rect.top - 4,
      left: rect.left - 4,
      width: rect.width + 8,
      height: rect.height + 8,
    });

    const tooltipWidth = 320;
    const tooltipHeight = 160;
    const gap = 12;

    let top = 0;
    let left = 0;

    switch (currentStep.position) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'top':
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        break;
    }

    // Clamp to viewport
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

    setTooltipPos({ top, left });
  }, [active, step]);

  useEffect(() => {
    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    return () => window.removeEventListener('resize', positionTooltip);
  }, [positionTooltip]);

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  };

  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const finish = () => {
    setActive(false);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  const restart = () => {
    setStep(0);
    setActive(true);
  };

  if (!active) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 h-8 text-xs rounded-full px-3"
        onClick={restart}
      >
        <Sparkles className="size-3.5" />
        <span className="hidden sm:inline">Tour</span>
      </Button>
    );
  }

  const currentStep = TOUR_STEPS[step];

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Overlay with cutout */}
          <div className="fixed inset-0 z-[70]" onClick={finish}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="tour-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={highlightRect.left}
                    y={highlightRect.top}
                    width={highlightRect.width}
                    height={highlightRect.height}
                    rx="12"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#tour-mask)" />
              {/* Highlight border */}
              <rect
                x={highlightRect.left}
                y={highlightRect.top}
                width={highlightRect.width}
                height={highlightRect.height}
                rx="12"
                fill="none"
                stroke="var(--md3-primary)"
                strokeWidth="2"
                strokeDasharray="6 3"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="18" dur="1s" repeatCount="indefinite" />
              </rect>
            </svg>
          </div>

          {/* Tooltip */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[71] w-80"
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="rounded-2xl p-4 shadow-xl"
              style={{
                background: 'var(--md3-surface-container)',
                border: '1px solid var(--md3-outline-variant)',
              }}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === step ? 16 : 6,
                        background: i === step ? 'var(--md3-primary)' : i < step ? 'var(--md3-primary)' : 'var(--md3-outline-variant)',
                        opacity: i <= step ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
                <button onClick={finish} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              </div>

              <h3 className="font-display font-semibold text-sm mb-1">{currentStep.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{currentStep.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">
                  {step + 1} of {TOUR_STEPS.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {step > 0 && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs rounded-full px-2.5" onClick={prev}>
                      <ChevronLeft className="size-3.5 mr-0.5" />
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="h-7 text-xs rounded-full px-3"
                    style={{ background: 'var(--md3-primary)', color: 'var(--md3-on-primary)' }}
                    onClick={next}
                  >
                    {step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                    {step < TOUR_STEPS.length - 1 && <ChevronRight className="size-3.5 ml-0.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

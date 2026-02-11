import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { DEFAULT_SECTION_ORDER, useResume } from '@/contexts/ResumeContext';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Eye, Layout, Download, ArrowRight, Moon, Sun, Sparkles, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { sampleResumeData, FONT_PAIRINGS, TemplateId } from '@/types/resume';
import {
  ClassicTemplate,
  ModernTemplate,
  ExecutiveTemplate,
  CompactTemplate,
  MinimalTemplate,
  TwoColumnTemplate,
} from '@/components/preview/ResumePreview';
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';

const features = [
  { icon: FileText, title: 'Guided Editor', desc: 'Structured form fields for every resume section. No blank-page anxiety.' },
  { icon: Eye, title: 'Live Preview', desc: 'See changes instantly as you type. What you see is what you export.' },
  { icon: Layout, title: 'Six Templates', desc: 'Classic, Modern, Executive, Compact, Minimal, and Two Column layouts.' },
  { icon: Download, title: 'PDF Export', desc: 'One-click download. Print-ready, ATS-friendly, pixel-perfect.' },
];

const allTemplates = [
  { name: 'Classic', id: 'classic' as TemplateId, Component: ClassicTemplate, accent: '#6750A4' },
  { name: 'Modern', id: 'modern' as TemplateId, Component: ModernTemplate, accent: '#6750A4' },
  { name: 'Executive', id: 'executive' as TemplateId, Component: ExecutiveTemplate, accent: '#6750A4' },
  { name: 'Compact', id: 'compact' as TemplateId, Component: CompactTemplate, accent: '#6750A4' },
  { name: 'Minimal', id: 'minimal' as TemplateId, Component: MinimalTemplate, accent: '#6750A4' },
  { name: 'Two Column', id: 'twocolumn' as TemplateId, Component: TwoColumnTemplate, accent: '#6750A4' },
];

// Only show 3 in the homepage grid
const templateShowcase = allTemplates.slice(0, 3);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.05, 0.7, 0.1, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Mini resume preview card — renders the actual template at A4 size, then scales it down */
function MiniResumePreview({ Component, accent }: { Component: React.ComponentType<any>; accent: string }) {
  const defaultFont = useMemo(() => FONT_PAIRINGS[0], []);
  const sectionOrder = useMemo(() => DEFAULT_SECTION_ORDER, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 793.7);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{
        aspectRatio: '210 / 297',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#ffffff',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <Component
          data={sampleResumeData}
          sectionOrder={sectionOrder}
          accent={accent}
          font={defaultFont}
          fontSize={1}
          lineSpacing={1}
          marginSize={1}
        />
      </div>
    </div>
  );
}

/** Large resume preview for the lightbox modal — fixed-size paper centered in viewport */
function LargeResumePreview({ Component, accent }: { Component: React.ComponentType<any>; accent: string }) {
  const defaultFont = useMemo(() => FONT_PAIRINGS[0], []);
  const sectionOrder = useMemo(() => DEFAULT_SECTION_ORDER, []);

  // Calculate scale based on available viewport height (minus top bar ~72px and dots ~48px)
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const updateScale = () => {
      const availH = window.innerHeight - 140; // top bar + dots + padding
      const availW = window.innerWidth - 160; // side arrows + padding
      const hScale = availH / 1123;
      const wScale = availW / 793.7;
      setScale(Math.min(hScale, wScale, 0.85));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const paperW = 793.7 * scale;
  const paperH = 1123 * scale;

  return (
    <div
      style={{
        width: `${paperW}px`,
        height: `${paperH}px`,
        flexShrink: 0,
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <div
        style={{
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#ffffff',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <Component
          data={sampleResumeData}
          sectionOrder={sectionOrder}
          accent={accent}
          font={defaultFont}
          fontSize={1}
          lineSpacing={1}
          marginSize={1}
        />
      </div>
    </div>
  );
}

/** Lightbox modal for template preview with navigation */
function TemplateLightbox({
  isOpen,
  onClose,
  initialIndex,
  onUseTemplate,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
  onUseTemplate: (templateId: TemplateId) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when lightbox opens with a new template
  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const currentTemplate = allTemplates[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allTemplates.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allTemplates.length) % allTemplates.length);
  }, []);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, goNext, goPrev]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleUseTemplate = useCallback(() => {
    if (currentTemplate) {
      onUseTemplate(currentTemplate.id);
    }
  }, [currentTemplate, onUseTemplate]);

  return (
    <AnimatePresence>
      {isOpen && currentTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Scrim — clicking it closes the modal */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal content — does NOT close on click */}
          <div className="relative flex flex-col w-full h-full pointer-events-none">
            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex items-center justify-between px-6 py-4 relative z-10 pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--md3-primary-container)' }}
                >
                  <Eye className="size-5" style={{ color: 'var(--md3-on-primary-container)' }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-white">{currentTemplate.name} Template</h3>
                  <p className="text-sm text-white/60">{currentIndex + 1} of {allTemplates.length} templates</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="font-display text-sm font-medium rounded-full h-10 px-6 gap-2"
                  onClick={handleUseTemplate}
                >
                  Use Template
                  <ArrowRight className="size-4" />
                </Button>
                <button
                  onClick={onClose}
                  className="size-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  aria-label="Close preview"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </motion.div>

            {/* Resume preview area with side navigation arrows */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, delay: 0.08, ease: [0.05, 0.7, 0.1, 1] }}
              className="flex-1 min-h-0 flex items-center justify-center relative pointer-events-none"
            >
              {/* Left arrow */}
              <button
                onClick={goPrev}
                className="absolute left-4 z-20 size-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 transition-colors duration-200 pointer-events-auto"
                aria-label="Previous template"
              >
                <ChevronLeft className="size-6 text-white" />
              </button>

              {/* Resume paper — centered, clicking around it closes the modal */}
              <div
                className="flex-1 min-h-0 w-full flex items-center justify-center pointer-events-auto"
                onClick={onClose}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <LargeResumePreview Component={currentTemplate.Component} accent={currentTemplate.accent} />
                </div>
              </div>

              {/* Right arrow */}
              <button
                onClick={goNext}
                className="absolute right-4 z-20 size-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 transition-colors duration-200 pointer-events-auto"
                aria-label="Next template"
              >
                <ChevronRight className="size-6 text-white" />
              </button>
            </motion.div>

            {/* Bottom indicator dots */}
            <div className="flex items-center justify-center gap-2 py-4 pointer-events-auto">
              {allTemplates.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === currentIndex ? '24px' : '8px',
                    height: '8px',
                    background: i === currentIndex
                      ? 'var(--md3-primary)'
                      : 'rgba(255,255,255,0.35)',
                  }}
                  aria-label={`View ${t.name} template`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { setSelectedTemplate } = useResume();
  const [, navigate] = useLocation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openPreview = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleUseTemplate = useCallback((templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setLightboxOpen(false);
    navigate('/editor');
  }, [setSelectedTemplate, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* MD3 Top App Bar */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--md3-primary-container)' }}>
              <FileText className="size-5" style={{ color: 'var(--md3-on-primary-container)' }} />
            </div>
            <span className="font-display text-xl font-medium tracking-tight">ResumeForge</span>
          </div>
          <div className="flex items-center gap-2">
            {toggleTheme && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full size-10">
                {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
            )}
            <Link href="/editor">
              <Button className="font-display text-sm font-medium rounded-full h-10 px-6 gap-2">
                Open Editor
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Centered Banner */}
      <section className="py-24 lg:py-36">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full"
                style={{ background: 'var(--md3-secondary-container)', color: 'var(--md3-on-secondary-container)' }}
              >
                <Sparkles className="size-3.5" />
                Resume Builder
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-[72px] font-medium leading-[1.08] mb-6 tracking-tight">
              Build resumes<br />that actually work.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              A focused tool for creating clean, professional resumes. Fill in your details, choose a template, export as PDF. Nothing more.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/editor">
                <Button className="h-14 px-8 text-base font-display font-medium rounded-full gap-2 md3-elevation-1">
                  Start Building
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">No account required</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features — MD3 Filled Cards */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--md3-surface-container-low)' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-14">
              <span
                className="inline-flex items-center text-sm font-medium px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--md3-tertiary-container)', color: 'var(--md3-on-tertiary-container)' }}
              >
                Features
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
                Everything you need.
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div
                    className="h-full rounded-2xl p-6 md3-state-layer transition-all duration-300"
                    style={{ background: 'var(--md3-surface-container)', border: '1px solid var(--md3-outline-variant)' }}
                  >
                    <div
                      className="mb-4 inline-flex items-center justify-center size-12 rounded-xl"
                      style={{ background: 'var(--md3-primary-container)' }}
                    >
                      <f.icon className="size-6" style={{ color: 'var(--md3-on-primary-container)' }} />
                    </div>
                    <h3 className="font-display text-lg font-medium mb-2">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates — Live Resume Previews with Preview Button */}
      <section className="container py-20 lg:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-14">
            <span
              className="inline-flex items-center text-sm font-medium px-4 py-1.5 rounded-full mb-4"
              style={{ background: 'var(--md3-secondary-container)', color: 'var(--md3-on-secondary-container)' }}
            >
              Templates
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
              Three layouts. Zero noise.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {templateShowcase.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="group">
                  {/* Card with resume preview */}
                  <div
                    className="rounded-2xl overflow-hidden mb-4 md3-elevation-1 relative transition-shadow duration-300 hover:shadow-lg"
                    style={{
                      background: 'var(--md3-surface-container)',
                      border: '1px solid var(--md3-outline-variant)',
                    }}
                  >
                    <MiniResumePreview Component={t.Component} accent={t.accent} />

                    {/* Overlay with Preview button — appears on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openPreview(i)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-display text-sm font-medium text-white transition-all duration-300 transform scale-90 group-hover:scale-100"
                        style={{
                          background: 'var(--md3-primary)',
                          color: 'var(--md3-on-primary)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        }}
                      >
                        <ZoomIn className="size-4" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Label row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono-accent px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--md3-surface-container-high)', color: 'var(--md3-on-surface-variant)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-lg font-medium">{t.name}</span>
                    </div>
                    <span
                      className="text-xs font-display font-medium px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
                      style={{
                        background: 'var(--md3-secondary-container)',
                        color: 'var(--md3-on-secondary-container)',
                      }}
                      onClick={() => handleUseTemplate(t.id)}
                    >
                      Use template
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA — MD3 Filled Tonal Surface */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--md3-surface-container-low)' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp}>
              <span
                className="inline-flex items-center text-sm font-medium px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--md3-primary-container)', color: 'var(--md3-on-primary-container)' }}
              >
                Get Started
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-medium tracking-tight mb-6">
              Your resume, simplified.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-10 leading-relaxed">
              No sign-up. No templates behind paywalls. Just open the editor, fill in your information, and download your resume as a professionally formatted PDF.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/editor">
                <Button className="h-14 px-8 text-base font-display font-medium rounded-full gap-2">
                  Open Editor
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8" style={{ borderTop: '1px solid var(--md3-outline-variant)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--md3-primary-container)' }}>
              <FileText className="size-3.5" style={{ color: 'var(--md3-on-primary-container)' }} />
            </div>
            <span className="font-display text-sm font-medium">ResumeForge</span>
          </div>
          <span className="text-sm text-muted-foreground">Built with Material Design 3.</span>
        </div>
      </footer>

      {/* Template Preview Lightbox */}
      <TemplateLightbox
        isOpen={lightboxOpen}
        onClose={closePreview}
        initialIndex={lightboxIndex}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}

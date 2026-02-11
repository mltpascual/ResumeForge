import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { DEFAULT_SECTION_ORDER } from '@/contexts/ResumeContext';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { FileText, Eye, Layout, Download, ArrowRight, Moon, Sun, Sparkles } from 'lucide-react';
import { sampleResumeData, FONT_PAIRINGS } from '@/types/resume';
import {
  ClassicTemplate,
  ModernTemplate,
  ExecutiveTemplate,
  CompactTemplate,
  MinimalTemplate,
  TwoColumnTemplate,
} from '@/components/preview/ResumePreview';
import { useMemo, useRef, useEffect, useState } from 'react';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-1_1770772003000_na1fn_bWluaW1hbC1oZXJv.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTFfMTc3MDc3MjAwMzAwMF9uYTFmbl9iV2x1YVcxaGJDMW9aWEp2LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QPdvUtpnctFjUTYZkzQGjIvZUYs0I6q67CI6x7GLiJ7PtLnaxRLCIRwHbYtHz3CvE6UKBe5ZBudN0zAGYg8bTHrEJeYk1Q0nYOg5I09wMcS58Nw9VzsQyFBIqPiG7etbVLbUh~t7TBjuPQkgTJJtR-4Xaa7XCzLjKYqOtGvzkt~fGi4irS0Sw33Z2VL3Br6fQeDfOh8F5aMJS0Rm53oml-cMflhTlI3nxAjzGgjFzKIwVnHQS49fPgkC9aN1lA1ofneUhzu5Tp7g4JI7iQoYrsn774iJ3tD6CZrT0JW9~Kpts60PdrgjLmvJn~1lXPpin~DZXaazraMuaVu6ORUzKg__';

const features = [
  { icon: FileText, title: 'Guided Editor', desc: 'Structured form fields for every resume section. No blank-page anxiety.' },
  { icon: Eye, title: 'Live Preview', desc: 'See changes instantly as you type. What you see is what you export.' },
  { icon: Layout, title: 'Six Templates', desc: 'Classic, Modern, Executive, Compact, Minimal, and Two Column layouts.' },
  { icon: Download, title: 'PDF Export', desc: 'One-click download. Print-ready, ATS-friendly, pixel-perfect.' },
];

const templateShowcase = [
  { name: 'Classic', Component: ClassicTemplate, accent: '#6750A4' },
  { name: 'Modern', Component: ModernTemplate, accent: '#6750A4' },
  { name: 'Executive', Component: ExecutiveTemplate, accent: '#6750A4' },
];

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
        // A4 width at 96dpi is ~793.7px
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

export default function Home() {
  const { theme, toggleTheme } = useTheme();

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

      {/* Hero — MD3 Large Display Typography */}
      <section className="container py-16 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full"
                style={{ background: 'var(--md3-secondary-container)', color: 'var(--md3-on-secondary-container)' }}
              >
                <Sparkles className="size-3.5" />
                Resume Builder
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-[64px] font-medium leading-[1.1] mb-6 tracking-tight">
              Build resumes<br />that work.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              A focused tool for creating clean, professional resumes. Fill in your details, choose a template, export as PDF. Nothing more.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
              <Link href="/editor">
                <Button className="h-14 px-8 text-base font-display font-medium rounded-full gap-2 md3-elevation-1">
                  Start Building
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">No account required</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.05, 0.7, 0.1, 1] as [number, number, number, number] }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden md3-elevation-2" style={{ background: 'var(--md3-surface-container)' }}>
              <img src={HERO_IMG} alt="Resume on desk" className="w-full h-full object-cover" />
            </div>
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

      {/* Templates — Live Resume Previews */}
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
                <Link href="/editor">
                  <div className="group cursor-pointer">
                    <div
                      className="rounded-2xl overflow-hidden mb-4 md3-elevation-1 hover:md3-elevation-2 transition-shadow duration-300"
                      style={{
                        background: 'var(--md3-surface-container)',
                        border: '1px solid var(--md3-outline-variant)',
                      }}
                    >
                      <MiniResumePreview Component={t.Component} accent={t.accent} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono-accent px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--md3-surface-container-high)', color: 'var(--md3-on-surface-variant)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-lg font-medium">{t.name}</span>
                    </div>
                  </div>
                </Link>
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
    </div>
  );
}

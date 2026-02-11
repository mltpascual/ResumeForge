import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { FileText, Eye, Layout, Download, ArrowRight, Moon, Sun, Sparkles } from 'lucide-react';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-1_1770772003000_na1fn_bWluaW1hbC1oZXJv.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTFfMTc3MDc3MjAwMzAwMF9uYTFmbl9iV2x1YVcxaGJDMW9aWEp2LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QPdvUtpnctFjUTYZkzQGjIvZUYs0I6q67CI6x7GLiJ7PtLnaxRLCIRwHbYtHz3CvE6UKBe5ZBudN0zAGYg8bTHrEJeYk1Q0nYOg5I09wMcS58Nw9VzsQyFBIqPiG7etbVLbUh~t7TBjuPQkgTJJtR-4Xaa7XCzLjKYqOtGvzkt~fGi4irS0Sw33Z2VL3Br6fQeDfOh8F5aMJS0Rm53oml-cMflhTlI3nxAjzGgjFzKIwVnHQS49fPgkC9aN1lA1ofneUhzu5Tp7g4JI7iQoYrsn774iJ3tD6CZrT0JW9~Kpts60PdrgjLmvJn~1lXPpin~DZXaazraMuaVu6ORUzKg__';

const TEMPLATE_IMGS = [
  'https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-2_1770772007000_na1fn_bWluaW1hbC10ZW1wbGF0ZS0x.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTJfMTc3MDc3MjAwNzAwMF9uYTFmbl9iV2x1YVcxaGJDMTBaVzF3YkdGMFpTMHguanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RVC~lW7XbIqipPlfJ377emobVKwR-YmUJ8zOG2RyGUOtQYMdjD1h6097ZNT7UQbH6wDmETxLrSeYI-GvKskv~h~FY7MVEPO8RxUscYPftzdMcBckS0ODZ0yVV2IDh5O4ZKf7REqWiETTVS6reN5Hrt~hCMKyWI5rfAjbzeMwbgc9ZQWB82Edn~Noo6mkYohiuYfCYPXXWp5h3L83cyN~V2D1qzgeiW8TYg-z2BKLcwFwOZFHpQ5Ws85BMNSvwoelXPanLPz2CZFa4WZ5gvmJMxn5CwQfESiFWQbeo5GaN28zXFM-hvivvUr3~nfmf807jpRD-kV2qkgj5gc4GC0zfQ__',
  'https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-3_1770772007000_na1fn_bWluaW1hbC10ZW1wbGF0ZS0y.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTNfMTc3MDc3MjAwNzAwMF9uYTFmbl9iV2x1YVcxaGJDMTBaVzF3YkdGMFpTMHkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=sVAwPbHgWgJwbdGDnsiCCUlboY6r01-T20PW0TP-wzTCVZI1n0WzRyYIJJsRlT1BD9njsM5Adrjh42tIQpGCAiE9Q5YOe29tmW5~oWhWN~TciKXLsKU-7q3FfqsdIez3ROyWAIYFb2w~ZFwhtU6EkPuJyXzUUSvTDU5VPsSVO98twz~mMaK17NoWgYAF6RUHLz1kAQC-rKTJDYRhM0C1nH3VXez0f~oZmCm782JN19Gaxw4B1Kk9wcUWoMpTnCpn94pvfGAE50qoC4zgjRziV8bjAd344~MTciSG4rJpb7Vs3WQU0iypDpaVBv-B3PFJEahRqtxbp2Ib4Vbxxrj6Lw__',
  'https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-4_1770772011000_na1fn_bWluaW1hbC10ZW1wbGF0ZS0z.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTRfMTc3MDc3MjAxMTAwMF9uYTFmbl9iV2x1YVcxaGJDMTBaVzF3YkdGMFpTMHouanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=vWKWYaDO3KssdVDGhyREtdSqUJMWxBFw3Fow6QkQkEh9Dkmu7Q5-aJ~Z2yvc2Buq4lunbX1C-5tgDLQYOJuiNVdAI5I7Yb9wCmKQ8LcdfTpP32KRvcuCv4B58mo77wD9N5bSu-~rOusAFqhKCNDg27NCTx9Z~JwzRHRICDPRRyo~fWjVwh7PwaZsqst5k2xtNQx3W5o4EpRO1sf6UuqUXL4iROvzowaI27VGiC7AU3T8nF9gGjfVzB~rzRwWZ89okE-Bc1NULWg1h64cUCQLQ2LQcJ3iRVTQXfrB6l4AP~woazwP3vuB-ckKpZdMkIhBDX-PW3GWQsbxFTAado-ciw__',
];

const features = [
  { icon: FileText, title: 'Guided Editor', desc: 'Structured form fields for every resume section. No blank-page anxiety.' },
  { icon: Eye, title: 'Live Preview', desc: 'See changes instantly as you type. What you see is what you export.' },
  { icon: Layout, title: 'Six Templates', desc: 'Classic, Modern, Executive, Compact, Minimal, and Two Column layouts.' },
  { icon: Download, title: 'PDF Export', desc: 'One-click download. Print-ready, ATS-friendly, pixel-perfect.' },
];

const templateNames = ['Classic', 'Modern', 'Executive'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.05, 0.7, 0.1, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

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

      {/* Templates — MD3 Outlined Cards */}
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
            {TEMPLATE_IMGS.map((img, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="group">
                  <div
                    className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 md3-elevation-1"
                    style={{ background: 'var(--md3-surface-container)' }}
                  >
                    <img
                      src={img}
                      alt={`${templateNames[i]} template`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 md3-motion-emphasized"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono-accent px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--md3-surface-container-high)', color: 'var(--md3-on-surface-variant)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-lg font-medium">{templateNames[i]}</span>
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
    </div>
  );
}

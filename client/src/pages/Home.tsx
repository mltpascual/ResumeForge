/*
 * DESIGN: "Black Tie Elegance" — Luxury Landing Page
 * Deep dark surfaces, champagne gold accents, Cormorant Garamond display.
 * Cinematic hero with moody lighting. Generous negative space.
 */

import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FileText, Sparkles, Download, Layout, ArrowRight, PenLine, Eye, Diamond } from "lucide-react";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/ATjBPas4e19uKtwzDCMHdA-img-1_1770770710000_na1fn_bHV4dXJ5LWhlcm8.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0FUakJQYXM0ZTE5dUt0d3pEQ01IZEEtaW1nLTFfMTc3MDc3MDcxMDAwMF9uYTFmbl9iSFY0ZFhKNUxXaGxjbTguanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=nJ-bPNEigvLqWqtjl~3PRuTg8S0~E9i2AcfyerCdUplRFnqmmQ00n0OjhEgUuw10RbfMHYixkHVQqE2gk6E4YP~L5svZOCZUhJLsmUguFVunvM3crW2MOhHeZk4qf6SxT5M7nf8XqhuGW3zYZXkM4rTVmS7ij8AkeMZOAaRJgYRlxlqOYI8UTfatjOMzrVgU-gwJasoc-rZ9-TJ-b~FVG0dHnHGQZw8NEWKf33~ZRYBO3RxWWsPnpyPVokg~CbrTulSAWej1veJol61WRbcXZR5dNWq91h0ey7lpmeSry2TUxkgaW1sHMftTMovuITtFgwBpWnf0QJDYCdhWMdyExQ__";

const TEMPLATE_CLASSIC = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/ATjBPas4e19uKtwzDCMHdA-img-2_1770770715000_na1fn_bHV4dXJ5LWNsYXNzaWM.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0FUakJQYXM0ZTE5dUt0d3pEQ01IZEEtaW1nLTJfMTc3MDc3MDcxNTAwMF9uYTFmbl9iSFY0ZFhKNUxXTnNZWE56YVdNLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=EdsV0d2q6JhKLWlJ5IBaPIUZvim1F7iq~-O53AkZMPwzcnFza3nkmbFhrXNfXR6u5zhIFtNWpVGvpmoVLooLUe0GuvH9uNWtUR4o-WjjefIeK565POcOocCA~WbUQsLUChtw2jyg03-VQlzlKoTJ7fSflHsJjyDa7uvzILGrTY0ZP8aOUImFgRLnLDSKZNuIkuLsmCuot~qc5E2bVWKY4~7pSjejf4SVYxjoVbOkuW-CD9eZ38blgbCz74j4dZ6sQQLNuRsJhYJKsiataioXm5--USUkqpPsQYAX8-yquCXdK4PYytBexFPyFA~hZUgQ4jjFPXrMVuaB4lxn7MmO7g__";
const TEMPLATE_MODERN = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/ATjBPas4e19uKtwzDCMHdA-img-3_1770770699000_na1fn_bHV4dXJ5LW1vZGVybg.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0FUakJQYXM0ZTE5dUt0d3pEQ01IZEEtaW1nLTNfMTc3MDc3MDY5OTAwMF9uYTFmbl9iSFY0ZFhKNUxXMXZaR1Z5YmcuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Pvdasv42LEp2A40kX6RlPHyBuWPtkSSIv78Q4bQBMqQsdJIWRHI~vIFJqi1MKJFl3XpJ1wMZxaw3B8HmSDzUEcU45eg6orc~UT5t8SkoRRcrNPH0ME7lPSW3z8eGJQ2nUmtV5L9rzYPGfbKvUQ9cYMIPV3T9NIT6uz73D5VpiiJI-x9g90wzV~EWm5Ho6DvuflAmPwou~VkMKZXgQ~JCjp06utB8pKI4kXthk3zRJ91I7Ra-JrGEyUtR2ML42xrXfM7R0qKOVlqsxDQ16HnIFaZSf7qU0WKkho1zzcxgycus3T2l7FvZYiMpj2jMFKhbB4eiunEnh15~w5yoQANobA__";
const TEMPLATE_EXECUTIVE = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/ATjBPas4e19uKtwzDCMHdA-img-4_1770770705000_na1fn_bHV4dXJ5LWV4ZWN1dGl2ZQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0FUakJQYXM0ZTE5dUt0d3pEQ01IZEEtaW1nLTRfMTc3MDc3MDcwNTAwMF9uYTFmbl9iSFY0ZFhKNUxXVjRaV04xZEdsMlpRLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=pXA~3yHgMtCDJZJXFtoSDwvOZ12-HbVckMyCTPUXUxzg5qRUXHG6syY2PTXAZ~ab0nrHScVoSTTwIRclCzY9QkfZpub3ygPwbLpoFPrZZbL4bMt2w2FZjWS292a1bsQcvn6Sn2m7bayd5fE0kP28LR8ZnMJhqGVu7Nfnmr1NZTCDXtSnO4RZhnFvs0uSQfxMiZbhpfW0fQ1PKp4hfg200PJl~zYUrMgzdQ68QxUlv7S7VTDipG4KWjrxVpf-BcaK9T~~plR6r1SyE1rWYbDrFPBbSpO~eHwBQb1FcsScvMX3X~RBbq5N0aBcUIAeFP-wO83uikfT0tZlUyZyNxQ7xg__";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: PenLine,
    title: "Guided Editor",
    description: "A structured form walks you through each section — personal details, experience, education, skills, projects, and certifications.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your resume take shape in real-time as you type. Every keystroke is reflected instantly in the preview.",
  },
  {
    icon: Layout,
    title: "Three Templates",
    description: "Choose from Classic, Modern, or Executive — each professionally designed for different industries and roles.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Download your finished resume as a clean, print-ready PDF with a single click. No watermarks, no limits.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-gold/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <Diamond className="w-5 h-5 text-gold" />
            <span className="text-lg tracking-wide text-warm-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '0.05em' }}>
              ResumeForge
            </span>
          </div>
          <Link href="/editor">
            <Button
              className="btn-gold border-0 px-6 font-medium"
              size="sm"
            >
              Start Building
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.005_285/0.95)] via-[oklch(0.08_0.005_285/0.85)] to-[oklch(0.08_0.005_285/0.6)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.005_285)] via-transparent to-[oklch(0.13_0.005_285/0.3)]" />
        </div>

        <div className="container relative z-10 pt-20">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="flex items-center gap-3 mb-8"
            >
              <div className="gold-line w-12" />
              <p
                className="text-gold text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              >
                Resume Atelier
              </p>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8 text-warm-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              Craft resumes
              <br />
              that command
              <br />
              <span className="text-gold italic" style={{ fontWeight: 300 }}>
                attention
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg md:text-xl text-silver leading-relaxed mb-12 max-w-lg"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              Build a beautifully typeset resume with our guided editor. Choose from elegant templates, preview in real-time, and export as PDF.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <Link href="/editor">
                <Button
                  size="lg"
                  className="btn-gold border-0 px-10 py-6 text-base font-medium tracking-wide"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Begin Crafting
                </Button>
              </Link>
              <p className="text-silver/50 text-sm mt-3 sm:mt-4" style={{ fontWeight: 300 }}>
                No sign-up required
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative gold line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 gold-line" />
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background relative noise-overlay">
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <motion.div custom={0} variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="gold-line w-8" />
              <p
                className="text-gold text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              >
                Features
              </p>
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-5xl text-warm-white max-w-lg"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              Everything you need,
              <br />
              <span className="text-gold/80 italic" style={{ fontWeight: 300 }}>nothing you don't</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/30 rounded-lg overflow-hidden">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="group bg-card p-10 hover:bg-[oklch(0.19_0.005_285)] transition-colors duration-500"
              >
                <div className="mb-6 w-12 h-12 rounded-lg border border-gold/20 flex items-center justify-center group-hover:border-gold/40 group-hover:bg-gold-muted transition-all duration-500">
                  <feature.icon className="w-5 h-5 text-gold" />
                </div>
                <h3
                  className="text-xl mb-3 text-warm-white"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
                >
                  {feature.title}
                </h3>
                <p className="text-silver text-[0.938rem] leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-line" />

      {/* Templates Showcase */}
      <section className="py-32 bg-[oklch(0.11_0.005_285)] relative">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <motion.div custom={0} variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line w-8" />
              <p
                className="text-gold text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              >
                Templates
              </p>
              <div className="gold-line w-8" />
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-5xl text-warm-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              Three designs, one goal:
              <br />
              <span className="text-gold/80 italic" style={{ fontWeight: 300 }}>your best first impression</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { img: TEMPLATE_CLASSIC, name: "Classic", desc: "Timeless serif elegance with refined spacing" },
              { img: TEMPLATE_MODERN, name: "Modern", desc: "Clean sidebar layout with contemporary styling" },
              { img: TEMPLATE_EXECUTIVE, name: "Executive", desc: "Authoritative navy design for senior professionals" },
            ].map((tmpl, i) => (
              <motion.div
                key={tmpl.name}
                custom={i}
                variants={fadeUp}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-lg border border-border/50 group-hover:border-gold/30 transition-all duration-500">
                  <img
                    src={tmpl.img}
                    alt={`${tmpl.name} template preview`}
                    className="w-full h-[420px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-warm-white text-xl mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                      {tmpl.name}
                    </h3>
                    <p className="text-silver/70 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      {tmpl.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-line" />

      {/* CTA Section */}
      <section className="py-32 bg-background relative noise-overlay overflow-hidden">
        {/* Decorative radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div custom={0} variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
              <div className="gold-line w-12" />
              <Diamond className="w-4 h-4 text-gold" />
              <div className="gold-line w-12" />
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-5xl text-warm-white mb-6"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              Ready to craft your resume?
            </motion.h2>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-silver/60 text-lg mb-12 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              No sign-up required. Start building, preview instantly, and download your PDF.
            </motion.p>
            <motion.div custom={3} variants={fadeUp}>
              <Link href="/editor">
                <Button
                  size="lg"
                  className="btn-gold border-0 px-12 py-6 text-base font-medium tracking-wide"
                >
                  Get Started Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[oklch(0.10_0.005_285)] border-t border-border/30">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Diamond className="w-3.5 h-3.5 text-gold/60" />
            <span className="text-silver/40 text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, letterSpacing: '0.05em' }}>
              ResumeForge
            </span>
          </div>
          <p className="text-silver/30 text-xs" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
            Crafted with precision
          </p>
        </div>
      </footer>
    </div>
  );
}

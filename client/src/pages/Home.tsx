/*
 * DESIGN: "Ink & Paper" — Editorial Stationery Landing Page
 * Warm cream surfaces, deep ink typography, terracotta accents.
 * Playfair Display for headings, Source Sans 3 for body.
 * Asymmetric layout with editorial sophistication.
 */

import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FileText, Sparkles, Download, Layout, ArrowRight, PenLine, Eye } from "lucide-react";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/5Q2guGOP6SJLaBMfz7Y7yz-img-1_1770763373000_na1fn_aGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94LzVRMmd1R09QNlNKTGFCTWZ6N1k3eXotaW1nLTFfMTc3MDc2MzM3MzAwMF9uYTFmbl9hR1Z5YnkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XmRo6rXyO3cOgsFif6QImbTCR37tBguDTU5LQ~otXvDYxXcN6kX93wq5p7B1u6k4nsLiYzr83nPClXhhj8pG35B-5xKoOVAsGcvDoycIBy3-Jx4n1Z~mevCTFLIBEbHdds6OlxYk-WQTwqb70b6IFiOr7y8xrKZfLldNi1-tp0EfFh0op1swNdxMFD545vzdLZZudCBtBAd03FyPlbFB~TcDiubFv3fRYffysY67RUzylnCkIzBVXiN5XvbTF6KzqlMetcDwg1t5QEp4E0TWpQeujWfy~ERrDOkcH5X2-GR0hik5~b6q9F1QPy9~XHJiqJO-D2LrslXM~oysqB-cEA__";

const TEMPLATE_CLASSIC = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/5Q2guGOP6SJLaBMfz7Y7yz-img-3_1770763369000_na1fn_dGVtcGxhdGUtY2xhc3NpYw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94LzVRMmd1R09QNlNKTGFCTWZ6N1k3eXotaW1nLTNfMTc3MDc2MzM2OTAwMF9uYTFmbl9kR1Z0Y0d4aGRHVXRZMnhoYzNOcFl3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=l9xzxHM65qOsRQuCZ~yuqDKM0UGTH0SSYgyjzXagYLgV~ltKOlNd--EYzJoW43KUWH23qUWGWOTMOOjBrad1iI7yj4hQ3gtdP-sVHOeqSdk0dotsURT~62np5sgTiN~-1GsMyF6LqnoSgrUkf74XMAp0LHYwWq0eepFSbOBGKWYbYdAxuO5KbdiAXFFL6Oez6FSETtazqNUI4rTK2QaPxlU758gsvKkcaJY0aKVwjBR~-ZblYOoRc4-1Q7y9lt2mPu-NjoVIn1oihoxgSO4qLbsRDu2ihiTcWFknnFxmh6CAuDgXXJ4XPoRQKyjzu9ZVzwZNaeE~58iX9p8ccOL~0A__";
const TEMPLATE_MODERN = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/5Q2guGOP6SJLaBMfz7Y7yz-img-4_1770763373000_na1fn_dGVtcGxhdGUtbW9kZXJu.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94LzVRMmd1R09QNlNKTGFCTWZ6N1k3eXotaW1nLTRfMTc3MDc2MzM3MzAwMF9uYTFmbl9kR1Z0Y0d4aGRHVXRiVzlrWlhKdS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Tvsjx0G3Hd0xEytYU9BI-o-kKUWq7ycRLk4yOf8Q8Cp44Nk2NgUz8l96-2Hlq0E59DPMOZkRYGe5Tz1lkea7eJodMB1J6KJiWG5RKen6QU~XwTEiRrX5pT2OmmwlVRi3VkNmaphelEYK3ytf4QSDLKnlHaNmHkt0HTmsT0Cf4fijMglsZDeyqIVJ0gJCLDVocN7PvCv9uYwUXfPwDP9Lff6~WI-kKLcyG~PbG-Vlm66nuKscyAIzJqL439ShXmbGZsAfYZbMpqFxTTHAa8LdWCfnL8gw41lbQU1wFEUGrnLqgCUZ1F5O5yQ-N1w-kJ5qSEM0xl1b3SdbC2MIDP9AaA__";
const TEMPLATE_EXECUTIVE = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/5Q2guGOP6SJLaBMfz7Y7yz-img-5_1770763370000_na1fn_dGVtcGxhdGUtZXhlY3V0aXZl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94LzVRMmd1R09QNlNKTGFCTWZ6N1k3eXotaW1nLTVfMTc3MDc2MzM3MDAwMF9uYTFmbl9kR1Z0Y0d4aGRHVXRaWGhsWTNWMGFYWmwuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qBXNkFDhkNFuDdybGTO4AqZGHfbqIKXyDC8k9b0YpncSTrXrJDzgNhWn56qtPd6cDMH1XF3od24oPRTELPCNY8L3wqqkzQ0nDb8d9QwG~EykgHtFl0RAKfOOoK8PGGDVi1VN7As56yOQE8a8aNWO4YBcvfKEi7LjyRbryaTTXO7VISRqTzYlXRRzKLjQrm0jGjSBif~-Rl4bjvuvK011QQrxla15~e6xLBn3DjE~Gwi48Ephieb4mZekKBl4xAFiLgZq3t2dSVf2DbQ5UYEeJ7cpn7rfBi9tSEAEfrRpi8b7iaLIXOEam5tZJ-o7G8yEX8xvvZxYoDqEKySzN4IfHw__";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: PenLine,
    title: "Guided Editor",
    description: "A structured form walks you through each section of your resume, from personal details to certifications.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your resume take shape in real-time as you type. Every change is reflected instantly.",
  },
  {
    icon: Layout,
    title: "Multiple Templates",
    description: "Choose from three professionally designed templates — Classic, Modern, and Executive.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Download your finished resume as a clean, print-ready PDF with a single click.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[oklch(0.97_0.008_80/0.85)] border-b border-[oklch(0.88_0.015_75)]">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-terracotta" />
            <span className="text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              ResumeForge
            </span>
          </div>
          <Link href="/editor">
            <Button
              className="bg-terracotta hover:bg-terracotta-dark text-white border-0 px-6"
              size="sm"
            >
              Start Building
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.97_0.008_80/0.92)] via-[oklch(0.97_0.008_80/0.75)] to-[oklch(0.97_0.008_80/0.3)]" />
        </div>

        <div className="container relative z-10 pt-20">
          <div className="max-w-2xl">
            <motion.p
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="text-terracotta text-sm tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-accent)', fontWeight: 500, fontSize: '0.875rem' }}
            >
              Craft Your Professional Story
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 text-ink"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              Resumes that
              <br />
              <span className="text-terracotta italic" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontStyle: 'italic' }}>
                leave an impression
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg md:text-xl text-warm-gray leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}
            >
              Build a beautifully typeset resume with our guided editor. Choose from elegant templates, preview in real-time, and export as PDF.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-terracotta hover:bg-terracotta-dark text-white border-0 px-8 py-6 text-base shadow-lg shadow-terracotta/20 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta/30 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Your Resume
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[oklch(0.99_0.004_80)]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-terracotta text-sm tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              How It Works
            </motion.p>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-4xl text-ink max-w-md"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Everything you need, nothing you don't
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="group"
              >
                <div className="mb-5 w-12 h-12 rounded-lg bg-[oklch(0.94_0.03_55/0.3)] flex items-center justify-center group-hover:bg-[oklch(0.94_0.03_55/0.5)] transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-terracotta" />
                </div>
                <h3
                  className="text-lg mb-2 text-ink"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
                >
                  {feature.title}
                </h3>
                <p className="text-warm-gray text-[0.938rem] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-24 bg-[oklch(0.97_0.008_80)]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-right"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-terracotta text-sm tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              Templates
            </motion.p>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-4xl text-ink ml-auto max-w-lg"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Three designs, one goal: your best first impression
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { img: TEMPLATE_CLASSIC, name: "Classic", desc: "Timeless serif elegance with terracotta accents" },
              { img: TEMPLATE_MODERN, name: "Modern", desc: "Clean sidebar layout with contemporary styling" },
              { img: TEMPLATE_EXECUTIVE, name: "Executive", desc: "Authoritative navy design for senior professionals" },
            ].map((tmpl, i) => (
              <motion.div
                key={tmpl.name}
                custom={i}
                variants={fadeUp}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-sm shadow-lg shadow-ink/10 group-hover:shadow-xl group-hover:shadow-ink/15 transition-all duration-400 group-hover:-translate-y-1">
                  <img
                    src={tmpl.img}
                    alt={`${tmpl.name} template preview`}
                    className="w-full h-[420px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <h3 className="text-white text-xl mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                      {tmpl.name}
                    </h3>
                    <p className="text-white/80 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      {tmpl.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, oklch(0.97 0.008 80) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              className="text-3xl md:text-5xl text-cream mb-6"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Ready to craft your resume?
            </motion.h2>
            <motion.p
              custom={1}
              variants={fadeUp}
              className="text-cream/60 text-lg mb-10 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              No sign-up required. Start building, preview instantly, and download your PDF.
            </motion.p>
            <motion.div custom={2} variants={fadeUp}>
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-terracotta hover:bg-terracotta-light text-white border-0 px-10 py-6 text-base shadow-lg shadow-terracotta/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
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
      <footer className="py-8 bg-ink border-t border-white/5">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-terracotta" />
            <span className="text-cream/60 text-sm" style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>
              ResumeForge
            </span>
          </div>
          <p className="text-cream/40 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            Built with craft and care
          </p>
        </div>
      </footer>
    </div>
  );
}

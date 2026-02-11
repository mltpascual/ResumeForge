/*
 * DESIGN: Minimalist / Severe
 * - Pure black on white, no color
 * - Oversized Space Grotesk headings
 * - Hairline borders as structure
 * - Numbered sections (01, 02, 03)
 * - JetBrains Mono for labels
 * - Deliberate emptiness / negative space
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Minus } from "lucide-react";

const HERO_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-1_1770772003000_na1fn_bWluaW1hbC1oZXJv.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTFfMTc3MDc3MjAwMzAwMF9uYTFmbl9iV2x1YVcxaGJDMW9aWEp2LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QPdvUtpnctFjUTYZkzQGjIvZUYs0I6q67CI6x7GLiJ7PtLnaxRLCIRwHbYtHz3CvE6UKBe5ZBudN0zAGYg8bTHrEJeYk1Q0nYOg5I09wMcS58Nw9VzsQyFBIqPiG7etbVLbUh~t7TBjuPQkgTJJtR-4Xaa7XCzLjKYqOtGvzkt~fGi4irS0Sw33Z2VL3Br6fQeDfOh8F5aMJS0Rm53oml-cMflhTlI3nxAjzGgjFzKIwVnHQS49fPgkC9aN1lA1ofneUhzu5Tp7g4JI7iQoYrsn774iJ3tD6CZrT0JW9~Kpts60PdrgjLmvJn~1lXPpin~DZXaazraMuaVu6ORUzKg__";

const TEMPLATE_1 = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-2_1770772007000_na1fn_bWluaW1hbC10ZW1wbGF0ZS0x.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTJfMTc3MDc3MjAwNzAwMF9uYTFmbl9iV2x1YVcxaGJDMTBaVzF3YkdGMFpTMHguanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RVC~lW7XbIqipPlfJ377emobVKwR-YmUJ8zOG2RyGUOtQYMdjD1h6097ZNT7UQbH6wDmETxLrSeYI-GvKskv~h~FY7MVEPO8RxUscYPftzdMcBckS0ODZ0yVV2IDh5O4ZKf7REqWiETTVS6reN5Hrt~hCMKyWI5rfAjbzeMwbgc9ZQWB82Edn~Noo6mkYohiuYfCYPXXWp5h3L83cyN~V2D1qzgeiW8TYg-z2BKLcwFwOZFHpQ5Ws85BMNSvwoelXPanLPz2CZFa4WZ5gvmJMxn5CwQfESiFWQbeo5GaN28zXFM-hvivvUr3~nfmf807jpRD-kV2qkgj5gc4GC0zfQ__";

const TEMPLATE_2 = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-3_1770772007000_na1fn_bWluaW1hbC10ZW1wbGF0ZS0y.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTNfMTc3MDc3MjAwNzAwMF9uYTFmbl9iV2x1YVcxaGJDMTBaVzF3YkdGMFpTMHkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=sVAwPbHgWgJwbdGDnsiCCUlboY6r01-T20PW0TP-wzTCVZI1n0WzRyYIJJsRlT1BD9njsM5Adrjh42tIQpGCAiE9Q5YOe29tmW5~oWhWN~TciKXLsKU-7q3FfqsdIez3ROyWAIYFb2w~ZFwhtU6EkPuJyXzUUSvTDU5VPsSVO98twz~mMaK17NoWgYAF6RUHLz1kAQC-rKTJDYRhM0C1nH3VXez0f~oZmCm782JN19Gaxw4B1Kk9wcUWoMpTnCpn94pvfGAE50qoC4zgjRziV8bjAd344~MTciSG4rJpb7Vs3WQU0iypDpaVBv-B3PFJEahRqtxbp2Ib4Vbxxrj6Lw__";

const TEMPLATE_3 = "https://private-us-east-1.manuscdn.com/sessionFile/5FIQ5XegK0rCC6t0RHeSVu/sandbox/E3e72YchZqpeCDdxOT6OO0-img-4_1770772011000_na1fn_bWluaW1hbC10ZW1wbGF0ZS0z.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNUZJUTVYZWdLMHJDQzZ0MFJIZVNWdS9zYW5kYm94L0UzZTcyWWNoWnFwZUNEZHhPVDZPTzAtaW1nLTRfMTc3MDc3MjAxMTAwMF9uYTFmbl9iV2x1YVcxaGJDMTBaVzF3YkdGMFpTMHouanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=vWKWYaDO3KssdVDGhyREtdSqUJMWxBFw3Fow6QkQkEh9Dkmu7Q5-aJ~Z2yvc2Buq4lunbX1C-5tgDLQYOJuiNVdAI5I7Yb9wCmKQ8LcdfTpP32KRvcuCv4B58mo77wD9N5bSu-~rOusAFqhKCNDg27NCTx9Z~JwzRHRICDPRRyo~fWjVwh7PwaZsqst5k2xtNQx3W5o4EpRO1sf6UuqUXL4iROvzowaI27VGiC7AU3T8nF9gGjfVzB~rzRwWZ89okE-Bc1NULWg1h64cUCQLQ2LQcJ3iRVTQXfrB6l4AP~woazwP3vuB-ckKpZdMkIhBDX-PW3GWQsbxFTAado-ciw__";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    num: "01",
    title: "Guided Editor",
    desc: "Structured form fields for every resume section. No blank-page anxiety.",
  },
  {
    num: "02",
    title: "Live Preview",
    desc: "See changes instantly as you type. What you see is what you export.",
  },
  {
    num: "03",
    title: "Three Templates",
    desc: "Classic, Modern, and Executive layouts. Each designed for clarity.",
  },
  {
    num: "04",
    title: "PDF Export",
    desc: "One-click download. Print-ready, ATS-friendly, pixel-perfect.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#09090B]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-tight">
            ResumeForge
          </span>
          <Link href="/editor">
            <span className="text-label text-[#71717A] hover:text-[#09090B] transition-colors duration-200">
              Open Editor
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-3.5rem)]">
            {/* Left — Text */}
            <div className="flex flex-col justify-center py-20 lg:py-32 lg:pr-16">
              <motion.p
                className="text-label text-[#71717A] mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Resume Builder
              </motion.p>

              <motion.h1
                className="text-display-xl mb-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              >
                Build
                <br />
                resumes
                <br />
                that work.
              </motion.h1>

              <motion.div
                className="w-16 h-px bg-[#09090B] mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                style={{ transformOrigin: "left" }}
              />

              <motion.p
                className="text-[#71717A] text-lg leading-relaxed max-w-md mb-12 font-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                A focused tool for creating clean, professional resumes.
                Fill in your details, choose a template, export as PDF.
                Nothing more.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href="/editor">
                  <span className="inline-flex items-center gap-3 bg-[#09090B] text-white px-8 py-4 font-display text-sm font-medium tracking-tight hover:opacity-70 transition-opacity duration-200">
                    Start Building
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <p className="text-label text-[#A1A1AA] mt-4">
                  No account required
                </p>
              </motion.div>
            </div>

            {/* Right — Image */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-full h-[80vh] relative">
                <img
                  src={HERO_IMAGE}
                  alt="Minimalist resume design"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="h-px bg-[#E4E4E7]" />
      </div>

      {/* Features */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
            {/* Left label */}
            <div>
              <p className="text-label text-[#71717A] mb-4">Features</p>
              <h2 className="text-display-lg">
                Everything
                <br />
                you need.
              </h2>
            </div>

            {/* Right — feature list */}
            <div className="space-y-0">
              {features.map((f, i) => (
                <motion.div
                  key={f.num}
                  className="border-t border-[#E4E4E7] py-8 grid grid-cols-[auto_1fr] gap-8 items-start"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                >
                  <span className="text-label text-[#A1A1AA] pt-1">{f.num}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[#71717A] leading-relaxed font-body max-w-md">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-[#E4E4E7]" />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="h-px bg-[#E4E4E7]" />
      </div>

      {/* Templates Showcase */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-label text-[#71717A] mb-4">Templates</p>
            <h2 className="text-display-lg">
              Three layouts.
              <br />
              Zero noise.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: TEMPLATE_1, name: "Classic", num: "01" },
              { img: TEMPLATE_2, name: "Modern", num: "02" },
              { img: TEMPLATE_3, name: "Executive", num: "03" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
              >
                <div className="aspect-[3/4] bg-[#FAFAFA] border border-[#E4E4E7] overflow-hidden mb-4 group">
                  <img
                    src={t.img}
                    alt={`${t.name} template`}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-label text-[#A1A1AA]">{t.num}</span>
                  <span className="font-display text-sm font-medium tracking-tight">
                    {t.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="h-px bg-[#E4E4E7]" />
      </div>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-label text-[#71717A] mb-4">Get Started</p>
              <h2 className="text-display-lg mb-6">
                Your resume,
                <br />
                simplified.
              </h2>
              <p className="text-[#71717A] leading-relaxed font-body max-w-md">
                No sign-up. No templates behind paywalls. Just open the editor,
                fill in your information, and download your resume as a
                professionally formatted PDF.
              </p>
            </div>
            <div className="lg:text-right">
              <Link href="/editor">
                <span className="inline-flex items-center gap-3 bg-[#09090B] text-white px-10 py-5 font-display text-sm font-medium tracking-tight hover:opacity-70 transition-opacity duration-200">
                  Open Editor
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex items-center justify-between">
          <span className="font-display text-xs font-medium tracking-tight text-[#A1A1AA]">
            ResumeForge
          </span>
          <div className="flex items-center gap-1 text-[#A1A1AA]">
            <Minus className="w-3 h-3" />
            <span className="text-label">2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

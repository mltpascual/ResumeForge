# ResumeForge — Design System

**Version:** 1.0  
**Last Updated:** February 2026  
**Design Philosophy:** Material Design 3 (Material You) — Baseline Palette

---

## 1. Design Movement & Philosophy

ResumeForge follows **Google's Material Design 3** (Material You) specification, adapted for a professional document-creation tool. The design prioritizes clarity, accessibility, and a sense of calm productivity. Every visual decision — from color to corner radius to motion — traces back to the MD3 baseline guidelines published at [m3.material.io](https://m3.material.io).

**Core Principles:**

- **Tonal Hierarchy over Hard Borders.** Surfaces are distinguished by tonal elevation (subtle background shifts) rather than heavy outlines, creating depth without visual noise.
- **Purposeful Color.** The primary purple (#6750A4) is reserved for interactive elements and key actions. Secondary and tertiary tones support hierarchy without competing for attention.
- **Generous Whitespace.** Layouts breathe. Padding and margins are generous to reduce cognitive load during the detail-heavy task of resume editing.
- **Motion with Meaning.** Animations use MD3 emphasized easing curves and exist only to communicate state changes — never for decoration.

---

## 2. Color System

### 2.1 Light Scheme (Default)

| Token | Hex | Role |
|---|---|---|
| `--background` | `#FEF7FF` | Page background (Surface) |
| `--foreground` | `#1D1B20` | Primary text (On Surface) |
| `--primary` | `#6750A4` | Buttons, links, active states |
| `--primary-foreground` | `#FFFFFF` | Text on primary surfaces |
| `--secondary` | `#E8DEF8` | Secondary container fills |
| `--secondary-foreground` | `#4A4458` | Text on secondary containers |
| `--accent` | `#FFD8E4` | Tertiary container (highlights) |
| `--accent-foreground` | `#633B48` | Text on tertiary containers |
| `--destructive` | `#B3261E` | Error states, delete actions |
| `--muted` | `#E7E0EC` | Disabled states, surface variant |
| `--muted-foreground` | `#49454F` | Secondary text |
| `--border` | `#79747E` | Outlines |
| `--card` | `#F7F2FA` | Card backgrounds (Surface Container Low) |
| `--popover` | `#ECE6F0` | Popover/dropdown backgrounds (Surface Container High) |

### 2.2 Dark Scheme

| Token | Hex | Role |
|---|---|---|
| `--background` | `#141218` | Page background |
| `--foreground` | `#E6E0E9` | Primary text |
| `--primary` | `#D0BCFF` | Primary interactive elements |
| `--primary-foreground` | `#381E72` | Text on primary |
| `--secondary` | `#CCC2DC` | Secondary fills |
| `--destructive` | `#F2B8B5` | Error states |
| `--border` | `#938F99` | Outlines |
| `--card` | `#1D1B20` | Card backgrounds |

### 2.3 MD3 Extended Tokens

Additional MD3 surface and container tokens are defined as CSS custom properties prefixed with `--md3-*`:

- **Surface Tint:** `--md3-surface-tint` — Used for tonal elevation overlays
- **Surface Containers:** Five levels from `lowest` (#FFFFFF) to `highest` (#E6E0E9) for layered UI
- **Primary Container:** `--md3-primary-container` (#EADDFF) — Filled chips, active tab backgrounds
- **Outline Variant:** `--md3-outline-variant` (#CAC4D0) — Subtle dividers and borders

### 2.4 Industry Color Presets (Resume Accent Colors)

| Industry | Colors |
|---|---|
| Finance | `#1B365D`, `#2C5F8A`, `#4A7FB5`, `#8FB8DE` |
| Tech | `#0F766E`, `#14B8A6`, `#2DD4BF`, `#99F6E4` |
| Creative | `#BE185D`, `#EC4899`, `#F472B6`, `#FBCFE8` |
| Healthcare | `#1D4ED8`, `#3B82F6`, `#60A5FA`, `#BFDBFE` |
| Legal | `#44403C`, `#78716C`, `#A8A29E`, `#D6D3D1` |
| Education | `#B45309`, `#D97706`, `#F59E0B`, `#FDE68A` |

---

## 3. Typography System

### 3.1 Font Stack

| Role | Font Family | Fallback |
|---|---|---|
| Display / Headline | Google Sans | Roboto, sans-serif |
| Body / Label | Roboto Flex | Roboto, sans-serif |
| Monospace | JetBrains Mono | monospace |

### 3.2 Usage Rules

- **Headings (h1–h6):** Always use `font-display` (Google Sans), weight 500, letter-spacing 0em.
- **Body text:** Use `font-body` (Roboto Flex), weight 400, letter-spacing 0.01em, base size 16px.
- **Code / technical labels:** Use `font-mono-accent` (JetBrains Mono).
- **Resume templates** use their own typography systems (Inter, Merriweather, Lora, Playfair Display, Source Sans 3, Crimson Text, DM Sans, Libre Baskerville, Nunito Sans) loaded via Google Fonts CDN.

### 3.3 Scale

The application follows Tailwind's default type scale. Key sizes used throughout:

| Element | Class | Size |
|---|---|---|
| Hero heading | `text-5xl md:text-6xl lg:text-[72px]` | 48–72px |
| Section heading | `text-3xl md:text-4xl` | 30–36px |
| Card title | `text-lg` | 18px |
| Body | `text-sm` / `text-base` | 14–16px |
| Label / caption | `text-xs` | 12px |

---

## 4. Shape & Corner Radius

Following the MD3 shape scale:

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small chips, badges |
| `--radius-md` | 12px | Cards, inputs, buttons |
| `--radius-lg` | 16px | Dialogs, sheets |
| `--radius-xl` | 28px | FABs, full-round pills |

Tab pills and nav links use `rounded-full` for the MD3 pill shape. Cards and form containers use `rounded-2xl` (16px).

---

## 5. Elevation & Shadows

MD3 uses tonal elevation (surface color shifts) as the primary depth cue, with shadows as a secondary signal:

| Level | Class | Box Shadow |
|---|---|---|
| Level 1 | `.md3-elevation-1` | `0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)` |
| Level 2 | `.md3-elevation-2` | `0 1px 2px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.1)` |
| Level 3 | `.md3-elevation-3` | `0 4px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)` |

Template cards use a custom hover elevation: `0 8px 16px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)` with a `scale(1.04)` transform.

---

## 6. Motion & Animation

### 6.1 Easing Curves

| Name | Value | Usage |
|---|---|---|
| Standard / Emphasized | `cubic-bezier(0.2, 0, 0, 1)` | Most transitions |
| Emphasized Decelerate | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Enter animations |
| Emphasized Accelerate | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exit animations |

### 6.2 Duration Guidelines

- **Micro-interactions** (hover, focus): 200ms
- **Component transitions** (tab switch, accordion): 300ms
- **Page-level animations** (modal enter/exit): 400–500ms
- **Background decorative** (floating circles on homepage): 20–30s infinite

### 6.3 Framer Motion Patterns

- **Tab underline indicator:** Uses `layoutId="activeTab"` for shared layout animation between tabs.
- **Drag-and-drop:** dnd-kit with `restrictToVerticalAxis` and `closestCenter` collision detection.
- **Onboarding tour:** Step transitions use `AnimatePresence` with fade + slide.
- **FAQ accordion:** Chevron rotation (0° → 180°) with 200ms transition.

---

## 7. State Layer System

Interactive elements use the MD3 state layer pattern — a semi-transparent overlay of `currentColor` that responds to hover and press:

```css
.md3-state-layer:hover::after { opacity: 0.08; }
.md3-state-layer:active::after { opacity: 0.12; }
```

This ensures consistent interaction feedback across all interactive surfaces regardless of their background color.

---

## 8. Layout Patterns

### 8.1 Homepage

- **Nav bar:** Fixed top, frosted glass (`backdrop-blur-md`), logo left, section links center, CTA right.
- **Hero:** Centered text with animated floating background circles and dot grid pattern.
- **Features:** 3-column responsive grid of cards.
- **Templates:** 5-column responsive grid (2 rows of 5) with hover preview overlays.
- **FAQ:** 2-column accordion grid.
- **CTA:** Centered section with gradient background.

### 8.2 Editor

- **Split pane:** Left panel (form editor, ~45%) + Right panel (resume preview, ~55%) using `react-resizable-panels`.
- **Tab navigation:** Two rows of pill-shaped tabs — info tabs (Personal, Experience, Education, Skills, Projects, Certs) and design tabs (Order, Templates, Fonts, Size, Colors).
- **Bottom bar:** Auto-save indicator, word count, completeness score, ATS score.
- **Toolbar:** Logo, back button, undo area, feature buttons (LinkedIn import, profiles, cover letter, job matcher, recruiter preview, DOCX export, keyboard shortcuts, tour), theme toggle.

---

## 9. Component Inventory

### 9.1 Custom Components

| Component | Purpose |
|---|---|
| `ATSScoreChecker` | 19-check ATS compatibility analysis with expandable detail modal |
| `ATSSimulator` | Multi-platform ATS parse simulation (Workday, Greenhouse, Lever, Taleo, iCIMS) |
| `AutoSaveIndicator` | Timestamp-based save status with manual save button |
| `BulletPointEditor` | Rich bullet point editing for experience/project descriptions |
| `CoverLetterGenerator` | Template-based cover letter assembly from resume data |
| `DocxExport` | DOCX file generation using the `docx` library |
| `DraggableSections` | Drag-and-drop section reordering with dnd-kit |
| `JobDescriptionMatcher` | Keyword extraction and resume-to-JD matching analysis |
| `KeyboardShortcuts` | Global shortcut handler with overlay reference modal |
| `LinkedInImport` | LinkedIn PDF text parser and field mapper |
| `MonthPicker` | Month/year date picker for experience and education dates |
| `OnboardingTour` | Step-by-step feature walkthrough with element highlighting |
| `ResumeCompleteness` | 10-field completeness score with circular progress ring |
| `ResumeProfiles` | Multiple resume version management via localStorage |
| `SectionTips` | Contextual writing tips per form section |
| `WordCount` | Per-section word count and reading time estimator |

### 9.2 Resume Templates

| Template | Style | Typography |
|---|---|---|
| Classic | Traditional single-column | Inter |
| Modern | Clean with accent sidebar | DM Sans |
| Executive | Formal two-column | Merriweather |
| Compact | Dense single-column | Source Sans 3 |
| Minimal | Ultra-clean whitespace | Inter |
| Two Column | Split layout | Nunito Sans |
| Creative | Bold header with color blocks | DM Sans |
| Developer | Terminal-inspired with monospace | JetBrains Mono + Inter |
| Academic | Formal serif with centered header | Libre Baskerville |
| Elegance | Refined serif with gold accents | Playfair Display + Lora |

---

## 10. Accessibility

- **Focus rings:** All interactive elements maintain visible focus rings via `outline-ring/50`.
- **Color contrast:** MD3 baseline colors meet WCAG AA contrast requirements.
- **Keyboard navigation:** Full keyboard support for tabs, drag-and-drop (via dnd-kit keyboard sensor), modals, and accordions.
- **Screen reader support:** Semantic HTML, ARIA labels on icon-only buttons, and tooltips on abbreviated UI elements.
- **Reduced motion:** Framer Motion respects `prefers-reduced-motion` media query.
- **Print styles:** Dedicated `@media print` rules for clean resume output.

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 640px | Single column, hamburger menu, stacked editor/preview |
| Tablet | 640–1024px | Two-column where possible, collapsible panels |
| Desktop | > 1024px | Full split-pane editor, 5-column template grid |

---

## 12. File Organization

```
client/src/
├── index.css              ← Design tokens, MD3 variables, global styles
├── App.tsx                ← Theme provider, routing
├── pages/
│   ├── Home.tsx           ← Landing page with all sections
│   └── Editor.tsx         ← Resume editor with split pane
├── components/
│   ├── ui/                ← shadcn/ui primitives (40+ components)
│   ├── forms/             ← Section-specific form components
│   ├── preview/           ← Resume template renderers
│   └── [feature].tsx      ← Feature components (ATS, Cover Letter, etc.)
├── contexts/
│   ├── ResumeContext.tsx   ← Resume data state management
│   └── ThemeContext.tsx    ← Light/dark theme management
├── hooks/                 ← Custom React hooks
├── lib/                   ← Utility functions
└── types/
    └── resume.ts          ← TypeScript type definitions
```

# Minimalist / Severe UI — Design System for ResumeForge

## Design Direction: Exaggerated Minimalism meets Swiss Style

### DFII Score
- Aesthetic Impact: 5 (Stark black/white with oversized type is instantly memorable)
- Context Fit: 5 (Resume builder = professional tool, minimalism = professional)
- Implementation Feasibility: 5 (Low complexity, CSS-first)
- Performance Safety: 5 (No heavy assets, pure typography)
- Consistency Risk: 1 (Easy to maintain across screens)
- **DFII = 19 (Excellent)**

### Differentiation Anchor
> "If screenshotted with the logo removed, the massive typography, stark black-white contrast, and deliberate emptiness would make it unmistakable."

---

## Core Principles
1. **Radical Reduction** — Remove everything that doesn't serve function
2. **Typography as Architecture** — Type IS the design, not decoration on top of it
3. **Extreme Contrast** — Pure black on pure white, no grays except for hierarchy
4. **Deliberate Emptiness** — White space is the primary design element

## Color Philosophy
- **Background**: #FFFFFF (pure white)
- **Foreground**: #000000 (pure black)
- **Muted**: #71717A (zinc-500 for secondary text)
- **Accent**: #000000 (black IS the accent — no color needed)
- **Border**: #E4E4E7 (zinc-200, hairline only)
- **Surface**: #FAFAFA (zinc-50, barely-there card backgrounds)
- Single vibrant accent for CTA only: #000000 with inverted white text

## Typography System
- **Display**: Space Grotesk (700) — geometric, distinctive, not generic
- **Body**: Archivo (400, 500) — clean, highly readable, professional
- Oversized display: clamp(2.5rem, 8vw, 6rem) for hero
- Tight letter-spacing on headings: -0.03em
- Generous line-height on body: 1.65

## Layout Paradigm
- Asymmetric grid with generous margins
- Content pushed to edges, not centered
- Horizontal tab bar for editor sections (not vertical sidebar)
- Full-width sections with max-w-7xl container
- No rounded corners (sharp edges = severe)
- Hairline borders only (1px)

## Signature Elements
1. **Oversized section numbers** — "01", "02", "03" as decorative anchors
2. **Horizontal rule system** — Thin black lines as the primary structural device
3. **Monospace accents** — Small labels in monospace for contrast

## Interaction Philosophy
- No hover color changes — only opacity shifts (0.6)
- Underline animations on links (left-to-right reveal)
- No shadows, no gradients, no blur
- Transitions: 200ms ease, transform/opacity only
- Buttons: solid black with white text, or outlined with black border

## Animation
- Minimal entrance: fade-in + slight translateY(8px)
- No decorative motion
- prefers-reduced-motion respected

## Editor Layout Change
- **HORIZONTAL TABS** across the top instead of vertical sidebar
- Tab labels: Personal | Experience | Education | Skills | Projects | Certifications
- Active tab: black text with bottom border underline
- Inactive tab: muted gray text
- Form below tabs, preview panel on the right

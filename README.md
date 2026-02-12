# ResumeForge

A focused, client-side resume builder for creating clean, professional resumes. Fill in your details, choose from 10 templates, check ATS compatibility, generate a cover letter, and export as PDF or DOCX — all without an account or server dependency.

## Key Features

- **10 Resume Templates** — Classic, Modern, Executive, Compact, Minimal, Two Column, Creative, Developer, Academic, and Elegance layouts with distinct typography and structure.
- **Real-Time Preview** — Split-pane editor with live resume rendering as you type.
- **ATS Score Checker** — 19-point weighted analysis across Contact Info, Content Quality, Keywords & Skills, and Formatting categories.
- **ATS Simulator** — Simulates how Workday, Greenhouse, Lever, Taleo, and iCIMS would parse your resume, with cross-platform comparison.
- **Job Description Matcher** — Paste a job posting to see which keywords match your resume and which are missing.
- **Cover Letter Generator** — Assembles a tailored cover letter from your resume data with Professional, Enthusiastic, or Conversational tone options.
- **DOCX Export** — Download your resume as a Word document alongside PDF export.
- **LinkedIn PDF Import** — Parse a LinkedIn profile PDF export and auto-fill resume fields.
- **Multiple Resume Profiles** — Save and switch between different resume versions stored in localStorage.
- **Drag-and-Drop Reordering** — Rearrange Experience, Education, Projects, and Certifications entries by dragging.
- **Keyboard Shortcuts** — Press `?` to view all available shortcuts.
- **Dark Mode** — Full light/dark theme support following Material Design 3 color tokens.
- **Completeness Score** — Real-time percentage showing how filled-in your resume is.
- **Word Count & Reading Time** — Per-section word counts displayed in the editor footer.
- **Section Writing Tips** — Contextual advice for each form section to improve content quality.
- **Onboarding Tour** — First-time walkthrough highlighting key features.
- **Industry Color Presets** — Finance, Tech, Creative, Healthcare, Legal, and Education accent palettes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Routing** | Wouter |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Design System** | Material Design 3 (Baseline) |
| **Animation** | Framer Motion |
| **Drag & Drop** | dnd-kit |
| **PDF Export** | jsPDF + html2canvas |
| **DOCX Export** | docx (npm) + file-saver |
| **Build Tool** | Vite 7 |
| **Language** | TypeScript 5.6 |
| **Package Manager** | pnpm |

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js** 20 or higher
- **pnpm** 10 or higher (install via `npm install -g pnpm`)

No database, Redis, or external API keys are required. The application is entirely client-side.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-maker.git
cd resume-maker
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). Vite's HMR (Hot Module Replacement) is enabled, so changes to source files will reflect instantly in the browser.

### 4. Build for Production

To create an optimized production build of the client:

```bash
pnpm run build:client
```

This outputs static files to `dist/public/`. You can preview the production build locally:

```bash
pnpm preview
```

---

## Deploying to Vercel

This project is configured for zero-config Vercel deployment. A `vercel.json` file is included in the repository root.

### Option A: Deploy via GitHub Integration (Recommended)

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the GitHub repository.
3. Vercel will auto-detect the configuration from `vercel.json`:
   - **Build Command:** `pnpm run build:client`
   - **Output Directory:** `dist/public`
   - **Install Command:** `pnpm install`
   - **Framework:** Vite
4. Click **Deploy**.

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. The CLI will read `vercel.json` automatically.

### Vercel Configuration Details

The `vercel.json` file configures the following:

| Setting | Value | Purpose |
|---|---|---|
| `buildCommand` | `pnpm run build:client` | Builds only the frontend (no server) |
| `outputDirectory` | `dist/public` | Points to Vite's output directory |
| `framework` | `vite` | Enables Vite-specific optimizations |
| `rewrites` | `/(.*) → /index.html` | SPA fallback for client-side routing |
| `headers` | Cache-Control on assets | Immutable caching for hashed static files |

### Environment Variables

No environment variables are required for the core application. The following Manus-specific variables are injected automatically in the Manus hosting environment and can be safely ignored for Vercel deployment:

| Variable | Required | Description |
|---|---|---|
| `VITE_APP_TITLE` | No | Overrides the app title (defaults to "ResumeForge") |
| `VITE_APP_LOGO` | No | Custom logo URL |
| `VITE_ANALYTICS_*` | No | Umami analytics integration |

---

## Architecture

### Directory Structure

```
resume-maker/
├── client/                          # Frontend application root
│   ├── index.html                   # HTML entry point with Google Fonts
│   ├── public/                      # Static assets (copied verbatim to /)
│   └── src/
│       ├── main.tsx                 # React entry point
│       ├── App.tsx                  # Routes & top-level providers
│       ├── index.css                # Design tokens, MD3 variables, global styles
│       ├── pages/
│       │   ├── Home.tsx             # Landing page (hero, features, templates, FAQ)
│       │   ├── Editor.tsx           # Resume editor (split pane, tabs, toolbar)
│       │   └── NotFound.tsx         # 404 page
│       ├── components/
│       │   ├── ui/                  # 40+ shadcn/ui primitives
│       │   ├── forms/               # Section-specific form components
│       │   │   ├── PersonalInfoForm.tsx
│       │   │   ├── ExperienceForm.tsx
│       │   │   ├── EducationForm.tsx
│       │   │   ├── SkillsForm.tsx
│       │   │   ├── ProjectsForm.tsx
│       │   │   └── CertificationsForm.tsx
│       │   ├── preview/             # Resume template renderers
│       │   │   ├── ResumePreview.tsx # Template router (6 original templates)
│       │   │   └── NewTemplates.tsx  # 4 additional templates
│       │   ├── ATSScoreChecker.tsx   # ATS compatibility analysis
│       │   ├── ATSSimulator.tsx      # Multi-platform ATS parse simulation
│       │   ├── AutoSaveIndicator.tsx # Save status with timestamp
│       │   ├── BulletPointEditor.tsx # Rich bullet editing
│       │   ├── CoverLetterGenerator.tsx
│       │   ├── DocxExport.tsx        # Word document export
│       │   ├── DraggableSections.tsx  # Section reordering
│       │   ├── JobDescriptionMatcher.tsx
│       │   ├── KeyboardShortcuts.tsx  # Global shortcuts + overlay
│       │   ├── LinkedInImport.tsx     # LinkedIn PDF parser
│       │   ├── OnboardingTour.tsx     # Feature walkthrough
│       │   ├── ResumeCompleteness.tsx # Completeness score ring
│       │   ├── ResumeProfiles.tsx     # Multi-profile management
│       │   ├── SectionTips.tsx        # Writing tips per section
│       │   └── WordCount.tsx          # Word count + reading time
│       ├── contexts/
│       │   ├── ResumeContext.tsx      # Resume data state (localStorage)
│       │   └── ThemeContext.tsx       # Light/dark theme
│       ├── hooks/                    # Custom React hooks
│       ├── lib/                      # Utility functions
│       └── types/
│           └── resume.ts             # TypeScript type definitions
├── server/                           # Placeholder (not used in static deployment)
├── shared/                           # Shared constants
├── vercel.json                       # Vercel deployment configuration
├── vite.config.ts                    # Vite build configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── DESIGN.md                         # Design system documentation
├── DEVELOPMENT_GUIDELINES.md         # Coding standards & best practices
├── C4-Documentation/                 # C4 architecture documentation
│   ├── README.md                     # Documentation index
│   ├── c4-context.md                 # System context & personas
│   ├── c4-container.md               # Technology & deployment
│   └── c4-component.md               # Component catalog & relationships
├── conductor/                        # Project context & workflow docs
│   ├── index.md                      # Navigation hub
│   ├── product.md                    # Product vision & features
│   ├── tech-stack.md                 # Technology decisions
│   ├── workflow.md                   # Development workflow
│   ├── product-guidelines.md         # Product guidelines
│   └── code_styleguides/             # Language-specific style guides
└── README.md                         # This file
```

### Data Flow

All data lives in the browser. There is no server, database, or external API dependency.

```
User Input → React Forms → ResumeContext (React Context) → localStorage
                                    ↓
                            ResumePreview (template renderer)
                                    ↓
                            PDF/DOCX Export (jsPDF / docx)
```

The `ResumeContext` is the central state manager. It holds the full resume data object, provides CRUD functions for each section (add, update, remove, duplicate, reorder), and persists the entire state to `localStorage` on every change. The `ResumePreview` component reads from context and renders the selected template.

### Resume Data Model

The core `ResumeData` type contains:

| Section | Key Fields |
|---|---|
| **Personal** | name, title, email, phone, location, website, linkedin, summary |
| **Experience** | company, position, startDate, endDate, current, description (bullet points) |
| **Education** | institution, degree, field, startDate, endDate, gpa, description |
| **Skills** | name, level (beginner/intermediate/advanced/expert), category |
| **Projects** | name, description, technologies, link |
| **Certifications** | name, issuer, date, url |
| **Settings** | templateId, accentColor, fontFamily, fontSize, lineHeight, sectionOrder |

### Template System

Each template is a React component that receives the full `ResumeData` object and renders it within a fixed A4-ratio container (210mm x 297mm scaled to screen). Templates define their own typography, layout, and color application using the `accentColor` from settings.

| Template | File | Style |
|---|---|---|
| Classic, Modern, Executive, Compact, Minimal, Two Column | `ResumePreview.tsx` | Original 6 templates |
| Creative, Developer, Academic, Elegance | `NewTemplates.tsx` | Extended templates |

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR on port 3000 |
| `pnpm run build:client` | Build client-only for static deployment |
| `pnpm build` | Build client + server (for Manus hosting) |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |

---

## Keyboard Shortcuts

Press `?` anywhere in the editor to open the shortcuts overlay. Key bindings include:

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + P` | Export as PDF |
| `Ctrl/Cmd + S` | Save to JSON |
| `Ctrl/Cmd + E` | Toggle editor/preview (mobile) |
| `Ctrl/Cmd + D` | Toggle dark mode |
| `Escape` | Close active modal |
| `1`–`7` | Switch to tab by number |
| `?` | Open shortcuts reference |

---

## Browser Support

The application targets modern evergreen browsers:

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

Internet Explorer is not supported.

---

## Performance

The production build generates approximately 2.5 MB of JavaScript (400 KB gzipped) across code-split chunks. Key libraries like jsPDF and html2canvas are loaded on demand when the user triggers an export. Google Fonts are loaded asynchronously via `preconnect` hints in the HTML head.

Static assets (JS, CSS, fonts) are served with `Cache-Control: public, max-age=31536000, immutable` headers via the Vercel configuration, ensuring repeat visits load instantly from cache.

---

## Documentation

The project includes comprehensive documentation across multiple formats:

| Document | Purpose |
|---|---|
| [DESIGN.md](DESIGN.md) | Full design system — colors, typography, spacing, motion, components |
| [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) | Coding standards, security, testing, and UI/UX best practices |
| [C4-Documentation/](C4-Documentation/) | C4 architecture diagrams — Context, Container, and Component levels |
| [conductor/](conductor/) | Product vision, tech stack decisions, workflow, and style guides |

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Make your changes and ensure `pnpm check` passes with no TypeScript errors.
4. Run `pnpm format` to ensure consistent code style.
5. Submit a pull request with a clear description of the changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Material Design 3](https://m3.material.io) for the design system specification
- [shadcn/ui](https://ui.shadcn.com) for the component primitives
- [Tailwind CSS](https://tailwindcss.com) for the utility-first styling framework
- [Vite](https://vite.dev) for the build tooling
- [dnd-kit](https://dndkit.com) for the drag-and-drop system
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Google Fonts](https://fonts.google.com) for the typography

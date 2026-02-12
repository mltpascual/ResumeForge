# Tech Stack — ResumeForge

## Architecture

ResumeForge is a **client-side single-page application** with no backend server. All data processing, storage, and rendering happens in the browser. The project is structured for deployment as a static site on Vercel, Netlify, or any CDN-backed host.

## Primary Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Language | TypeScript | ~5.6 | Type-safe development across all source files |
| UI Framework | React | 19 | Component-based UI with hooks and context |
| Build Tool | Vite | 6 | Fast HMR development server and optimized production builds |
| Styling | Tailwind CSS | 4 | Utility-first CSS with OKLCH color tokens |
| Component Library | shadcn/ui | Latest | Radix-based accessible UI primitives |
| Routing | Wouter | ^3.7.0 | Lightweight client-side routing |
| Animation | Framer Motion | ^12.12.1 | Layout animations and gesture support |
| Drag & Drop | @dnd-kit | core ^6.3, sortable ^10.0 | Accessible drag-and-drop for entry reordering |
| Document Export | docx | ^9.5.0 | Programmatic DOCX generation |
| File Download | file-saver | ^2.0.5 | Trigger browser file downloads |
| Icons | Lucide React | ^0.513.0 | Consistent icon set across the application |
| Toasts | Sonner | ^2.0.4 | Non-blocking notification system |

## Development Tools

| Tool | Purpose |
|---|---|
| pnpm | Package manager (fast, disk-efficient) |
| TypeScript Compiler | Type checking via `tsc --noEmit` |
| Prettier | Code formatting |
| Vite Dev Server | HMR development with instant feedback |

## Data Storage

All data is stored in the browser's `localStorage`. There is no database, no API calls, and no server-side persistence.

| Key | Content |
|---|---|
| `resumeforge-data` | Current resume JSON (personal info, experience, education, skills, projects, certifications, settings) |
| `resumeforge-profiles` | Array of saved resume profiles with metadata |
| `resumeforge-onboarding` | Boolean flag for first-time tour completion |
| `resumeforge-theme` | User's dark/light theme preference |

## Deployment Target

| Platform | Configuration |
|---|---|
| Vercel | `vercel.json` with SPA rewrites, asset caching, and Vite framework preset |
| Build Command | `pnpm run build:client` |
| Output Directory | `dist/public` |
| Node Version | 22.x |

## Infrastructure Decisions

The decision to keep ResumeForge as a static frontend was deliberate. Resume data is personal and sensitive — by never sending it to a server, users retain full control over their information. The trade-off is that AI-powered features (semantic analysis, generative rewriting) are not available without upgrading to a full-stack architecture with backend LLM access.

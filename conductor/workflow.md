# Workflow — ResumeForge

## Development Methodology

ResumeForge follows an iterative, feature-driven development approach. Each feature is implemented as a self-contained unit, tested in the browser, and checkpointed before moving to the next. The project prioritizes shipping working features quickly over exhaustive upfront planning.

## Git Workflow

The project uses a single-branch workflow with checkpoint-based versioning managed by the Manus platform. For external collaboration via GitHub, the recommended approach is feature branches with pull requests.

| Convention | Standard |
|---|---|
| Branch naming | `feature/<name>`, `fix/<name>`, `docs/<name>` |
| Commit messages | Imperative mood, concise subject line (e.g., "Add drag-and-drop to Experience cards") |
| Commit scope | One logical change per commit — avoid mixing features |
| PR size | Small, focused PRs that address a single feature or fix |

## Code Organization

All source code lives under `client/src/`. The project follows a feature-based organization within a flat component structure.

| Directory | Purpose | Naming Convention |
|---|---|---|
| `pages/` | Route-level components | PascalCase (e.g., `Editor.tsx`, `Home.tsx`) |
| `components/` | Reusable feature components | PascalCase (e.g., `ATSScoreChecker.tsx`) |
| `components/forms/` | Form section components | PascalCase with `Form` suffix (e.g., `ExperienceForm.tsx`) |
| `components/preview/` | Resume template renderers | PascalCase (e.g., `ResumePreview.tsx`, `NewTemplates.tsx`) |
| `components/ui/` | shadcn/ui primitives | kebab-case (e.g., `button.tsx`, `dialog.tsx`) |
| `contexts/` | React context providers | PascalCase with `Context` suffix |
| `hooks/` | Custom React hooks | camelCase with `use` prefix |
| `types/` | TypeScript type definitions | camelCase (e.g., `resume.ts`) |
| `lib/` | Utility helpers | camelCase (e.g., `utils.ts`) |

## Quality Gates

Before any feature is considered complete, it must pass these checks:

1. **No TypeScript errors**: `pnpm run check` passes cleanly.
2. **No console errors**: Browser console shows zero errors during normal usage.
3. **Visual verification**: Feature renders correctly at desktop (1440px) and mobile (375px) widths.
4. **Keyboard accessibility**: All new interactive elements are reachable via Tab and operable via Enter/Space.
5. **Dark mode**: Feature renders correctly in both light and dark themes.

## Testing Strategy

Currently, the project relies on manual browser testing and TypeScript type checking. The recommended future testing stack is Playwright for E2E tests covering critical user journeys (resume creation, template switching, export, data persistence).

## Deployment Procedure

1. Ensure `pnpm run build:client` completes without errors.
2. Push code to GitHub repository.
3. Import repository into Vercel (auto-detects `vercel.json` configuration).
4. Vercel builds and deploys automatically on each push to the main branch.
5. Verify deployment at the assigned Vercel URL.

## Documentation Standards

| Document | Location | Update Trigger |
|---|---|---|
| `README.md` | Project root | New features, setup changes, deployment updates |
| `DESIGN.md` | Project root | Color system changes, new components, typography updates |
| `DEVELOPMENT_GUIDELINES.md` | Project root | New coding standards, security policies, testing strategies |
| `conductor/` | Project root | Product vision changes, tech stack updates, workflow changes |

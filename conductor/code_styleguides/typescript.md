# TypeScript & React Style Guide — ResumeForge

## General TypeScript

Use strict TypeScript throughout. All files use `.tsx` for components and `.ts` for utilities and types. Avoid `any` — use `unknown` with type guards when the type is genuinely uncertain.

## Naming

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `ATSScoreChecker`, `ExperienceForm` |
| Hooks | camelCase with `use` prefix | `useComposition`, `useMobile` |
| Context | PascalCase with `Context` suffix | `ResumeContext`, `ThemeContext` |
| Types/Interfaces | PascalCase | `ResumeData`, `Experience`, `TemplateId` |
| Constants | UPPER_SNAKE_CASE for true constants, camelCase for config objects | `TEMPLATES`, `sampleResume` |
| Files | PascalCase for components, camelCase for utilities | `Editor.tsx`, `utils.ts` |
| CSS variables | kebab-case with `--md3-` prefix | `--md3-primary`, `--md3-surface` |

## Component Structure

Follow this order within each component file:

1. Imports (external libraries, then internal modules, then types)
2. Type definitions specific to this component
3. Constants and static data
4. Helper functions (pure, no hooks)
5. Component function declaration
6. State declarations (`useState`, `useRef`)
7. Derived state (`useMemo`)
8. Effects (`useEffect`)
9. Event handlers
10. JSX return

## React Patterns

Use functional components exclusively. Prefer composition over inheritance. Extract shared logic into custom hooks. Use React Context for cross-cutting state (theme, resume data) — avoid prop drilling beyond 2 levels.

Never call `setState` or navigation functions in the render phase. Wrap side effects in `useEffect`. Stabilize object/array references with `useState` initializers or `useMemo` to prevent infinite re-render loops.

## Imports

Group imports in this order, separated by blank lines: React and framework imports, third-party libraries, internal components, internal utilities and types, CSS/assets.

## Error Handling

Use try-catch for async operations and file parsing. Display user-friendly toast notifications for recoverable errors. Use ErrorBoundary for component-level crash recovery. Never swallow errors silently — at minimum log to console in development.

# Development Guidelines — ResumeForge

> This document synthesizes coding standards, UI/UX principles, security policies, and testing strategies for the ResumeForge project. All developers and AI agents should refer to this file throughout the development lifecycle.

---

## Table of Contents

1. [UI/UX & Frontend Design](#1-uiux--frontend-design)
2. [Code Quality & Best Practices](#2-code-quality--best-practices)
3. [Security](#3-security)
4. [Testing](#4-testing)

---

## 1. UI/UX & Frontend Design

This section draws from three specialized disciplines: **Frontend Design** (aesthetic direction and craft), **UI/UX Engineering** (interaction quality and accessibility), and **Web Design Guidelines** (standards compliance and performance).

### 1.1 Design Philosophy

Every interface must have an **intentional aesthetic direction**. ResumeForge follows Material Design 3 (Baseline) with a custom purple-toned color system and deliberate typographic choices.

**Core Mandates:**

- Define the interface's **purpose**, **tone**, and **differentiation anchor** before writing code.
- Commit to a dominant color story using CSS variables — one primary tone, one accent, and one neutral system. All colors in ResumeForge are defined in `client/src/index.css` using OKLCH format.
- Choose typography that serves the design: one expressive display font and one restrained body font. Avoid system defaults like Inter or Roboto for display purposes.
- Every design flourish must serve the overall aesthetic thesis. Decoration without intent is a failure.
- Include at least one memorable visual element per major view — something a user would recall 24 hours later.

**Anti-Patterns to Avoid:**

- Generic full-page centered layouts without spatial intention.
- Default Tailwind/shadcn layouts used without customization.
- Symmetrical, predictable section arrangements.
- Purple-on-white SaaS gradients used without purpose.

### 1.2 Accessibility (Critical Priority)

Accessibility is not optional. Every component must meet WCAG 2.1 AA standards at minimum.

| Requirement | Standard | Implementation |
|---|---|---|
| Color contrast | 4.5:1 minimum for normal text | Verify with contrast checker tools |
| Focus states | Visible focus ring on all interactive elements | Use `focus-visible:ring-*` classes |
| Alt text | Descriptive alt on all meaningful images | Decorative images use `alt=""` |
| ARIA labels | All icon-only buttons must have `aria-label` | Applies to toolbar icons, close buttons |
| Keyboard navigation | Tab order follows visual layout | Test with Tab key through all flows |
| Form labels | Every input has an associated `<label>` or `aria-label` | Use `htmlFor` attribute |
| Semantic HTML | Use `<button>`, `<a>`, `<nav>`, `<main>`, `<section>` | Avoid `<div>` with click handlers for navigation |
| Live regions | Async updates use `aria-live="polite"` | Toast notifications, auto-save status |

### 1.3 Touch & Interaction

- **Minimum touch target**: 44x44px for all interactive elements.
- **Primary actions**: Use click/tap events, not hover-dependent interactions.
- **Button states**: Disable buttons during async operations and show a spinner.
- **Error feedback**: Display clear, inline error messages close to the source.
- **Destructive actions**: Always require confirmation or provide an undo option.
- **Touch optimization**: Use `touch-action: manipulation` to prevent double-tap zoom delays.
- **Modal scrolling**: Use `overscroll-behavior: contain` in modals and drawers.

### 1.4 Responsive Design

- Include `<meta name="viewport" content="width=device-width, initial-scale=1">` in the HTML head.
- Use a minimum of 16px for body text on mobile.
- Content must never overflow the viewport width (no horizontal scroll).
- Test at breakpoints: 375px, 768px, 1024px, and 1440px.
- Use a defined `z-index` scale to manage stacking contexts.
- Never disable zoom (`user-scalable=no` or `maximum-scale=1`).

### 1.5 Typography & Color

- **Line height**: 1.5–1.75 for body text.
- **Line length**: 65–75 characters maximum per line.
- **Headings**: Use `text-wrap: balance` or `text-pretty` to prevent widows.
- **Long content**: Use `truncate`, `line-clamp-*`, or `break-words` for overflow.
- **Empty states**: Always design for empty data — never render broken UI for empty strings or arrays.
- **Dark mode**: Set `color-scheme: dark` on `<html>` for dark themes. Match `<meta name="theme-color">` to the page background.

### 1.6 Animation & Motion

- **Duration**: 150–300ms for micro-interactions.
- **Properties**: Animate only `transform` and `opacity` for compositor-friendly performance. Never use `transition: all`.
- **User preferences**: Respect `prefers-reduced-motion` by providing reduced or disabled animation variants.
- **Interruptibility**: Animations must be interruptible and responsive to user input mid-animation.
- **Loading states**: Use skeleton screens or spinners to indicate loading.
- **Purpose**: Motion should be high-impact and purposeful, not decorative filler.

### 1.7 Images & Performance

- Provide explicit `width` and `height` for all `<img>` tags to prevent Cumulative Layout Shift.
- Use `loading="lazy"` for below-the-fold images.
- Use `fetchpriority="high"` for critical above-the-fold images.
- Prefer modern formats (WebP) and use `srcset` for responsive images.
- Virtualize large lists (50+ items) to improve rendering performance.
- Batch DOM reads and writes — avoid layout reads (`getBoundingClientRect`, `offsetHeight`) in the render path.

### 1.8 Forms

- Inputs should have the `autocomplete` attribute and a meaningful `name`.
- Use correct `type` and `inputmode` for each input.
- Never block paste functionality.
- Labels must be clickable.
- Disable spellcheck for emails and usernames.
- Display errors inline next to the corresponding field and focus on the first error on submit.

### 1.9 Navigation & State

- The URL should reflect application state (filters, tabs, pagination).
- Use `<button>` for actions and `<a>` for navigation — never `<div>` with click handlers.
- All interactive elements must have `cursor: pointer`.

---

## 2. Code Quality & Best Practices

This section draws from **Clean Code** principles and **Code Review** standards.

### 2.1 Naming Conventions

- **Use intention-revealing names**: `elapsedTimeInDays` instead of `d`.
- **Avoid disinformation**: Do not use `accountList` if it is actually a `Map`.
- **Make meaningful distinctions**: Avoid `ProductData` vs `ProductInfo`.
- **Use pronounceable, searchable names**: Avoid abbreviations like `genymdhms`.
- **Class names**: Use nouns (`Customer`, `ResumeProfile`). Avoid vague words like `Manager` or `Data`.
- **Function/method names**: Use verbs (`exportToPdf`, `duplicateExperience`).

### 2.2 Functions

- **Small**: Functions should be shorter than you think. If a function exceeds 20 lines, consider splitting it.
- **Do one thing**: A function should perform a single responsibility and do it well.
- **One level of abstraction**: Do not mix high-level business logic with low-level implementation details.
- **Descriptive names**: `isPasswordValid` is better than `check`.
- **Arguments**: 0 is ideal, 1–2 is acceptable, 3+ requires strong justification. Use an options object for complex parameters.
- **No side effects**: Functions should not secretly modify global state.

### 2.3 Comments

- **Don't comment bad code — rewrite it.** Most comments indicate a failure to express intent in code.
- **Explain yourself in code**: Create a well-named function instead of adding a comment.
- **Good comments**: Legal headers, informative (regex intent), clarification (external libraries), TODOs with ticket references.
- **Bad comments**: Mumbling, redundant, misleading, mandated, noise, position markers.

### 2.4 Error Handling

- **Use exceptions instead of return codes** to keep logic clean.
- **Write try-catch-finally first** to define the scope of the operation.
- **Don't return null**: It forces the caller to check for null every time. Use empty arrays, default objects, or Optional patterns.
- **Don't pass null**: Leads to runtime exceptions.

### 2.5 Code Structure

- **The Newspaper Metaphor**: High-level concepts at the top of the file, details at the bottom.
- **Vertical density**: Related lines should be close to each other.
- **Variable proximity**: Declare variables near their usage.
- **Single Responsibility Principle**: Classes and modules should have one reason to change.
- **Law of Demeter**: A module should not know about the internals of the objects it manipulates. Avoid `a.getB().getC().doSomething()`.
- **Code should read like a top-down narrative**: Each function should lead naturally to the next level of detail.

### 2.6 Code Review Standards

- **Priority order**: Security vulnerabilities first, then bugs, then code quality. Ignore purely stylistic issues.
- **Structured feedback**: Organize review comments by severity (Critical, High, Medium, Low).
- **Actionable suggestions**: Provide specific code examples and alternatives, not vague criticism.
- **Testability and maintainability**: Emphasize these in every review.
- **Automation**: Use linters, type checkers, and formatters before manual review.

### 2.7 React-Specific Guidelines

- Never call `setState` or navigation in the render phase — wrap in `useEffect`.
- Stabilize references with `useState` or `useMemo` to avoid infinite re-render loops.
- Use functional components and composable styles.
- Prefer CSS-first animations, resorting to Framer Motion only when justified.
- Extract shared UI into `components/` for reuse instead of copy-paste.

---

## 3. Security

This section draws from **API Security Best Practices** and **Bug Finding** methodologies.

### 3.1 General Principles

Since ResumeForge is currently a client-side-only application, the attack surface is limited. However, these principles apply if the project is upgraded to full-stack, and some apply to client-side code as well.

- **Never trust user input**: Validate and sanitize all inputs, even on the client side.
- **Use HTTPS everywhere**: All external requests must use encrypted connections.
- **Keep dependencies updated**: Regularly scan for and update vulnerable packages. Run `pnpm audit` periodically.
- **Never hardcode secrets**: Use environment variables or a secrets management service.
- **Secure error handling**: Do not expose stack traces or internal details in user-facing error messages.

### 3.2 Client-Side Security

| Concern | Guideline |
|---|---|
| XSS prevention | Never use `dangerouslySetInnerHTML` with unsanitized user input. Sanitize any HTML content before rendering. |
| localStorage | Do not store sensitive data (passwords, tokens) in localStorage. Resume data is acceptable. |
| External links | Use `rel="noopener noreferrer"` on all external links opened with `target="_blank"`. |
| Content Security Policy | When deploying, configure CSP headers to restrict script sources. |
| Third-party scripts | Audit any third-party scripts before inclusion. Prefer self-hosted alternatives. |

### 3.3 If Upgraded to Full-Stack

These rules become critical if the project adds a backend:

- **Authentication**: Use JWT or OAuth 2.0 with short-lived access tokens (15–60 minutes) and a secure refresh token mechanism.
- **Authorization**: Implement Role-Based Access Control (RBAC) and check permissions on every request.
- **Input validation**: Validate all server-side inputs against strict schemas (types, formats, lengths, ranges).
- **SQL injection**: Use parameterized queries or a trusted ORM. Never concatenate user input into queries.
- **Rate limiting**: Implement per-user/per-IP rate limiting on authentication and sensitive endpoints.
- **Password storage**: Hash with bcrypt using a unique salt per user. Never store plaintext passwords.
- **Error responses**: Return generic errors to clients. Log detailed errors server-side only.
- **Security headers**: Use Helmet.js or equivalent to set headers against clickjacking, XSS, and MIME sniffing.
- **JWT payloads**: Do not store sensitive information in JWT payloads — they are encoded, not encrypted.
- **Logging**: Log authentication successes/failures, authorization denials, and security-sensitive events.
- **Audits**: Conduct regular security audits against the OWASP API Security Top 10.

### 3.4 Bug Finding Methodology

When reviewing code changes for security issues, follow this structured process:

1. **Gather the complete diff** of the branch against the default branch.
2. **Map the attack surface** for each changed file: user inputs, database queries, auth checks, session operations, external calls, cryptographic operations.
3. **Apply the security checklist**: injection, XSS, auth/authz, CSRF, race conditions, session management, insecure crypto, information disclosure, DoS, business logic errors.
4. **Verify before reporting**: Check if the issue is handled elsewhere, search for existing tests, read surrounding code.
5. **Pre-conclusion audit**: List every reviewed file, confirm completeness, document checklist results, note unverifiable areas.
6. **Report format**: File/line, severity (Critical/High/Medium/Low), description, evidence, fix suggestion, OWASP reference.

---

## 4. Testing

This section draws from **E2E Testing Patterns** using Playwright and Cypress.

### 4.1 Testing Philosophy

- **Focus on critical user journeys**: Prioritize testing workflows essential to the application — resume creation, template switching, PDF export, data persistence.
- **Stability over coverage**: A small suite of reliable tests is more valuable than a large suite of flaky tests.
- **CI/CD integration**: Automate test execution in the deployment pipeline.
- **Safety first**: Isolate test environments and data. Never run destructive tests against production.

### 4.2 Critical User Journeys to Test

| Journey | Steps | Success Criteria |
|---|---|---|
| Resume creation | Fill personal info → Add experience → Add education → Preview | All sections render in preview |
| Template switching | Select template → Verify preview updates | Preview shows correct template layout |
| PDF export | Fill data → Click Export PDF → Verify download | PDF file downloads with correct content |
| DOCX export | Fill data → Click Export DOCX → Verify download | DOCX file downloads with correct content |
| Data persistence | Fill data → Refresh page → Verify data loads | All fields retain their values |
| ATS score | Fill data → Check ATS score → Verify scoring | Score updates in real-time |
| Drag-and-drop | Add multiple entries → Reorder → Verify order | Preview reflects new order |
| Dark mode | Toggle theme → Verify all sections | No invisible text or broken layouts |

### 4.3 Implementation Guidelines

- **Stable selectors**: Use `data-testid` attributes instead of CSS classes or element structure.
- **Test data strategy**: Use consistent, predictable test data. Create factory functions for generating resume data.
- **Automatic retries**: Implement retries for transient failures (network, rendering delays).
- **Artifacts on failure**: Capture screenshots, videos, and logs when tests fail.
- **Test isolation**: Each test should be independent and able to run in any order.
- **Parallel execution**: Run tests in parallel to reduce total execution time.
- **Cross-browser**: Test across Chrome, Firefox, and Safari.
- **Responsive**: Validate layouts at 375px, 768px, 1024px, and 1440px.
- **Accessibility**: Include accessibility checks (color contrast, focus order, ARIA) in E2E tests.

### 4.4 Test Organization

```
tests/
  e2e/
    resume-creation.spec.ts
    template-switching.spec.ts
    pdf-export.spec.ts
    data-persistence.spec.ts
    ats-scoring.spec.ts
    drag-and-drop.spec.ts
    dark-mode.spec.ts
    responsive.spec.ts
  fixtures/
    sample-resume.json
    empty-resume.json
  helpers/
    resume-factory.ts
    selectors.ts
```

### 4.5 Anti-Patterns

- Do not test implementation details — test user-visible behavior.
- Do not use `sleep()` or fixed timeouts — use proper wait conditions.
- Do not share state between tests.
- Do not test third-party library internals.
- Do not ignore flaky tests — fix the root cause immediately.

---

## Quick Reference

| Category | Key Rule |
|---|---|
| **Accessibility** | 4.5:1 contrast, visible focus, ARIA labels on icon buttons |
| **Touch** | 44x44px minimum targets, disable buttons during async |
| **Typography** | 16px minimum body, 1.5–1.75 line height, 65–75 char lines |
| **Animation** | 150–300ms, transform/opacity only, respect reduced-motion |
| **Naming** | Intention-revealing, verbs for functions, nouns for classes |
| **Functions** | Small, single responsibility, 0–2 arguments |
| **Security** | Validate inputs, no hardcoded secrets, sanitize HTML |
| **Testing** | Critical journeys first, stable selectors, parallel execution |

---

*This document was generated by the dev-orchestrator skill. Last updated: February 11, 2026.*

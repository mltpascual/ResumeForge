# C4 Architecture Documentation — ResumeForge

This directory contains the complete C4 architecture documentation for ResumeForge, following the [C4 model](https://c4model.com/) by Simon Brown.

## Documentation Levels

| Level | File | Audience | Description |
|-------|------|----------|-------------|
| **1. Context** | [c4-context.md](./c4-context.md) | Everyone | System boundaries, personas, external dependencies |
| **2. Container** | [c4-container.md](./c4-container.md) | Technical leads | Technology stack, deployment, storage architecture |
| **3. Component** | [c4-component.md](./c4-component.md) | Developers | All components, their responsibilities, and relationships |

## Quick Navigation

- **"What does this system do?"** → Start with [Context](./c4-context.md)
- **"What technologies are used?"** → See [Container](./c4-container.md)
- **"How is the code organized?"** → Dive into [Component](./c4-component.md)

## Architecture Summary

ResumeForge is a **fully client-side** React single-page application. There is no backend server — all processing (template rendering, ATS analysis, document export) happens in the user's browser. Data is persisted in browser localStorage. The only external dependency is Google Fonts CDN for typography.

```
User → Browser → React SPA → localStorage
                     ↓
              Google Fonts CDN
```

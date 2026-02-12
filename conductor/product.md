# Product Context — ResumeForge

## One-Line Description

A browser-based resume builder that helps job seekers create ATS-optimized, professionally designed resumes with real-time preview and intelligent analysis tools.

## Problem Statement

Job seekers face two recurring frustrations when building resumes. First, most free resume builders produce generic, visually uninspired documents that fail to stand out. Second, applicant tracking systems (ATS) silently reject resumes with formatting issues, leaving candidates unaware of why they never hear back. ResumeForge addresses both problems by combining a polished, template-driven editor with built-in ATS analysis, job description matching, and cover letter generation — all running entirely in the browser with zero backend dependencies.

## Target Users

| Persona | Description | Primary Need |
|---|---|---|
| **Recent Graduate** | First-time job seeker with limited experience | Guidance on content structure, section tips, and professional formatting |
| **Career Switcher** | Mid-career professional targeting a new industry | Multiple resume profiles, keyword matching against job descriptions |
| **Experienced Professional** | Senior-level candidate with extensive history | Template variety, drag-and-drop reordering, DOCX/PDF export |
| **Non-Technical User** | Anyone uncomfortable with design tools | Simple, intuitive editor with real-time preview and auto-save |

## Core Features

| Feature | Status | Description |
|---|---|---|
| Real-time editor with live preview | Implemented | Split-pane editor with instant resume rendering |
| 10 professional templates | Implemented | Classic, Modern, Executive, Compact, Minimal, Two Column, Creative, Developer, Academic, Elegance |
| ATS score checker | Implemented | 19-rule weighted analysis across 4 categories |
| ATS simulator | Implemented | Simulates parsing by Workday, Greenhouse, Lever, Taleo, iCIMS |
| Job description matcher | Implemented | Keyword extraction and gap analysis against job postings |
| Cover letter generator | Implemented | Template-based generation from resume data and job description |
| Drag-and-drop reordering | Implemented | Reorder entries within Experience, Education, Projects, Certifications |
| Multiple resume profiles | Implemented | Save/switch between different resume versions in localStorage |
| LinkedIn PDF import | Implemented | Parse uploaded LinkedIn PDF to auto-fill resume fields |
| DOCX export | Implemented | Export resume as Word document |
| PDF export | Implemented | Export resume as PDF via browser print |
| Keyboard shortcuts | Implemented | Full shortcut system with "?" overlay |
| Onboarding tour | Implemented | First-time user walkthrough with step-by-step tooltips |
| Section writing tips | Implemented | Contextual advice per form section |
| Word count & reading time | Implemented | Real-time per-section word counts |
| Resume completeness score | Implemented | 10-field progress indicator |
| Dark/light theme | Implemented | System-aware theme toggle |
| Industry color presets | Implemented | Finance, Tech, Creative, Healthcare, Legal, Education palettes |
| Custom accent colors | Implemented | Color picker with hex input |
| Recruiter preview mode | Implemented | Full-width read-only view simulating recruiter perspective |
| Auto-save to localStorage | Implemented | Automatic persistence with timestamp indicator |
| Smooth scroll navigation | Implemented | Section-linked nav bar on homepage |
| FAQ section | Implemented | 8-item accordion on homepage |
| Mobile hamburger menu | Implemented | Slide-out drawer for mobile navigation |

## Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Time to first resume | Under 10 minutes | From landing page to first PDF export |
| ATS pass rate | 85%+ on all templates | ATS score checker returns 85+ for complete resumes |
| Template usage distribution | No single template > 40% | Analytics on template selection |
| Return visits | 30%+ users return within 7 days | localStorage profile count > 1 |

## Product Roadmap

| Phase | Features | Status |
|---|---|---|
| Phase 1: Core Editor | Editor, templates, export, auto-save | Complete |
| Phase 2: Intelligence | ATS checker, job matcher, cover letter, section tips | Complete |
| Phase 3: Power Tools | Drag-and-drop, profiles, LinkedIn import, DOCX export | Complete |
| Phase 4: Polish | Onboarding, keyboard shortcuts, word count, FAQ, mobile menu | Complete |
| Phase 5: Future | AI-powered rewriting (requires backend), multi-page support, undo/redo | Planned |

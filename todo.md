# Resume Maker Refactor TODO

## shadcn/ui Migration & Larger UI
- [ ] Refactor index.css — increase base sizing, proper dark mode CSS variables
- [ ] Update index.html — add JetBrains Mono font
- [ ] Refactor App.tsx — add switchable dark mode ThemeProvider
- [ ] Refactor Home.tsx — use shadcn Button, Card; increase text sizes
- [ ] Refactor Editor.tsx — use shadcn Tabs, Button, ScrollArea; increase sizing
- [ ] Refactor PersonalInfoForm — use shadcn Input, Label, Textarea
- [ ] Refactor ExperienceForm — use shadcn Input, Label, Textarea, Button, Checkbox
- [ ] Refactor EducationForm — use shadcn Input, Label, Textarea, Button
- [ ] Refactor SkillsForm — use shadcn Input, Label, Select, Button
- [ ] Refactor ProjectsForm — use shadcn Input, Label, Textarea, Button
- [ ] Refactor CertificationsForm — use shadcn Input, Label, Button

## New Features
- [ ] Auto-save with local storage (persist resume data)
- [ ] Dark mode toggle (single-click theme switch)
- [ ] Drag-and-drop section reordering in resume preview

## Testing
- [ ] Verify all forms work with shadcn components
- [ ] Verify dark mode toggle works
- [ ] Verify auto-save persists and loads data
- [ ] Verify drag-and-drop reordering
- [ ] Verify PDF export still works
- [ ] Verify all three templates render correctly

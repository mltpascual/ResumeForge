import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type ResumeData, type TemplateId, type FontPairing, FONT_PAIRINGS, defaultResumeData, sampleResumeData } from '@/types/resume';

const STORAGE_KEY = 'resumeforge_data';
const TEMPLATE_KEY = 'resumeforge_template';
const SECTIONS_KEY = 'resumeforge_sections';
const ACCENT_KEY = 'resumeforge_accent';
const FONT_KEY = 'resumeforge_font';
const FONTSIZE_KEY = 'resumeforge_fontsize';
const LINESPACING_KEY = 'resumeforge_linespacing';
const MARGIN_KEY = 'resumeforge_margin';

export type SectionId = 'experiences' | 'education' | 'skills' | 'projects' | 'certifications';

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'experiences',
  'education',
  'skills',
  'projects',
  'certifications',
];

export const SECTION_LABELS: Record<SectionId, string> = {
  experiences: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  updatePersonalInfo: (field: string, value: string) => void;
  addExperience: () => void;
  duplicateExperience: (id: string) => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (oldIndex: number, newIndex: number) => void;
  addEducation: () => void;
  duplicateEducation: (id: string) => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (oldIndex: number, newIndex: number) => void;
  updateSkills: (skills: string) => void;
  addProject: () => void;
  duplicateProject: (id: string) => void;
  updateProject: (id: string, field: string, value: string) => void;
  removeProject: (id: string) => void;
  reorderProjects: (oldIndex: number, newIndex: number) => void;
  addCertification: () => void;
  duplicateCertification: (id: string) => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (oldIndex: number, newIndex: number) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (id: TemplateId) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  sectionOrder: SectionId[];
  setSectionOrder: (order: SectionId[]) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  selectedFont: FontPairing;
  setSelectedFont: (fontId: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineSpacing: number;
  setLineSpacing: (spacing: number) => void;
  marginSize: number;
  setMarginSize: (size: number) => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

let idCounter = 100;
const generateId = () => String(++idCounter);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: if skills is an array of objects, convert to comma-separated string
      if (key === STORAGE_KEY && parsed.skills && Array.isArray(parsed.skills)) {
        parsed.skills = parsed.skills
          .map((s: { name?: string } | string) => (typeof s === 'string' ? s : s.name || ''))
          .filter((s: string) => s.trim())
          .join(', ');
      }
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return fallback;
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() =>
    loadFromStorage(STORAGE_KEY, defaultResumeData)
  );
  const [selectedTemplate, setSelectedTemplateState] = useState<TemplateId>(() =>
    loadFromStorage(TEMPLATE_KEY, 'classic' as TemplateId)
  );
  const [activeSection, setActiveSection] = useState('personal');
  const [sectionOrder, setSectionOrderState] = useState<SectionId[]>(() =>
    loadFromStorage(SECTIONS_KEY, DEFAULT_SECTION_ORDER)
  );
  const [accentColor, setAccentColorState] = useState<string>(() =>
    loadFromStorage(ACCENT_KEY, '#6750A4')
  );
  const [selectedFontId, setSelectedFontIdState] = useState<string>(() =>
    loadFromStorage(FONT_KEY, 'default')
  );

  const selectedFont = FONT_PAIRINGS.find(f => f.id === selectedFontId) || FONT_PAIRINGS[0];
  const [fontSize, setFontSizeState] = useState<number>(() =>
    loadFromStorage(FONTSIZE_KEY, 1)
  );
  const [lineSpacing, setLineSpacingState] = useState<number>(() =>
    loadFromStorage(LINESPACING_KEY, 1)
  );
  const [marginSize, setMarginSizeState] = useState<number>(() =>
    loadFromStorage(MARGIN_KEY, 1)
  );

  // Auto-save resume data
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    }, 300);
    return () => clearTimeout(timeout);
  }, [resumeData]);

  // Auto-save template
  const setSelectedTemplate = useCallback((id: TemplateId) => {
    setSelectedTemplateState(id);
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(id));
  }, []);

  // Auto-save section order
  const setSectionOrder = useCallback((order: SectionId[]) => {
    setSectionOrderState(order);
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(order));
  }, []);

  // Auto-save accent color
  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_KEY, JSON.stringify(color));
  }, []);

  // Auto-save font
  const setSelectedFont = useCallback((fontId: string) => {
    setSelectedFontIdState(fontId);
    localStorage.setItem(FONT_KEY, JSON.stringify(fontId));
  }, []);

  // Auto-save font size
  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    localStorage.setItem(FONTSIZE_KEY, JSON.stringify(size));
  }, []);

  // Auto-save line spacing
  const setLineSpacing = useCallback((spacing: number) => {
    setLineSpacingState(spacing);
    localStorage.setItem(LINESPACING_KEY, JSON.stringify(spacing));
  }, []);

  // Auto-save margin size
  const setMarginSize = useCallback((size: number) => {
    setMarginSizeState(size);
    localStorage.setItem(MARGIN_KEY, JSON.stringify(size));
  }, []);

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const addExperience = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        id: generateId(), company: '', position: '', location: '',
        startDate: '', endDate: '', current: false, description: '',
      }],
    }));
  }, []);

  const duplicateExperience = useCallback((id: string) => {
    setResumeData(prev => {
      const source = prev.experiences.find(exp => exp.id === id);
      if (!source) return prev;
      const idx = prev.experiences.findIndex(exp => exp.id === id);
      const clone = { ...source, id: generateId() };
      const updated = [...prev.experiences];
      updated.splice(idx + 1, 0, clone);
      return { ...prev, experiences: updated };
    });
  }, []);

  const updateExperience = useCallback((id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  }, []);

  const reorderExperiences = useCallback((oldIndex: number, newIndex: number) => {
    setResumeData(prev => {
      const updated = [...prev.experiences];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return { ...prev, experiences: updated };
    });
  }, []);

  const addEducation = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: generateId(), institution: '', degree: '', field: '',
        startDate: '', endDate: '', gpa: '', description: '',
      }],
    }));
  }, []);

  const duplicateEducation = useCallback((id: string) => {
    setResumeData(prev => {
      const source = prev.education.find(edu => edu.id === id);
      if (!source) return prev;
      const idx = prev.education.findIndex(edu => edu.id === id);
      const clone = { ...source, id: generateId() };
      const updated = [...prev.education];
      updated.splice(idx + 1, 0, clone);
      return { ...prev, education: updated };
    });
  }, []);

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  }, []);

  const reorderEducation = useCallback((oldIndex: number, newIndex: number) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return { ...prev, education: updated };
    });
  }, []);

  const updateSkills = useCallback((skills: string) => {
    setResumeData(prev => ({ ...prev, skills }));
  }, []);

  const addProject = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: generateId(), name: '', description: '', technologies: '', link: '',
      }],
    }));
  }, []);

  const duplicateProject = useCallback((id: string) => {
    setResumeData(prev => {
      const idx = prev.projects.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const original = prev.projects[idx];
      const copy = { ...original, id: generateId() };
      const updated = [...prev.projects];
      updated.splice(idx + 1, 0, copy);
      return { ...prev, projects: updated };
    });
  }, []);

  const updateProject = useCallback((id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id),
    }));
  }, []);

  const reorderProjects = useCallback((oldIndex: number, newIndex: number) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return { ...prev, projects: updated };
    });
  }, []);

  const addCertification = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: generateId(), name: '', issuer: '', date: '', link: '',
      }],
    }));
  }, []);

  const duplicateCertification = useCallback((id: string) => {
    setResumeData(prev => {
      const idx = prev.certifications.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const original = prev.certifications[idx];
      const copy = { ...original, id: generateId() };
      const updated = [...prev.certifications];
      updated.splice(idx + 1, 0, copy);
      return { ...prev, certifications: updated };
    });
  }, []);

  const updateCertification = useCallback((id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id),
    }));
  }, []);

  const reorderCertifications = useCallback((oldIndex: number, newIndex: number) => {
    setResumeData(prev => {
      const updated = [...prev.certifications];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return { ...prev, certifications: updated };
    });
  }, []);

  const loadSampleData = useCallback(() => {
    setResumeData(sampleResumeData);
  }, []);

  const clearAllData = useCallback(() => {
    setResumeData(defaultResumeData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Export resume data as JSON file
  const exportJSON = useCallback(() => {
    const exportData = {
      version: 3,
      resumeData,
      selectedTemplate,
      sectionOrder,
      accentColor,
      fontId: selectedFontId,
      fontSize,
      lineSpacing,
      marginSize,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.personalInfo.fullName?.replace(/\s+/g, '-').toLowerCase() || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [resumeData, selectedTemplate, sectionOrder, accentColor, selectedFontId, fontSize, lineSpacing, marginSize]);

  // Import resume data from JSON file
  const importJSON = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (parsed.resumeData) {
      if (Array.isArray(parsed.resumeData.skills)) {
        parsed.resumeData.skills = parsed.resumeData.skills
          .map((s: { name?: string } | string) => (typeof s === 'string' ? s : s.name || ''))
          .filter((s: string) => s.trim())
          .join(', ');
      }
      setResumeData(parsed.resumeData);
    }
    if (parsed.selectedTemplate) {
      setSelectedTemplateState(parsed.selectedTemplate);
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify(parsed.selectedTemplate));
    }
    if (parsed.sectionOrder) {
      setSectionOrderState(parsed.sectionOrder);
      localStorage.setItem(SECTIONS_KEY, JSON.stringify(parsed.sectionOrder));
    }
    if (parsed.accentColor) {
      setAccentColorState(parsed.accentColor);
      localStorage.setItem(ACCENT_KEY, JSON.stringify(parsed.accentColor));
    }
    if (parsed.fontId) {
      setSelectedFontIdState(parsed.fontId);
      localStorage.setItem(FONT_KEY, JSON.stringify(parsed.fontId));
    }
    if (parsed.fontSize != null) {
      setFontSizeState(parsed.fontSize);
      localStorage.setItem(FONTSIZE_KEY, JSON.stringify(parsed.fontSize));
    }
    if (parsed.lineSpacing != null) {
      setLineSpacingState(parsed.lineSpacing);
      localStorage.setItem(LINESPACING_KEY, JSON.stringify(parsed.lineSpacing));
    }
    if (parsed.marginSize != null) {
      setMarginSizeState(parsed.marginSize);
      localStorage.setItem(MARGIN_KEY, JSON.stringify(parsed.marginSize));
    }
  }, []);

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData,
      updatePersonalInfo,
      addExperience, duplicateExperience, updateExperience, removeExperience, reorderExperiences,
      addEducation, duplicateEducation, updateEducation, removeEducation, reorderEducation,
      updateSkills,
      addProject, duplicateProject, updateProject, removeProject, reorderProjects,
      addCertification, duplicateCertification, updateCertification, removeCertification, reorderCertifications,
      selectedTemplate, setSelectedTemplate,
      loadSampleData, clearAllData,
      activeSection, setActiveSection,
      sectionOrder, setSectionOrder,
      accentColor, setAccentColor,
      selectedFont, setSelectedFont,
      fontSize, setFontSize,
      lineSpacing, setLineSpacing,
      marginSize, setMarginSize,
      exportJSON, importJSON,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

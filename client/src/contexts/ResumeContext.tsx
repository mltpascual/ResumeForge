import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type ResumeData, type TemplateId, defaultResumeData, sampleResumeData } from '@/types/resume';

const STORAGE_KEY = 'resumeforge_data';
const TEMPLATE_KEY = 'resumeforge_template';
const SECTIONS_KEY = 'resumeforge_sections';
const ACCENT_KEY = 'resumeforge_accent';

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
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: string) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, field: string, value: string) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;
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
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

let idCounter = 100;
const generateId = () => String(++idCounter);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
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
    loadFromStorage(ACCENT_KEY, '#18181B')
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

  const addEducation = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: generateId(), institution: '', degree: '', field: '',
        startDate: '', endDate: '', gpa: '', description: '',
      }],
    }));
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

  const addSkill = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        id: generateId(), name: '',
      }],
    }));
  }, []);

  const updateSkill = useCallback((id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  }, []);

  const addProject = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: generateId(), name: '', description: '', technologies: '', link: '',
      }],
    }));
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

  const addCertification = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: generateId(), name: '', issuer: '', date: '', link: '',
      }],
    }));
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
      version: 1,
      resumeData,
      selectedTemplate,
      sectionOrder,
      accentColor,
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
  }, [resumeData, selectedTemplate, sectionOrder, accentColor]);

  // Import resume data from JSON file
  const importJSON = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (parsed.resumeData) {
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
  }, []);

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData,
      updatePersonalInfo,
      addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation,
      addSkill, updateSkill, removeSkill,
      addProject, updateProject, removeProject,
      addCertification, updateCertification, removeCertification,
      selectedTemplate, setSelectedTemplate,
      loadSampleData, clearAllData,
      activeSection, setActiveSection,
      sectionOrder, setSectionOrder,
      accentColor, setAccentColor,
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

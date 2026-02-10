/*
 * DESIGN: "Ink & Paper" — Editor Page
 * Asymmetric two-column layout: form editor left, live preview right.
 * Vertical tab rail for section navigation. Warm cream surfaces.
 * Mobile: tabs at bottom, toggle between form and preview.
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import ResumePreview from '@/components/preview/ResumePreview';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import { type TemplateId } from '@/types/resume';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Zap,
  FolderOpen,
  Award,
  Download,
  ChevronLeft,
  Layout,
  Sparkles,
  Trash2,
  ZoomIn,
  ZoomOut,
  Eye,
  PenLine,
} from 'lucide-react';

const sections = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

const templateOptions: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'classic', name: 'Classic', desc: 'Centered header, serif elegance' },
  { id: 'modern', name: 'Modern', desc: 'Sidebar layout, contemporary' },
  { id: 'executive', name: 'Executive', desc: 'Navy header, authoritative' },
];

export default function Editor() {
  const { activeSection, setActiveSection, selectedTemplate, setSelectedTemplate, loadSampleData, clearAllData } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [showTemplates, setShowTemplates] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  // Calculate preview scale based on container width
  const updateScale = useCallback(() => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth;
      const resumeWidth = 794;
      const padding = 48;
      const scale = Math.min((containerWidth - padding) / resumeWidth, 0.75);
      setPreviewScale(Math.max(scale, 0.3));
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Update scale when mobile view changes to preview
  useEffect(() => {
    if (mobileView === 'preview') {
      setTimeout(updateScale, 100);
    }
  }, [mobileView, updateScale]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    const el = document.getElementById('resume-preview');
    if (!el || isExporting) return;

    setIsExporting(true);
    toast.info('Generating PDF...', { duration: 3000 });

    try {
      const { jsPDF } = await import('jspdf');

      // Use an iframe to render the resume without oklch CSS variables
      // The resume preview uses inline styles so it doesn't depend on Tailwind
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-10000px';
      iframe.style.top = '0';
      iframe.style.width = '794px';
      iframe.style.height = '1123px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument!;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" />
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { background: white; font-family: 'Source Sans 3', sans-serif; }
              .flex { display: flex; }
              .gap-1 { gap: 4px; }
            </style>
          </head>
          <body>${el.outerHTML}</body>
        </html>
      `);
      iframeDoc.close();

      // Wait for fonts to load in the iframe
      await new Promise(resolve => setTimeout(resolve, 1500));

      const html2canvas = (await import('html2canvas')).default;
      const target = iframeDoc.body.firstElementChild as HTMLElement;

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });

      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdfWidth = 210;
      const pdfHeight = 297;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (imgHeight > pdfHeight) {
        const ratio = pdfHeight / imgHeight;
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * ratio + (pdfWidth - imgWidth * ratio) / 2, pdfHeight);
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save('resume.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const renderForm = () => {
    switch (activeSection) {
      case 'personal': return <PersonalInfoForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return <CertificationsForm />;
      default: return <PersonalInfoForm />;
    }
  };

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="h-screen flex flex-col bg-background" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-3 md:px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1 px-2">
              <ChevronLeft className="w-4 h-4" />
              <FileText className="w-4 h-4 text-terracotta hidden sm:block" />
              <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>ResumeForge</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              loadSampleData();
              toast.success('Sample data loaded!');
            }}
            className="text-muted-foreground hover:text-foreground gap-1 text-xs px-2 md:px-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Sample</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAllData();
              toast.info('All data cleared');
            }}
            className="text-muted-foreground hover:text-destructive gap-1 text-xs px-2 md:px-3"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
          <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-muted-foreground hover:text-foreground gap-1 text-xs px-2 md:px-3"
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Template: {templateOptions.find(t => t.id === selectedTemplate)?.name}</span>
            <span className="md:hidden">{templateOptions.find(t => t.id === selectedTemplate)?.name}</span>
          </Button>
          <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />
          <Button
            size="sm"
            onClick={handleExportPDF}
            className="bg-terracotta hover:bg-terracotta-dark text-white border-0 gap-1 px-3"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </header>

      {/* Template Selector Dropdown */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-card overflow-hidden"
          >
            <div className="p-3 md:p-4 flex gap-3 md:gap-4 justify-center flex-wrap">
              {templateOptions.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setShowTemplates(false);
                  }}
                  className={`px-4 md:px-5 py-2.5 md:py-3 rounded-md border-2 transition-all duration-200 text-left ${
                    selectedTemplate === tmpl.id
                      ? 'border-terracotta bg-terracotta/5'
                      : 'border-border hover:border-terracotta/40 bg-white/50'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{tmpl.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tmpl.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile View Toggle */}
      <div className="lg:hidden flex border-b border-border bg-card shrink-0">
        <button
          onClick={() => setMobileView('form')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mobileView === 'form' ? 'text-terracotta border-b-2 border-terracotta' : 'text-muted-foreground'
          }`}
        >
          <PenLine className="w-4 h-4" />
          Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mobileView === 'preview' ? 'text-terracotta border-b-2 border-terracotta' : 'text-muted-foreground'
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section Navigation Rail - Desktop only */}
        <div className="w-16 border-r border-border bg-card hidden lg:flex flex-col items-center py-4 gap-1 shrink-0">
          {sections.map(section => (
            <Tooltip key={section.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <section.icon className="w-[18px] h-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {section.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Form Panel */}
        <div className={`lg:w-[420px] border-r border-border bg-[oklch(0.98_0.006_80)] flex flex-col shrink-0 ${
          mobileView === 'form' ? 'flex w-full lg:w-[420px]' : 'hidden lg:flex'
        }`}>
          {/* Section tabs - Mobile horizontal scroll */}
          <div className="lg:hidden overflow-x-auto border-b border-border">
            <div className="flex px-3 py-2 gap-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <section.icon className="w-3.5 h-3.5" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <currentSection.icon className="w-4 h-4 text-terracotta" />
              <h2 className="text-lg text-foreground" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                {currentSection.label}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
              {activeSection === 'personal' && 'Your contact information and professional summary'}
              {activeSection === 'experience' && 'Your work history and professional achievements'}
              {activeSection === 'education' && 'Your academic background and qualifications'}
              {activeSection === 'skills' && 'Your technical and professional competencies'}
              {activeSection === 'projects' && 'Notable projects and contributions'}
              {activeSection === 'certifications' && 'Professional certifications and credentials'}
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderForm()}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Preview Panel */}
        <div
          className={`flex-1 bg-[oklch(0.92_0.01_75)] flex flex-col overflow-hidden ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
          ref={previewContainerRef}
        >
          {/* Preview Controls */}
          <div className="h-10 flex items-center justify-between px-4 bg-[oklch(0.92_0.01_75)] border-b border-border/50 shrink-0">
            <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
              Live Preview
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewScale(s => Math.max(s - 0.1, 0.3))}
                className="h-7 w-7 p-0 text-muted-foreground"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewScale(s => Math.min(s + 0.1, 1))}
                className="h-7 w-7 p-0 text-muted-foreground"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 flex justify-center">
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
                <ResumePreview ref={previewRef} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

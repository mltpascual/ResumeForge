/*
 * DESIGN: "Black Tie Elegance" — Editor Page
 * Dark surfaces, gold accents, glass panels.
 * Asymmetric two-column: form editor left, live preview right.
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
  Diamond,
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
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { background: white; font-family: 'Source Sans 3', 'Inter', sans-serif; }
              .flex { display: flex; }
              .gap-1 { gap: 4px; }
            </style>
          </head>
          <body>${el.outerHTML}</body>
        </html>
      `);
      iframeDoc.close();

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
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-gold gap-1 px-2 transition-colors duration-300">
              <ChevronLeft className="w-4 h-4" />
              <Diamond className="w-4 h-4 text-gold hidden sm:block" />
              <span className="hidden sm:inline text-warm-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '14px', letterSpacing: '0.03em' }}>ResumeForge</span>
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
            className="text-muted-foreground hover:text-gold gap-1 text-xs px-2 md:px-3 transition-colors duration-300"
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
            className="text-muted-foreground hover:text-destructive gap-1 text-xs px-2 md:px-3 transition-colors duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
          <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-muted-foreground hover:text-gold gap-1 text-xs px-2 md:px-3 transition-colors duration-300"
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Template: {templateOptions.find(t => t.id === selectedTemplate)?.name}</span>
            <span className="md:hidden">{templateOptions.find(t => t.id === selectedTemplate)?.name}</span>
          </Button>
          <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />
          <Button
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-gold border-0 gap-1 px-3 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
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
            transition={{ duration: 0.25 }}
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
                  className={`px-4 md:px-5 py-2.5 md:py-3 rounded-md border transition-all duration-300 text-left ${
                    selectedTemplate === tmpl.id
                      ? 'border-gold/50 bg-gold-muted'
                      : 'border-border hover:border-gold/30 bg-secondary/30'
                  }`}
                >
                  <p className="text-sm font-medium text-warm-white" style={{ fontFamily: 'var(--font-display)' }}>{tmpl.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5" style={{ fontWeight: 300 }}>{tmpl.desc}</p>
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
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${
            mobileView === 'form' ? 'text-gold border-b-2 border-gold' : 'text-muted-foreground'
          }`}
        >
          <PenLine className="w-4 h-4" />
          Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${
            mobileView === 'preview' ? 'text-gold border-b-2 border-gold' : 'text-muted-foreground'
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section Navigation Rail - Desktop only */}
        <div className="w-16 border-r border-border bg-[oklch(0.14_0.005_285)] hidden lg:flex flex-col items-center py-4 gap-1 shrink-0">
          {sections.map(section => (
            <Tooltip key={section.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gold-muted text-gold border border-gold/20'
                      : 'text-muted-foreground hover:text-gold hover:bg-gold-muted/50'
                  }`}
                >
                  <section.icon className="w-[18px] h-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-card border-border">
                {section.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Form Panel */}
        <div className={`lg:w-[420px] border-r border-border bg-[oklch(0.15_0.005_285)] flex flex-col shrink-0 ${
          mobileView === 'form' ? 'flex w-full lg:w-[420px]' : 'hidden lg:flex'
        }`}>
          {/* Section tabs - Mobile horizontal scroll */}
          <div className="lg:hidden overflow-x-auto border-b border-border">
            <div className="flex px-3 py-2 gap-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    activeSection === section.id
                      ? 'bg-gold-muted text-gold'
                      : 'text-muted-foreground hover:text-gold hover:bg-gold-muted/50'
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
              <currentSection.icon className="w-4 h-4 text-gold" />
              <h2 className="text-lg text-warm-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                {currentSection.label}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 300 }}>
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
                  transition={{ duration: 0.25 }}
                >
                  {renderForm()}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Preview Panel */}
        <div
          className={`flex-1 bg-[oklch(0.11_0.005_285)] flex flex-col overflow-hidden ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
          ref={previewContainerRef}
        >
          {/* Preview Controls */}
          <div className="h-10 flex items-center justify-between px-4 bg-[oklch(0.11_0.005_285)] border-b border-border/50 shrink-0">
            <span className="text-xs text-gold/60 tracking-wide" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}>
              Live Preview
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewScale(s => Math.max(s - 0.1, 0.3))}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-gold transition-colors duration-300"
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
                className="h-7 w-7 p-0 text-muted-foreground hover:text-gold transition-colors duration-300"
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

/*
 * DESIGN: Minimalist / Severe — Editor Page
 * Pure white background, black text, hairline borders
 * HORIZONTAL TABS across the top for section navigation
 * Form below tabs on the left, preview on the right
 * No shadows, no rounded corners, no color
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Layout,
  Sparkles,
  Trash2,
  Eye,
  PenLine,
} from 'lucide-react';

const sections = [
  { id: 'personal', label: 'Personal' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
];

const templateOptions: { id: TemplateId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'executive', name: 'Executive' },
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
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Archivo:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { background: white; font-family: 'Archivo', sans-serif; }
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

  return (
    <div className="h-screen flex flex-col bg-white text-[#09090B]" style={{ fontFamily: "'Archivo', sans-serif" }}>
      {/* Top Bar */}
      <header className="h-12 border-b border-[#E4E4E7] flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="flex items-center gap-2 text-[#71717A] hover:text-[#09090B] transition-opacity duration-200">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-display text-sm font-bold tracking-tight hidden sm:inline">ResumeForge</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              loadSampleData();
              toast.success('Sample data loaded');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#71717A] hover:text-[#09090B] transition-opacity duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono-accent text-[10px] tracking-wider uppercase">Sample</span>
          </button>
          <button
            onClick={() => {
              clearAllData();
              toast.info('Data cleared');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#71717A] hover:text-[#DC2626] transition-opacity duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono-accent text-[10px] tracking-wider uppercase">Clear</span>
          </button>
          <div className="w-px h-5 bg-[#E4E4E7] mx-1 hidden sm:block" />
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#71717A] hover:text-[#09090B] transition-opacity duration-200"
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="font-mono-accent text-[10px] tracking-wider uppercase">
              {templateOptions.find(t => t.id === selectedTemplate)?.name}
            </span>
          </button>
          <div className="w-px h-5 bg-[#E4E4E7] mx-1 hidden sm:block" />
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-[#09090B] text-white px-4 py-1.5 text-xs hover:opacity-70 transition-opacity duration-200 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-mono-accent text-[10px] tracking-wider uppercase">
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </span>
          </button>
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
            className="border-b border-[#E4E4E7] overflow-hidden"
          >
            <div className="px-6 py-3 flex gap-0">
              {templateOptions.map((tmpl, i) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setShowTemplates(false);
                  }}
                  className={`px-5 py-2 text-xs transition-opacity duration-200 border-b-2 ${
                    selectedTemplate === tmpl.id
                      ? 'border-[#09090B] text-[#09090B] font-medium'
                      : 'border-transparent text-[#71717A] hover:text-[#09090B]'
                  }`}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HORIZONTAL SECTION TABS */}
      <div className="border-b border-[#E4E4E7] shrink-0 overflow-x-auto">
        <div className="flex px-4 md:px-6">
          {sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`relative px-4 md:px-5 py-3 text-xs transition-colors duration-200 whitespace-nowrap ${
                activeSection === section.id
                  ? 'text-[#09090B]'
                  : 'text-[#A1A1AA] hover:text-[#71717A]'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              <span className="mr-2 text-[#D4D4D8]">{String(i + 1).padStart(2, '0')}</span>
              {section.label}
              {activeSection === section.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#09090B]"
                  layoutId="activeTab"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div className="lg:hidden flex border-b border-[#E4E4E7] shrink-0">
        <button
          onClick={() => setMobileView('form')}
          className={`flex-1 py-2 text-xs flex items-center justify-center gap-2 transition-colors duration-200 ${
            mobileView === 'form' ? 'text-[#09090B] border-b border-[#09090B]' : 'text-[#A1A1AA]'
          }`}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          <PenLine className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-xs flex items-center justify-center gap-2 transition-colors duration-200 ${
            mobileView === 'preview' ? 'text-[#09090B] border-b border-[#09090B]' : 'text-[#A1A1AA]'
          }`}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div className={`lg:w-[480px] border-r border-[#E4E4E7] flex flex-col shrink-0 ${
          mobileView === 'form' ? 'flex w-full lg:w-[480px]' : 'hidden lg:flex'
        }`}>
          <ScrollArea className="flex-1">
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderForm()}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Preview Panel */}
        <div
          className={`flex-1 bg-[#FAFAFA] flex flex-col overflow-hidden ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
          ref={previewContainerRef}
        >
          {/* Preview Controls */}
          <div className="h-9 flex items-center justify-between px-4 border-b border-[#E4E4E7] shrink-0">
            <span className="text-label text-[#A1A1AA]">Preview</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewScale(s => Math.max(s - 0.1, 0.3))}
                className="w-7 h-7 flex items-center justify-center text-[#A1A1AA] hover:text-[#09090B] transition-opacity duration-200"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-[#A1A1AA] w-10 text-center font-mono-accent">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale(s => Math.min(s + 0.1, 1))}
                className="w-7 h-7 flex items-center justify-center text-[#A1A1AA] hover:text-[#09090B] transition-opacity duration-200"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
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

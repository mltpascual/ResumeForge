import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FONT_PAIRINGS } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, FileText, Trash2, Moon, Sun,
  ZoomIn, ZoomOut, User, Briefcase, GraduationCap,
  Wrench, FolderOpen, Award, Save, ArrowUpDown,
  Upload, Palette, Printer, Type, LayoutTemplate, ALargeSmall,
  Check, ChevronUp, Eye, X, Monitor,
} from 'lucide-react';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import ResumePreview from '@/components/preview/ResumePreview';
import DraggableSections from '@/components/DraggableSections';
import ResumeCompleteness from '@/components/ResumeCompleteness';
import ATSScoreChecker from '@/components/ATSScoreChecker';
import JobDescriptionMatcher from '@/components/JobDescriptionMatcher';
import CoverLetterGenerator from '@/components/CoverLetterGenerator';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import OnboardingTour from '@/components/OnboardingTour';
import LinkedInImport from '@/components/LinkedInImport';
import ResumeProfiles from '@/components/ResumeProfiles';
import DocxExport from '@/components/DocxExport';
import WordCount from '@/components/WordCount';
import SectionTips from '@/components/SectionTips';
import ATSSimulator from '@/components/ATSSimulator';
import type { TemplateId } from '@/types/resume';

const INFO_TABS = [
  { value: 'personal', label: 'Personal', icon: User },
  { value: 'experience', label: 'Experience', icon: Briefcase },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'skills', label: 'Skills', icon: Wrench },
  { value: 'projects', label: 'Projects', icon: FolderOpen },
  { value: 'certifications', label: 'Certs', icon: Award },
  { value: 'order', label: 'Order', icon: ArrowUpDown },
];

const DESIGN_TABS = [
  { value: 'templates', label: 'Templates', icon: LayoutTemplate },
  { value: 'fonts', label: 'Fonts', icon: Type },
  { value: 'size', label: 'Size', icon: ALargeSmall },
  { value: 'colors', label: 'Colors', icon: Palette },
];

const FONT_SIZE_PRESETS = [
  { label: 'XS', value: 0.85, desc: 'Extra small — fit more content' },
  { label: 'S', value: 0.92, desc: 'Small — compact but readable' },
  { label: 'M', value: 1, desc: 'Medium — default size' },
  { label: 'L', value: 1.08, desc: 'Large — easier to read' },
  { label: 'XL', value: 1.16, desc: 'Extra large — maximum readability' },
];

const LINE_SPACING_PRESETS = [
  { label: 'Tight', value: 0.85, desc: 'Minimal spacing — fit more content' },
  { label: 'Normal', value: 1, desc: 'Default line spacing' },
  { label: 'Relaxed', value: 1.15, desc: 'Comfortable reading spacing' },
  { label: 'Loose', value: 1.3, desc: 'Maximum breathing room' },
];

const MARGIN_PRESETS = [
  { label: 'Narrow', value: 0.6, desc: 'Tight margins — maximize content area' },
  { label: 'Normal', value: 1, desc: 'Standard page margins' },
  { label: 'Wide', value: 1.4, desc: 'Generous margins — clean look' },
];

const ALL_TABS = [...INFO_TABS, ...DESIGN_TABS];

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Traditional single-column layout' },
  { id: 'modern', label: 'Modern', desc: 'Sidebar with accent color' },
  { id: 'executive', label: 'Executive', desc: 'Bold header with two columns' },
  { id: 'compact', label: 'Compact', desc: 'Dense, space-efficient layout' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean and understated' },
  { id: 'twocolumn', label: 'Two Column', desc: 'Balanced two-column split' },
  { id: 'creative', label: 'Creative', desc: 'Bold colorful header with playful style' },
  { id: 'developer', label: 'Developer', desc: 'Terminal-inspired dark theme' },
  { id: 'academic', label: 'Academic', desc: 'Formal serif layout for CV/academia' },
  { id: 'elegance', label: 'Elegance', desc: 'Refined minimal with subtle accents' },
];

const PRESET_COLORS = [
  '#6750A4', '#1E3A5F', '#1E40AF', '#7C3AED', '#BE185D',
  '#B91C1C', '#C2410C', '#A16207', '#15803D', '#0F766E',
  '#4338CA', '#0369A1', '#6D28D9', '#9333EA', '#DB2777',
];

/** Tab pill with tooltip that shows on small screens when label is hidden */
function TabPill({
  tab,
  variant,
  isActive,
}: {
  tab: { value: string; label: string; icon: React.ComponentType<{ className?: string }> };
  variant: 'info' | 'design';
  isActive: boolean;
}) {
  const activeClass = variant === 'info'
    ? 'data-[state=active]:bg-[var(--md3-primary-container)] data-[state=active]:text-[var(--md3-on-primary-container)]'
    : 'data-[state=active]:bg-[var(--md3-secondary-container)] data-[state=active]:text-[var(--md3-on-secondary-container)]';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TabsTrigger
          value={tab.value}
          className={`relative gap-1.5 px-3 py-2 text-xs font-medium rounded-full ${activeClass} data-[state=inactive]:text-[var(--md3-on-surface-variant)] transition-all`}
          style={{ marginBottom: '5px' }}
        >
          <tab.icon className="size-3.5" />
          <span className="hidden sm:inline">{tab.label}</span>
          {/* Animated underline indicator */}
          {isActive && (
            <motion.div
              layoutId="tab-underline"
              className="absolute -bottom-[7px] left-1/2 h-[3px] rounded-full"
              style={{
                background: variant === 'info' ? 'var(--md3-primary)' : 'var(--md3-secondary)',
                width: '60%',
                x: '-50%',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </TabsTrigger>
      </TooltipTrigger>
      {/* Tooltip only visible on small screens where label is hidden */}
      <TooltipContent className="sm:hidden" sideOffset={6}>
        {tab.label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Editor() {
  const {
    loadSampleData, clearAllData,
    selectedTemplate, setSelectedTemplate,
    activeSection, setActiveSection,
    accentColor, setAccentColor,
    selectedFont, setSelectedFont,
    fontSize, setFontSize,
    lineSpacing, setLineSpacing,
    marginSize, setMarginSize,
    exportJSON, importJSON,
  } = useResume();
  const { theme, toggleTheme } = useTheme();

  const [zoom, setZoom] = useState(75);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [atsSimMode, setAtsSimMode] = useState(false);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExportPDF = useCallback(async () => {
    const el = previewRef.current;
    if (!el) return;
    setExporting(true);

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '800px';
      clone.style.background = '#ffffff';
      clone.style.transform = 'none';
      clone.style.zIndex = '-1';
      document.body.appendChild(clone);

      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        windowWidth: 800,
        onclone: (clonedDoc) => {
          const root = clonedDoc.body;
          root.style.backgroundColor = '#ffffff';
          root.style.color = '#09090B';
        },
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfDataUri = pdf.output('datauristring');
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfDataUri;
      downloadLink.download = 'resume.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleImportJSON = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importJSON(file);
      toast.success('Resume data imported successfully');
    } catch {
      toast.error('Failed to import. Please check the file format.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [importJSON]);

  const handleExportJSON = useCallback(() => {
    exportJSON();
    toast.success('JSON exported');
  }, [exportJSON]);

  /* MD3 helper: selection card style */
  const cardStyle = (active: boolean) => ({
    background: active ? 'var(--md3-primary-container)' : 'var(--md3-surface-container)',
    color: active ? 'var(--md3-on-primary-container)' : 'inherit',
    border: active ? '2px solid var(--primary)' : '1px solid var(--md3-outline-variant)',
  });

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportJSON}
      />

      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden print:overflow-visible">
        {/* MD3 Top App Bar */}
        <header className="shrink-0 print:hidden" style={{ background: 'var(--md3-surface-container-low)', borderBottom: '1px solid var(--md3-outline-variant)' }}>
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="size-10 rounded-full">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--md3-primary-container)' }}>
                  <FileText className="size-4" style={{ color: 'var(--md3-on-primary-container)' }} />
                </div>
                <span className="font-display text-lg font-medium">ResumeForge</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* MD3 Icon Buttons */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => { loadSampleData(); toast.success('Sample data loaded'); }} className="gap-1.5 h-9 text-xs rounded-full px-3">
                    <FileText className="size-4" />
                    <span className="hidden sm:inline font-medium">Sample</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Load sample data</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => { clearAllData(); toast.info('Data cleared'); }} className="gap-1.5 h-9 text-xs rounded-full px-3">
                    <Trash2 className="size-4" />
                    <span className="hidden sm:inline font-medium">Clear</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all data</TooltipContent>
              </Tooltip>

              <div className="w-px h-6 mx-1" style={{ background: 'var(--md3-outline-variant)' }} />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-9 rounded-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import JSON</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleExportJSON} className="gap-1.5 h-9 text-xs rounded-full px-3">
                    <Download className="size-4" />
                    <span className="hidden lg:inline font-medium">JSON</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export as JSON</TooltipContent>
              </Tooltip>

              <div className="w-px h-6 mx-1" style={{ background: 'var(--md3-outline-variant)' }} />

              {toggleTheme && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={toggleTheme}>
                      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={handlePrint}>
                    <Printer className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print (Ctrl+P)</TooltipContent>
              </Tooltip>

              <LinkedInImport />

              <ResumeProfiles />

              <DocxExport />

              <div className="w-px h-6 mx-1" style={{ background: 'var(--md3-outline-variant)' }} />

              <span data-tour="job-matcher"><JobDescriptionMatcher /></span>

              <span data-tour="cover-letter"><CoverLetterGenerator /></span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={() => setRecruiterMode(true)}>
                    <Eye className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview as recruiter</TooltipContent>
              </Tooltip>

              {/* MD3 Filled Button for Export */}
              <Button
                data-tour="export"
                onClick={handleExportPDF}
                disabled={exporting}
                className="gap-2 h-10 text-sm font-display font-medium rounded-full px-5 ml-1"
              >
                <Download className="size-4" />
                {exporting ? 'Exporting...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile toggle — MD3 Segmented Button */}
        <div className="lg:hidden flex p-2 print:hidden" style={{ background: 'var(--md3-surface-container)' }}>
          <button
            onClick={() => setShowPreview(false)}
            className="flex-1 py-2.5 text-sm font-display font-medium text-center rounded-full transition-all"
            style={!showPreview ? { background: 'var(--md3-primary-container)', color: 'var(--md3-on-primary-container)' } : { color: 'var(--md3-on-surface-variant)' }}
          >
            Editor
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 py-2.5 text-sm font-display font-medium text-center rounded-full transition-all"
            style={showPreview ? { background: 'var(--md3-primary-container)', color: 'var(--md3-on-primary-container)' } : { color: 'var(--md3-on-surface-variant)' }}
          >
            Preview
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden print:overflow-visible print:block">
          {/* Left: Form Editor + Design Controls */}
          <div className={`w-full lg:w-[560px] xl:w-[620px] flex flex-col shrink-0 overflow-hidden ${showPreview ? 'hidden lg:flex' : 'flex'} print:hidden`} style={{ borderRight: '1px solid var(--md3-outline-variant)' }}>
            <Tabs value={activeSection} onValueChange={setActiveSection} className="flex flex-col h-full overflow-hidden">
              {/* MD3 Navigation Tabs with animated underline */}
              <div className="shrink-0 overflow-x-auto px-3 pt-2 pb-2" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
                <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent p-0 justify-start" data-tour="tabs">
                  {INFO_TABS.map(tab => (
                    <TabPill
                      key={tab.value}
                      tab={tab}
                      variant="info"
                      isActive={activeSection === tab.value}
                    />
                  ))}

                  <div className="flex items-center px-1">
                    <div className="w-px h-4" style={{ background: 'var(--md3-outline-variant)' }} />
                  </div>

                  <span data-tour="design-tabs" className="contents">{DESIGN_TABS.map(tab => (
                    <TabPill
                      key={tab.value}
                      tab={tab}
                      variant="design"
                      isActive={activeSection === tab.value}
                    />
                  ))}</span>
                </TabsList>
              </div>

              {/* Tab Content — scrollable with scroll-to-top */}
              <div className="relative flex-1 overflow-hidden">
                <div
                  ref={scrollContainerRef}
                  className="h-full overflow-y-auto"
                  style={{ background: 'var(--md3-surface-container-lowest)' }}
                >
                  <div className="p-5 lg:p-6">
                    {/* Info tab contents */}
                    <TabsContent value="personal" className="mt-0">
                      <SectionTips section="personal" />
                      <PersonalInfoForm />
                    </TabsContent>
                    <TabsContent value="experience" className="mt-0">
                      <SectionTips section="experience" />
                      <ExperienceForm />
                    </TabsContent>
                    <TabsContent value="education" className="mt-0">
                      <SectionTips section="education" />
                      <EducationForm />
                    </TabsContent>
                    <TabsContent value="skills" className="mt-0">
                      <SectionTips section="skills" />
                      <SkillsForm />
                    </TabsContent>
                    <TabsContent value="projects" className="mt-0">
                      <SectionTips section="projects" />
                      <ProjectsForm />
                    </TabsContent>
                    <TabsContent value="certifications" className="mt-0">
                      <SectionTips section="certifications" />
                      <CertificationsForm />
                    </TabsContent>
                    <TabsContent value="order" className="mt-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Section Order</h3>
                          <p className="text-sm text-muted-foreground mb-4">Drag to reorder how sections appear on your resume.</p>
                        </div>
                        <DraggableSections />
                      </div>
                    </TabsContent>

                    {/* Design tab contents */}
                    <TabsContent value="templates" className="mt-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Templates</h3>
                          <p className="text-sm text-muted-foreground">Choose a layout for your resume.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {TEMPLATES.map(t => (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTemplate(t.id)}
                              className="text-left p-4 rounded-2xl transition-all hover:shadow-md md3-state-layer"
                              style={cardStyle(selectedTemplate === t.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-display text-sm font-medium">{t.label}</span>
                                {selectedTemplate === t.id && (
                                  <div className="size-5 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                    <Check className="size-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs opacity-70 leading-relaxed">{t.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="fonts" className="mt-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Font Pairing</h3>
                          <p className="text-sm text-muted-foreground">Select a heading + body font combination.</p>
                        </div>
                        <div className="space-y-2">
                          {FONT_PAIRINGS.map(font => (
                            <button
                              key={font.id}
                              onClick={() => setSelectedFont(font.id)}
                              className="w-full text-left p-4 rounded-2xl transition-all hover:shadow-md md3-state-layer"
                              style={cardStyle(selectedFont.id === font.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium" style={{ fontFamily: font.heading }}>{font.name}</span>
                                {selectedFont.id === font.id && (
                                  <div className="size-5 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                    <Check className="size-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-4 text-xs opacity-70">
                                <span style={{ fontFamily: font.heading, fontWeight: 600 }}>Heading</span>
                                <span style={{ fontFamily: font.body }}>Body text sample</span>
                              </div>
                              <p className="mt-2 text-[13px] leading-relaxed opacity-80" style={{ fontFamily: font.body }}>
                                The quick brown fox jumps over the lazy dog.
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="size" className="mt-0">
                      <div className="space-y-5">
                        {/* Font Size */}
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Font Size</h3>
                          <p className="text-sm text-muted-foreground">Adjust the text size across your entire resume.</p>
                        </div>

                        <div className="space-y-2">
                          {FONT_SIZE_PRESETS.map(preset => (
                            <button
                              key={preset.label}
                              onClick={() => setFontSize(preset.value)}
                              className="w-full text-left p-3.5 rounded-2xl transition-all hover:shadow-sm md3-state-layer"
                              style={cardStyle(fontSize === preset.value)}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-display text-sm font-medium">{preset.label}</span>
                                {fontSize === preset.value && (
                                  <div className="size-5 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                    <Check className="size-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs opacity-70">{preset.desc}</p>
                            </button>
                          ))}
                        </div>

                        <div>
                          <Label className="text-xs font-display font-medium mb-2 block">Custom Scale</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0.7"
                              max="1.3"
                              step="0.01"
                              value={fontSize}
                              onChange={e => setFontSize(parseFloat(e.target.value))}
                              className="flex-1 accent-primary h-2 cursor-pointer"
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            <span className="text-sm font-mono-accent text-muted-foreground w-14 text-right">{Math.round(fontSize * 100)}%</span>
                          </div>
                        </div>

                        <div className="h-px" style={{ background: 'var(--md3-outline-variant)' }} />

                        {/* Line Spacing */}
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Line Spacing</h3>
                          <p className="text-sm text-muted-foreground mb-3">Control vertical spacing between lines.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {LINE_SPACING_PRESETS.map(preset => (
                            <button
                              key={preset.label}
                              onClick={() => setLineSpacing(preset.value)}
                              className="text-left p-3.5 rounded-2xl transition-all hover:shadow-sm md3-state-layer"
                              style={cardStyle(lineSpacing === preset.value)}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-display text-xs font-medium">{preset.label}</span>
                                {lineSpacing === preset.value && (
                                  <div className="size-4 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                    <Check className="size-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] opacity-70">{preset.desc}</p>
                            </button>
                          ))}
                        </div>

                        <div>
                          <Label className="text-xs font-display font-medium mb-2 block">Custom Spacing</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0.7"
                              max="1.5"
                              step="0.01"
                              value={lineSpacing}
                              onChange={e => setLineSpacing(parseFloat(e.target.value))}
                              className="flex-1 accent-primary h-2 cursor-pointer"
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            <span className="text-sm font-mono-accent text-muted-foreground w-14 text-right">{Math.round(lineSpacing * 100)}%</span>
                          </div>
                        </div>

                        <div className="h-px" style={{ background: 'var(--md3-outline-variant)' }} />

                        {/* Margins */}
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Page Margins</h3>
                          <p className="text-sm text-muted-foreground mb-3">Adjust the whitespace around your content.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {MARGIN_PRESETS.map(preset => (
                            <button
                              key={preset.label}
                              onClick={() => setMarginSize(preset.value)}
                              className="text-left p-3 rounded-2xl transition-all hover:shadow-sm md3-state-layer"
                              style={cardStyle(marginSize === preset.value)}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-display text-xs font-medium">{preset.label}</span>
                                {marginSize === preset.value && (
                                  <div className="size-4 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                    <Check className="size-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] opacity-70">{preset.desc}</p>
                            </button>
                          ))}
                        </div>

                        <div>
                          <Label className="text-xs font-display font-medium mb-2 block">Custom Margins</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0.4"
                              max="1.6"
                              step="0.01"
                              value={marginSize}
                              onChange={e => setMarginSize(parseFloat(e.target.value))}
                              className="flex-1 accent-primary h-2 cursor-pointer"
                              style={{ accentColor: 'var(--primary)' }}
                            />
                            <span className="text-sm font-mono-accent text-muted-foreground w-14 text-right">{Math.round(marginSize * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="colors" className="mt-0">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display text-lg font-medium mb-1">Accent Color</h3>
                          <p className="text-sm text-muted-foreground">Personalize your resume with a custom accent color.</p>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                          {PRESET_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => setAccentColor(color)}
                              className="group relative aspect-square rounded-2xl transition-all hover:scale-105"
                              style={{
                                backgroundColor: color,
                                border: accentColor === color ? '3px solid var(--foreground)' : '2px solid transparent',
                                boxShadow: accentColor === color ? '0 0 0 2px var(--background)' : 'none',
                              }}
                            >
                              {accentColor === color && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className="size-4 text-white drop-shadow-md" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="h-px" style={{ background: 'var(--md3-outline-variant)' }} />

                        <div>
                          <Label className="text-xs font-display font-medium mb-2 block">Industry Palettes</Label>
                          <div className="space-y-2">
                            {[
                              { name: 'Finance', colors: ['#1E3A5F', '#0F4C75', '#2C3E50', '#1B4332'] },
                              { name: 'Tech', colors: ['#6750A4', '#1E40AF', '#7C3AED', '#0EA5E9'] },
                              { name: 'Creative', colors: ['#BE185D', '#DB2777', '#EC4899', '#F472B6'] },
                              { name: 'Healthcare', colors: ['#0F766E', '#15803D', '#059669', '#0D9488'] },
                              { name: 'Legal', colors: ['#1C1917', '#44403C', '#78716C', '#292524'] },
                              { name: 'Education', colors: ['#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6'] },
                            ].map(palette => (
                              <div key={palette.name} className="flex items-center gap-2">
                                <span className="text-[11px] font-medium w-16 shrink-0 text-muted-foreground">{palette.name}</span>
                                <div className="flex gap-1.5">
                                  {palette.colors.map(c => (
                                    <button
                                      key={c}
                                      onClick={() => setAccentColor(c)}
                                      className="size-7 rounded-lg transition-all hover:scale-110"
                                      style={{
                                        backgroundColor: c,
                                        border: accentColor === c ? '2px solid var(--foreground)' : '1px solid transparent',
                                        boxShadow: accentColor === c ? '0 0 0 1px var(--background)' : 'none',
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="h-px" style={{ background: 'var(--md3-outline-variant)' }} />

                        <div>
                          <Label className="text-xs font-display font-medium mb-2 block">Custom Color</Label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="color"
                              value={accentColor}
                              onChange={e => setAccentColor(e.target.value)}
                              className="w-12 h-10 p-1 cursor-pointer rounded-xl"
                              style={{ border: '2px solid var(--md3-outline-variant)' }}
                            />
                            <Input
                              value={accentColor}
                              onChange={e => setAccentColor(e.target.value)}
                              placeholder="#6750A4"
                              className="h-10 text-sm font-mono-accent flex-1 rounded-xl"
                              style={{ border: '1px solid var(--md3-outline-variant)' }}
                            />
                            <div
                              className="h-10 w-20 rounded-xl shrink-0"
                              style={{ backgroundColor: accentColor, border: '1px solid var(--md3-outline-variant)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </div>

                {/* Scroll-to-top floating button */}
                <AnimatePresence>
                  {showScrollTop && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                      className="absolute bottom-16 right-4 z-10"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={scrollToTop}
                            className="size-11 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 hover:shadow-xl"
                            style={{
                              background: 'var(--md3-primary-container)',
                              color: 'var(--md3-on-primary-container)',
                              border: '1px solid var(--md3-outline-variant)',
                            }}
                            aria-label="Scroll to top"
                          >
                            <ChevronUp className="size-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" sideOffset={8}>Scroll to top</TooltipContent>
                      </Tooltip>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auto-save indicator + completeness score */}
              <div className="px-5 py-2.5 flex items-center justify-between shrink-0" style={{ borderTop: '1px solid var(--md3-outline-variant)', background: 'var(--md3-surface-container-low)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Save className="size-3.5" />
                    <span className="font-medium">Auto-saved</span>
                  </div>
                  <div className="w-px h-4" style={{ background: 'var(--md3-outline-variant)' }} />
                  <WordCount />
                </div>
                <div className="flex items-center gap-4">
                  <ResumeCompleteness />
                  <div className="w-px h-4" style={{ background: 'var(--md3-outline-variant)' }} />
                  <span data-tour="ats-score"><ATSScoreChecker /></span>
                </div>
              </div>
            </Tabs>
          </div>

          {/* Right: Preview */}
          <div data-tour="preview" className={`flex-1 flex flex-col overflow-hidden ${showPreview ? 'flex' : 'hidden lg:flex'} print:block print:bg-white`} style={{ background: 'var(--md3-surface-container)' }}>
            {/* Preview toolbar */}
            <div className="px-4 py-2.5 flex items-center justify-between shrink-0 print:hidden" style={{ borderBottom: '1px solid var(--md3-outline-variant)', background: 'var(--md3-surface-container-low)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-medium text-muted-foreground">Preview</span>
                <span
                  className="text-[10px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--md3-secondary-container)', color: 'var(--md3-on-secondary-container)' }}
                >
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <ZoomOut className="size-4" />
                </Button>
                <span className="text-[11px] font-mono-accent text-muted-foreground w-8 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setZoom(z => Math.min(150, z + 10))}>
                  <ZoomIn className="size-4" />
                </Button>
              </div>
            </div>

            {/* Preview area */}
            <div className="flex-1 overflow-y-auto print:overflow-visible">
              <div className="p-6 lg:p-10 flex justify-center print:p-0">
                <div
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  className="transition-transform duration-300 md3-motion-emphasized print:!transform-none"
                >
                  <div className="bg-white md3-elevation-2 rounded-lg print:shadow-none print:border-0 print:rounded-none" style={{ width: '800px', minHeight: '1131px' }}>
                    <ResumePreview ref={previewRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Preview Mode — Full-screen overlay */}
      <AnimatePresence>
        {recruiterMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'var(--md3-surface-container)' }}
          >
            {/* Recruiter mode top bar */}
            <div className="shrink-0 flex items-center justify-between px-6 h-14" style={{ background: 'var(--md3-surface-container-low)', borderBottom: '1px solid var(--md3-outline-variant)' }}>
              <div className="flex items-center gap-3">
                <Eye className="size-5" style={{ color: 'var(--md3-primary)' }} />
                <span className="font-display text-sm font-medium">Recruiter Preview</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">Full-width read-only view</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={atsSimMode ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAtsSimMode(!atsSimMode)}
                  className="gap-1.5 h-9 text-xs rounded-full px-3"
                  style={atsSimMode ? { background: 'var(--md3-primary)', color: 'var(--md3-on-primary)' } : {}}
                >
                  <Monitor className="size-4" />
                  <span className="font-medium hidden sm:inline">ATS Simulation</span>
                </Button>
                <div className="w-px h-6 mx-1" style={{ background: 'var(--md3-outline-variant)' }} />
                <Button variant="ghost" size="sm" onClick={handleExportPDF} disabled={exporting} className="gap-1.5 h-9 text-xs rounded-full px-3">
                  <Download className="size-4" />
                  <span className="font-medium hidden sm:inline">{exporting ? 'Exporting...' : 'Export PDF'}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-1.5 h-9 text-xs rounded-full px-3">
                  <Printer className="size-4" />
                  <span className="font-medium hidden sm:inline">Print</span>
                </Button>
                <div className="w-px h-6 mx-1" style={{ background: 'var(--md3-outline-variant)' }} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={() => { setRecruiterMode(false); setAtsSimMode(false); }}>
                      <X className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exit recruiter preview</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Recruiter mode content — resume + optional ATS simulation panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Resume preview */}
              <div className="flex-1 overflow-y-auto">
                <div className="py-10 flex justify-center">
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                  >
                    <div className="bg-white md3-elevation-3 rounded-lg" style={{ width: '800px', minHeight: '1131px' }}>
                      <ResumePreview />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ATS Simulation Side Panel */}
              <AnimatePresence>
                {atsSimMode && <ATSSimulator isVisible={atsSimMode} />}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <KeyboardShortcuts />
      <OnboardingTour />
    </>
  );
}

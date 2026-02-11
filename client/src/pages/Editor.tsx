import { useState, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FONT_PAIRINGS } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, Trash2, Moon, Sun,
  ZoomIn, ZoomOut, User, Briefcase, GraduationCap,
  Wrench, FolderOpen, Award, Save, ArrowUpDown,
  Upload, Palette, Printer, Type, LayoutTemplate,
} from 'lucide-react';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import ResumePreview from '@/components/preview/ResumePreview';
import DraggableSections from '@/components/DraggableSections';
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
  { value: 'colors', label: 'Colors', icon: Palette },
];

const ALL_TABS = [...INFO_TABS, ...DESIGN_TABS];

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Traditional single-column layout' },
  { id: 'modern', label: 'Modern', desc: 'Sidebar with accent color' },
  { id: 'executive', label: 'Executive', desc: 'Bold header with two columns' },
  { id: 'compact', label: 'Compact', desc: 'Dense, space-efficient layout' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean and understated' },
  { id: 'twocolumn', label: 'Two Column', desc: 'Balanced two-column split' },
];

const PRESET_COLORS = [
  '#18181B', '#1E3A5F', '#1E40AF', '#7C3AED', '#BE185D',
  '#B91C1C', '#C2410C', '#A16207', '#15803D', '#0F766E',
  '#4338CA', '#0369A1', '#6D28D9', '#9333EA', '#DB2777',
];

export default function Editor() {
  const {
    loadSampleData, clearAllData,
    selectedTemplate, setSelectedTemplate,
    activeSection, setActiveSection,
    accentColor, setAccentColor,
    selectedFont, setSelectedFont,
    exportJSON, importJSON,
  } = useResume();
  const { theme, toggleTheme } = useTheme();

  const [zoom, setZoom] = useState(75);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);

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
        {/* Top Bar — compact, only essential actions */}
        <header className="border-b bg-background/95 backdrop-blur-sm shrink-0 print:hidden">
          <div className="flex items-center justify-between h-12 px-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="size-8">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-5" />
              <span className="font-display text-base font-bold tracking-tight">ResumeForge</span>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => { loadSampleData(); toast.success('Sample data loaded'); }} className="gap-1.5 h-8 text-xs">
                    <FileText className="size-3.5" />
                    <span className="hidden sm:inline">Sample</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Load sample data</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => { clearAllData(); toast.info('Data cleared'); }} className="gap-1.5 h-8 text-xs">
                    <Trash2 className="size-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all data</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-5 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import JSON</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleExportJSON} className="gap-1.5 h-8 text-xs">
                    <Download className="size-3.5" />
                    <span className="hidden lg:inline">JSON</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export as JSON</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-5 mx-1" />

              {toggleTheme && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                      {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" onClick={handlePrint}>
                    <Printer className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print (Ctrl+P)</TooltipContent>
              </Tooltip>

              <Button
                size="sm"
                onClick={handleExportPDF}
                disabled={exporting}
                className="gap-1.5 h-8 text-xs font-display ml-1"
              >
                <Download className="size-3.5" />
                {exporting ? 'Exporting...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile toggle */}
        <div className="lg:hidden flex border-b print:hidden">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2.5 text-sm font-display font-semibold text-center transition-colors ${!showPreview ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Editor
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2.5 text-sm font-display font-semibold text-center transition-colors ${showPreview ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Preview
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden print:overflow-visible print:block">
          {/* Left: Form Editor + Design Controls */}
          <div className={`w-full lg:w-[560px] xl:w-[620px] border-r flex flex-col shrink-0 overflow-hidden ${showPreview ? 'hidden lg:flex' : 'flex'} print:hidden`}>
            <Tabs value={activeSection} onValueChange={setActiveSection} className="flex flex-col h-full overflow-hidden">
              {/* Horizontal Tabs — Info + Design */}
              <div className="border-b px-3 pt-2 pb-0 shrink-0 overflow-x-auto">
                <TabsList className="w-full h-auto flex-wrap gap-0.5 bg-transparent p-0 justify-start">
                  {/* Info tabs */}
                  {INFO_TABS.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="gap-1.5 px-2.5 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                    >
                      <tab.icon className="size-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}

                  {/* Separator dot */}
                  <div className="flex items-center px-1">
                    <div className="w-px h-4 bg-border" />
                  </div>

                  {/* Design tabs */}
                  {DESIGN_TABS.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="gap-1.5 px-2.5 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                    >
                      <tab.icon className="size-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab Content — scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-5 lg:p-6">
                  {/* Info tab contents */}
                  <TabsContent value="personal" className="mt-0">
                    <PersonalInfoForm />
                  </TabsContent>
                  <TabsContent value="experience" className="mt-0">
                    <ExperienceForm />
                  </TabsContent>
                  <TabsContent value="education" className="mt-0">
                    <EducationForm />
                  </TabsContent>
                  <TabsContent value="skills" className="mt-0">
                    <SkillsForm />
                  </TabsContent>
                  <TabsContent value="projects" className="mt-0">
                    <ProjectsForm />
                  </TabsContent>
                  <TabsContent value="certifications" className="mt-0">
                    <CertificationsForm />
                  </TabsContent>
                  <TabsContent value="order" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold mb-1">Section Order</h3>
                        <p className="text-sm text-muted-foreground mb-4">Drag to reorder how sections appear on your resume.</p>
                      </div>
                      <DraggableSections />
                    </div>
                  </TabsContent>

                  {/* Design tab contents */}
                  <TabsContent value="templates" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold mb-1">Templates</h3>
                        <p className="text-sm text-muted-foreground">Choose a layout for your resume.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {TEMPLATES.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                              selectedTemplate === t.id
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-display text-sm font-semibold">{t.label}</span>
                              {selectedTemplate === t.id && (
                                <Badge variant="default" className="text-[10px] h-5">Active</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fonts" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold mb-1">Font Pairing</h3>
                        <p className="text-sm text-muted-foreground">Select a heading + body font combination.</p>
                      </div>
                      <div className="space-y-2">
                        {FONT_PAIRINGS.map(font => (
                          <button
                            key={font.id}
                            onClick={() => setSelectedFont(font.id)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                              selectedFont.id === font.id
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold" style={{ fontFamily: font.heading }}>{font.name}</span>
                              {selectedFont.id === font.id && (
                                <Badge variant="default" className="text-[10px] h-5">Active</Badge>
                              )}
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>
                                <span className="font-semibold" style={{ fontFamily: font.heading }}>Heading</span>
                              </span>
                              <span>
                                <span style={{ fontFamily: font.body }}>Body text sample</span>
                              </span>
                            </div>
                            <p className="mt-2 text-[13px] leading-relaxed" style={{ fontFamily: font.body }}>
                              The quick brown fox jumps over the lazy dog.
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="mt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold mb-1">Accent Color</h3>
                        <p className="text-sm text-muted-foreground">Personalize your resume with a custom accent color.</p>
                      </div>

                      <div className="grid grid-cols-5 gap-3">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className="group relative aspect-square rounded-lg border-2 transition-all hover:scale-105"
                            style={{
                              backgroundColor: color,
                              borderColor: accentColor === color ? 'var(--foreground)' : 'transparent',
                            }}
                          >
                            {accentColor === color && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="size-2.5 rounded-full bg-white/90" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-xs font-display font-semibold mb-2 block">Custom Color</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="color"
                            value={accentColor}
                            onChange={e => setAccentColor(e.target.value)}
                            className="w-12 h-10 p-1 border-2 cursor-pointer rounded-lg"
                          />
                          <Input
                            value={accentColor}
                            onChange={e => setAccentColor(e.target.value)}
                            placeholder="#18181B"
                            className="h-10 text-sm font-mono-accent flex-1"
                          />
                          <div
                            className="h-10 w-20 rounded-lg border-2 shrink-0"
                            style={{ backgroundColor: accentColor, borderColor: 'var(--border)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>

              {/* Auto-save indicator */}
              <div className="border-t px-5 py-2 flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <Save className="size-3" />
                <span>Auto-saved to browser</span>
              </div>
            </Tabs>
          </div>

          {/* Right: Preview */}
          <div className={`flex-1 flex flex-col bg-muted/30 overflow-hidden ${showPreview ? 'flex' : 'hidden lg:flex'} print:block print:bg-white`}>
            {/* Preview toolbar */}
            <div className="border-b bg-background/50 backdrop-blur-sm px-4 py-2 flex items-center justify-between shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-semibold text-muted-foreground">Preview</span>
                <Badge variant="secondary" className="text-[10px] h-5 font-mono-accent">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" className="size-7" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <ZoomOut className="size-3.5" />
                </Button>
                <span className="text-[10px] font-mono-accent text-muted-foreground w-8 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" className="size-7" onClick={() => setZoom(z => Math.min(150, z + 10))}>
                  <ZoomIn className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Preview area */}
            <div className="flex-1 overflow-y-auto print:overflow-visible">
              <div className="p-6 lg:p-10 flex justify-center print:p-0">
                <div
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                  className="transition-transform duration-200 print:!transform-none"
                >
                  <div className="bg-white shadow-lg border print:shadow-none print:border-0" style={{ width: '800px' }}>
                    <ResumePreview ref={previewRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, Trash2, Moon, Sun,
  ZoomIn, ZoomOut, User, Briefcase, GraduationCap,
  Wrench, FolderOpen, Award, Save, ArrowUpDown,
  Upload, Palette, Printer,
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

const TABS = [
  { value: 'personal', label: 'Personal', icon: User },
  { value: 'experience', label: 'Experience', icon: Briefcase },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'skills', label: 'Skills', icon: Wrench },
  { value: 'projects', label: 'Projects', icon: FolderOpen },
  { value: 'certifications', label: 'Certs', icon: Award },
  { value: 'order', label: 'Order', icon: ArrowUpDown },
];

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'executive', label: 'Executive' },
];

const PRESET_COLORS = [
  '#18181B', '#1E3A5F', '#1E40AF', '#7C3AED', '#BE185D',
  '#B91C1C', '#C2410C', '#A16207', '#15803D', '#0F766E',
];

export default function Editor() {
  const {
    loadSampleData, clearAllData,
    selectedTemplate, setSelectedTemplate,
    activeSection, setActiveSection,
    accentColor, setAccentColor,
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

      // Clone the preview element — it uses all inline styles (no oklch/Tailwind)
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '800px';
      clone.style.background = '#ffffff';
      clone.style.transform = 'none';
      clone.style.zIndex = '-1';
      document.body.appendChild(clone);

      // Small delay for layout to settle
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        windowWidth: 800,
        onclone: (clonedDoc) => {
          // Ensure the cloned element has no oklch colors from inherited styles
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

      // Use data URI for maximum compatibility
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
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [importJSON]);

  const handleExportJSON = useCallback(() => {
    exportJSON();
    toast.success('JSON exported');
  }, [exportJSON]);

  return (
    <>
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportJSON}
      />

      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden print:overflow-visible">
        {/* Top Bar */}
        <header className="border-b bg-background/95 backdrop-blur-sm shrink-0 print:hidden">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <span className="font-display text-lg font-bold tracking-tight">ResumeForge</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sample / Clear */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => { loadSampleData(); toast.success('Sample data loaded'); }} className="gap-2">
                    <FileText className="size-4" />
                    <span className="hidden sm:inline">Sample</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Load sample data</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => { clearAllData(); toast.info('Data cleared'); }} className="gap-2">
                    <Trash2 className="size-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all data</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6" />

              {/* Template Selector */}
              <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-lg">
                {TEMPLATES.map(t => (
                  <Button
                    key={t.id}
                    variant={selectedTemplate === t.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTemplate(t.id)}
                    className="text-xs font-mono-accent h-7 px-3"
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              <Separator orientation="vertical" className="h-6 hidden md:block" />

              {/* Accent Color Picker */}
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Palette className="size-4" />
                        <span
                          className="absolute bottom-1 right-1 size-2.5 rounded-full border border-background"
                          style={{ backgroundColor: accentColor }}
                        />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Accent color</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-56 p-3" align="end">
                  <Label className="text-xs font-display font-semibold mb-2 block">Accent Color</Label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className="size-8 rounded-md border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: accentColor === color ? 'var(--foreground)' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="w-10 h-8 p-0 border-0 cursor-pointer"
                    />
                    <Input
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      placeholder="#18181B"
                      className="h-8 text-xs font-mono-accent flex-1"
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Import / Export JSON */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import JSON</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6" />

              {/* Dark mode toggle */}
              {toggleTheme && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</TooltipContent>
                </Tooltip>
              )}

              {/* Print */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handlePrint}>
                    <Printer className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print (Ctrl+P)</TooltipContent>
              </Tooltip>

              {/* Export buttons */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleExportJSON} className="gap-2">
                    <Download className="size-4" />
                    <span className="hidden lg:inline">JSON</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export as JSON</TooltipContent>
              </Tooltip>

              <Button
                size="sm"
                onClick={handleExportPDF}
                disabled={exporting}
                className="gap-2 font-display"
              >
                <Download className="size-4" />
                <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'PDF'}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile toggle */}
        <div className="lg:hidden flex border-b print:hidden">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-3 text-sm font-display font-semibold text-center transition-colors ${!showPreview ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Editor
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-3 text-sm font-display font-semibold text-center transition-colors ${showPreview ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Preview
          </button>
        </div>

        {/* Mobile template selector */}
        <div className="md:hidden border-b px-4 py-2 flex items-center gap-1 bg-muted/50 overflow-x-auto print:hidden">
          {TEMPLATES.map(t => (
            <Button
              key={t.id}
              variant={selectedTemplate === t.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTemplate(t.id)}
              className="text-xs font-mono-accent h-7 px-3 shrink-0"
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden print:overflow-visible print:block">
          {/* Left: Form Editor */}
          <div className={`w-full lg:w-[520px] xl:w-[580px] border-r flex flex-col shrink-0 overflow-hidden ${showPreview ? 'hidden lg:flex' : 'flex'} print:hidden`}>
            <Tabs value={activeSection} onValueChange={setActiveSection} className="flex flex-col h-full overflow-hidden">
              {/* Horizontal Tabs */}
              <div className="border-b px-4 pt-3 pb-0 shrink-0 overflow-x-auto">
                <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent p-0 justify-start">
                  {TABS.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="gap-2 px-3 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                    >
                      <tab.icon className="size-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Form Content — native overflow scroll instead of ScrollArea */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 lg:p-8">
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
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-display text-xl font-semibold mb-1">Section Order</h3>
                        <p className="text-sm text-muted-foreground mb-6">Drag and drop to reorder how sections appear on your resume.</p>
                      </div>
                      <DraggableSections />
                    </div>
                  </TabsContent>
                </div>
              </div>

              {/* Auto-save indicator */}
              <div className="border-t px-6 py-2.5 flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <Save className="size-3.5" />
                <span>Auto-saved to browser</span>
              </div>
            </Tabs>
          </div>

          {/* Right: Preview */}
          <div className={`flex-1 flex flex-col bg-muted/30 overflow-hidden ${showPreview ? 'flex' : 'hidden lg:flex'} print:block print:bg-white`}>
            {/* Preview toolbar */}
            <div className="border-b bg-background/50 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between shrink-0 print:hidden">
              <span className="text-sm font-display font-semibold text-muted-foreground">Preview</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <ZoomOut className="size-4" />
                </Button>
                <span className="text-xs font-mono-accent text-muted-foreground w-10 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon-sm" onClick={() => setZoom(z => Math.min(150, z + 10))}>
                  <ZoomIn className="size-4" />
                </Button>
              </div>
            </div>

            {/* Preview area — native overflow scroll */}
            <div className="flex-1 overflow-y-auto print:overflow-visible">
              <div className="p-8 lg:p-12 flex justify-center print:p-0">
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

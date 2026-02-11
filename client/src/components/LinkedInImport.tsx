import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

/**
 * Parse LinkedIn PDF text export into resume fields.
 * LinkedIn PDFs have a fairly consistent structure:
 * - Name at the top
 * - Title/headline
 * - Contact info section
 * - Experience section with company, title, dates
 * - Education section
 * - Skills section
 */
function parseLinkedInText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const result: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
    experiences: { company: string; position: string; startDate: string; endDate: string; description: string; location: string }[];
    education: { institution: string; degree: string; field: string; startDate: string; endDate: string }[];
    skills: string;
  } = {
    fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', summary: '',
    experiences: [], education: [], skills: '',
  };

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  if (emailMatch) result.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  if (phoneMatch) result.phone = phoneMatch[1].trim();

  // Extract LinkedIn URL
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) result.linkedin = linkedinMatch[0];

  // Name is typically the first meaningful line
  if (lines.length > 0) {
    result.fullName = lines[0];
  }

  // Title is typically the second line
  if (lines.length > 1 && !lines[1].includes('@') && !lines[1].includes('linkedin')) {
    result.title = lines[1];
  }

  // Find sections by common LinkedIn PDF headings
  const sectionIndices: { name: string; index: number }[] = [];
  const sectionPatterns = [
    { name: 'summary', pattern: /^(summary|about)$/i },
    { name: 'experience', pattern: /^(experience|work experience|professional experience)$/i },
    { name: 'education', pattern: /^education$/i },
    { name: 'skills', pattern: /^(skills|skills & endorsements|top skills)$/i },
    { name: 'certifications', pattern: /^(certifications|licenses & certifications)$/i },
    { name: 'contact', pattern: /^(contact|contact info)$/i },
  ];

  lines.forEach((line, i) => {
    for (const sp of sectionPatterns) {
      if (sp.pattern.test(line)) {
        sectionIndices.push({ name: sp.name, index: i });
        break;
      }
    }
  });

  // Sort by index
  sectionIndices.sort((a, b) => a.index - b.index);

  const getSection = (name: string): string[] => {
    const si = sectionIndices.find(s => s.name === name);
    if (!si) return [];
    const nextSi = sectionIndices.find(s => s.index > si.index);
    const end = nextSi ? nextSi.index : lines.length;
    return lines.slice(si.index + 1, end);
  };

  // Summary
  const summaryLines = getSection('summary');
  if (summaryLines.length > 0) {
    result.summary = summaryLines.join(' ');
  }

  // Experience parsing
  const expLines = getSection('experience');
  if (expLines.length > 0) {
    // LinkedIn experience entries typically follow: Company Name, Title, Date range, Location, Description
    const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*Present|\d{4}\s*[-–—]\s*\d{4}|\d{4}\s*[-–—]\s*Present/i;

    let currentExp: { company: string; position: string; startDate: string; endDate: string; description: string; location: string } | null = null;

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const dateMatch = line.match(datePattern);

      if (dateMatch) {
        // This line has dates, previous lines were company/position
        if (currentExp) {
          result.experiences.push(currentExp);
        }
        const parts = line.split(/[-–—]/);
        currentExp = {
          company: i >= 2 ? expLines[i - 2] : '',
          position: i >= 1 ? expLines[i - 1] : '',
          startDate: parts[0]?.trim() || '',
          endDate: parts[1]?.trim() || '',
          description: '',
          location: '',
        };
      } else if (currentExp && !dateMatch) {
        // Append to description
        if (currentExp.description) {
          currentExp.description += '\n' + line;
        } else {
          currentExp.description = line;
        }
      }
    }
    if (currentExp) result.experiences.push(currentExp);
  }

  // Education parsing
  const eduLines = getSection('education');
  if (eduLines.length > 0) {
    for (let i = 0; i < eduLines.length; i += 3) {
      const institution = eduLines[i] || '';
      const degreeField = eduLines[i + 1] || '';
      const dates = eduLines[i + 2] || '';
      const [degree, ...fieldParts] = degreeField.split(/,|in\s+/i);
      const dateParts = dates.split(/[-–—]/);
      result.education.push({
        institution,
        degree: degree?.trim() || '',
        field: fieldParts.join(' ').trim(),
        startDate: dateParts[0]?.trim() || '',
        endDate: dateParts[1]?.trim() || '',
      });
    }
  }

  // Skills
  const skillLines = getSection('skills');
  if (skillLines.length > 0) {
    result.skills = skillLines.filter(l => l.length > 1 && !l.match(/^\d+$/)).join(', ');
  }

  // Location from contact section
  const contactLines = getSection('contact');
  for (const line of contactLines) {
    if (line.match(/,\s*[A-Z]{2}/) || line.match(/\w+,\s*\w+/)) {
      result.location = line;
      break;
    }
  }

  return result;
}

export default function LinkedInImport() {
  const [open, setOpen] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ReturnType<typeof parseLinkedInText> | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { setResumeData, resumeData } = useResume();

  const handleFile = useCallback(async (file: File) => {
    setParsing(true);
    setError('');
    setParsed(null);

    try {
      // Read as text (LinkedIn PDFs can be parsed as text)
      const text = await file.text();

      if (text.length < 50) {
        setError('The file appears to be empty or not a valid LinkedIn PDF export. Try re-exporting from LinkedIn.');
        setParsing(false);
        return;
      }

      const result = parseLinkedInText(text);
      setParsed(result);
    } catch {
      setError('Failed to parse the file. Make sure it\'s a LinkedIn PDF export.');
    }
    setParsing(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const applyData = useCallback(() => {
    if (!parsed) return;

    let idCounter = 200;
    const genId = () => String(++idCounter);

    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        fullName: parsed.fullName || resumeData.personalInfo.fullName,
        title: parsed.title || resumeData.personalInfo.title,
        email: parsed.email || resumeData.personalInfo.email,
        phone: parsed.phone || resumeData.personalInfo.phone,
        location: parsed.location || resumeData.personalInfo.location,
        linkedin: parsed.linkedin || resumeData.personalInfo.linkedin,
        summary: parsed.summary || resumeData.personalInfo.summary,
      },
      experiences: parsed.experiences.length > 0
        ? parsed.experiences.map(exp => ({
            id: genId(),
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.endDate.toLowerCase().includes('present'),
            description: exp.description,
          }))
        : resumeData.experiences,
      education: parsed.education.length > 0
        ? parsed.education.map(edu => ({
            id: genId(),
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: '',
            description: '',
          }))
        : resumeData.education,
      skills: parsed.skills || resumeData.skills,
      projects: resumeData.projects,
      certifications: resumeData.certifications,
    });

    toast.success('LinkedIn data imported successfully');
    setOpen(false);
    setParsed(null);
  }, [parsed, resumeData, setResumeData]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={() => setOpen(true)}>
            <Linkedin className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Import from LinkedIn</TooltipContent>
      </Tooltip>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            onClick={() => { setOpen(false); setParsed(null); setError(''); }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-md mx-4 max-h-[80vh] overflow-hidden rounded-3xl"
              style={{ background: 'var(--md3-surface-container)', border: '1px solid var(--md3-outline-variant)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
                <div className="flex items-center gap-3">
                  <Linkedin className="size-5" style={{ color: '#0A66C2' }} />
                  <h2 className="font-display text-lg font-semibold">Import from LinkedIn</h2>
                </div>
                <Button variant="ghost" size="icon" className="size-9 rounded-full" onClick={() => { setOpen(false); setParsed(null); setError(''); }}>
                  <X className="size-4" />
                </Button>
              </div>

              <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-4">
                {!parsed && !error && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Upload your LinkedIn profile PDF export. Go to your LinkedIn profile → More → Save to PDF.
                    </p>
                    <div
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors hover:border-primary/50"
                      style={{ borderColor: 'var(--md3-outline-variant)' }}
                    >
                      {parsing ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">Parsing LinkedIn data...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="size-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Drop your LinkedIn PDF here</p>
                          <p className="text-xs text-muted-foreground">or click to browse</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--md3-error-container, #fce4ec)', color: 'var(--md3-on-error-container, #b71c1c)' }}>
                    <AlertCircle className="size-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Import Error</p>
                      <p className="text-xs mt-1 opacity-80">{error}</p>
                      <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => { setError(''); fileRef.current?.click(); }}>
                        Try again
                      </Button>
                    </div>
                  </div>
                )}

                {parsed && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="size-5" />
                      <span className="text-sm font-medium">Data extracted successfully</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {parsed.fullName && (
                        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--md3-surface-container-high)' }}>
                          <FileText className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">Name:</span> <span className="text-muted-foreground">{parsed.fullName}</span>
                        </div>
                      )}
                      {parsed.title && (
                        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--md3-surface-container-high)' }}>
                          <FileText className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">Title:</span> <span className="text-muted-foreground">{parsed.title}</span>
                        </div>
                      )}
                      {parsed.experiences.length > 0 && (
                        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--md3-surface-container-high)' }}>
                          <FileText className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{parsed.experiences.length} experience(s)</span>
                        </div>
                      )}
                      {parsed.education.length > 0 && (
                        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--md3-surface-container-high)' }}>
                          <FileText className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{parsed.education.length} education entry(ies)</span>
                        </div>
                      )}
                      {parsed.skills && (
                        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--md3-surface-container-high)' }}>
                          <FileText className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">Skills found</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">This will replace your current resume data with the imported LinkedIn data. Existing projects and certifications will be kept.</p>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 h-9 text-xs rounded-full"
                        style={{ background: 'var(--md3-primary)', color: 'var(--md3-on-primary)' }}
                        onClick={applyData}
                      >
                        Apply Imported Data
                      </Button>
                      <Button variant="ghost" className="h-9 text-xs rounded-full" onClick={() => { setParsed(null); fileRef.current?.click(); }}>
                        Re-upload
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

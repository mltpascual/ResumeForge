import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, X, Sparkles, Copy, Download, RefreshCw,
  ChevronDown, Building2, Wand2, Pen,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Cover letter tone presets ──
const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal and polished' },
  { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Energetic and passionate' },
  { id: 'conversational', label: 'Conversational', desc: 'Warm and approachable' },
] as const;

type ToneId = typeof TONES[number]['id'];

// ── Helper: extract company name from job description ──
function extractCompanyName(jd: string): string {
  // Try common patterns
  const patterns = [
    /(?:at|join|with)\s+([A-Z][A-Za-z0-9\s&.'-]{1,30}?)(?:\s*[,.]|\s+(?:is|are|we|as|to|and|in|for))/,
    /([A-Z][A-Za-z0-9\s&.'-]{1,30}?)\s+is\s+(?:looking|seeking|hiring)/,
    /(?:About|Company:)\s*([A-Z][A-Za-z0-9\s&.'-]{1,30})/,
  ];
  for (const p of patterns) {
    const m = jd.match(p);
    if (m && m[1] && m[1].trim().length > 1) return m[1].trim();
  }
  return '';
}

// ── Helper: extract role title from job description ──
function extractRoleTitle(jd: string): string {
  const patterns = [
    /(?:looking for|seeking|hiring)\s+(?:a|an)\s+([A-Z][A-Za-z\s/()-]{3,40}?)(?:\s+to\s|\s+who\s|\s+with\s|\.)/i,
    /^(?:Job Title|Position|Role):\s*(.+)$/im,
    /^#?\s*([A-Z][A-Za-z\s/()-]{5,40})\s*$/m,
  ];
  for (const p of patterns) {
    const m = jd.match(p);
    if (m && m[1] && m[1].trim().length > 3) return m[1].trim();
  }
  return '';
}

// ── Helper: extract key requirements from JD ──
function extractRequirements(jd: string): string[] {
  const lines = jd.split('\n');
  const reqs: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-•*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      const cleaned = trimmed.replace(/^[-•*\d.)]+\s+/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 200) {
        reqs.push(cleaned);
      }
    }
  }
  return reqs.slice(0, 8);
}

// ── Helper: get years of experience ──
function getYearsOfExperience(experiences: { startDate: string; endDate: string; current: boolean }[]): number {
  if (experiences.length === 0) return 0;
  const dates = experiences.map(e => {
    const start = new Date(e.startDate + '-01');
    const end = e.current ? new Date() : new Date((e.endDate || new Date().toISOString().slice(0, 7)) + '-01');
    return { start, end };
  });
  const earliest = new Date(Math.min(...dates.map(d => d.start.getTime())));
  const latest = new Date(Math.max(...dates.map(d => d.end.getTime())));
  return Math.round((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

// ── Helper: pick top achievements from experience descriptions ──
function getTopAchievements(experiences: { description: string; position: string }[]): string[] {
  const achievements: string[] = [];
  for (const exp of experiences) {
    if (!exp.description) continue;
    // Look for sentences with numbers (quantified achievements)
    const sentences = exp.description.split(/[.!]\s+/).filter(s => s.trim().length > 20);
    for (const s of sentences) {
      if (/\d+%|\d+\+|\d+x|\$\d/.test(s)) {
        achievements.push(s.trim().replace(/\.$/, ''));
      }
    }
  }
  return achievements.slice(0, 3);
}

// ── Generate cover letter ──
function generateCoverLetter(
  resumeData: ReturnType<typeof useResume>['resumeData'],
  jobDescription: string,
  companyName: string,
  tone: ToneId,
): string {
  const { personalInfo, experiences, education, skills, certifications } = resumeData;
  const name = personalInfo.fullName || 'there';
  const title = personalInfo.title || 'professional';
  const yearsExp = getYearsOfExperience(experiences);
  const achievements = getTopAchievements(experiences);
  const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
  const topSkills = skillsList.slice(0, 5);
  const currentRole = experiences[0];
  const highestEdu = education[0];

  // Extract info from JD if provided
  const jdRoleTitle = jobDescription ? extractRoleTitle(jobDescription) : '';
  const jdCompany = companyName || (jobDescription ? extractCompanyName(jobDescription) : '');
  const jdRequirements = jobDescription ? extractRequirements(jobDescription) : [];

  // Find skills that match JD requirements
  const matchedSkills: string[] = [];
  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();
    for (const skill of skillsList) {
      if (jdLower.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      }
    }
  }

  const roleRef = jdRoleTitle || title;
  const companyRef = jdCompany || '[Company Name]';
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Tone-specific openers and closers
  const openers: Record<ToneId, string[]> = {
    professional: [
      `I am writing to express my strong interest in the ${roleRef} position at ${companyRef}.`,
      `I am pleased to submit my application for the ${roleRef} role at ${companyRef}.`,
    ],
    enthusiastic: [
      `I am thrilled to apply for the ${roleRef} position at ${companyRef}!`,
      `I was excited to discover the ${roleRef} opening at ${companyRef}, and I am eager to bring my skills to your team.`,
    ],
    conversational: [
      `I came across the ${roleRef} role at ${companyRef} and knew it was the right fit.`,
      `When I saw the ${roleRef} opening at ${companyRef}, I immediately recognized a great opportunity to contribute.`,
    ],
  };

  const closers: Record<ToneId, string> = {
    professional: `I would welcome the opportunity to discuss how my background and skills align with ${companyRef}'s goals. I am available at your convenience for an interview and can be reached at ${personalInfo.email || '[your email]'}${personalInfo.phone ? ` or ${personalInfo.phone}` : ''}. Thank you for your time and consideration.`,
    enthusiastic: `I am genuinely excited about the possibility of contributing to ${companyRef}'s mission and would love to discuss how I can make an impact on your team. Please feel free to reach me at ${personalInfo.email || '[your email]'}${personalInfo.phone ? ` or ${personalInfo.phone}` : ''}. I look forward to hearing from you!`,
    conversational: `I would love to chat more about how I can contribute to ${companyRef}. Feel free to reach out at ${personalInfo.email || '[your email]'}${personalInfo.phone ? ` or ${personalInfo.phone}` : ''} — I am looking forward to the conversation.`,
  };

  const opener = openers[tone][Math.floor(Math.random() * openers[tone].length)];
  const closer = closers[tone];

  // Build paragraphs
  const paragraphs: string[] = [];

  // Header
  paragraphs.push(`${personalInfo.fullName || '[Your Name]'}`);
  const contactParts = [personalInfo.location, personalInfo.email, personalInfo.phone].filter(Boolean);
  if (contactParts.length > 0) {
    paragraphs.push(contactParts.join(' | '));
  }
  paragraphs.push(today);
  paragraphs.push('');

  // Greeting
  paragraphs.push(`Dear Hiring Manager,`);
  paragraphs.push('');

  // Opening paragraph
  let openingPara = opener;
  if (yearsExp > 0) {
    openingPara += ` With ${yearsExp}+ years of experience as a ${title}, I bring a proven track record of delivering impactful results.`;
  }
  if (personalInfo.summary) {
    // Extract a key phrase from the summary
    const summarySnippet = personalInfo.summary.split('.')[0];
    if (summarySnippet && summarySnippet.length > 20) {
      openingPara += ` ${summarySnippet}.`;
    }
  }
  paragraphs.push(openingPara);
  paragraphs.push('');

  // Experience & achievements paragraph
  let expPara = '';
  if (currentRole) {
    expPara += `In my current role as ${currentRole.position} at ${currentRole.company}, I have developed deep expertise that directly aligns with this opportunity.`;
  }
  if (achievements.length > 0) {
    expPara += ` Key accomplishments include: ${achievements.join('; ')}.`;
  } else if (currentRole?.description) {
    expPara += ` ${currentRole.description}`;
  }
  if (expPara) {
    paragraphs.push(expPara);
    paragraphs.push('');
  }

  // Skills & qualifications paragraph
  let skillsPara = '';
  if (matchedSkills.length > 0) {
    skillsPara = `My technical toolkit includes ${matchedSkills.join(', ')}, which directly match the requirements outlined in your job description.`;
    const unmatchedTopSkills = topSkills.filter(s => !matchedSkills.includes(s));
    if (unmatchedTopSkills.length > 0) {
      skillsPara += ` I also bring proficiency in ${unmatchedTopSkills.join(', ')}.`;
    }
  } else if (topSkills.length > 0) {
    skillsPara = `I bring strong proficiency in ${topSkills.join(', ')}, along with a commitment to continuous learning and professional growth.`;
  }
  if (highestEdu) {
    skillsPara += ` My ${highestEdu.degree} in ${highestEdu.field} from ${highestEdu.institution} provides a solid foundation for this role.`;
  }
  if (certifications.length > 0) {
    const certNames = certifications.slice(0, 2).map(c => c.name);
    skillsPara += ` Additionally, I hold ${certNames.join(' and ')}, demonstrating my dedication to staying current in the field.`;
  }
  if (skillsPara) {
    paragraphs.push(skillsPara);
    paragraphs.push('');
  }

  // Why this company paragraph (if JD provided)
  if (jobDescription && jdRequirements.length > 0) {
    const relevantReqs = jdRequirements.slice(0, 3);
    let whyPara = `I am particularly drawn to this role because of the emphasis on ${relevantReqs[0].toLowerCase()}.`;
    if (relevantReqs.length > 1) {
      whyPara += ` My background also positions me well to contribute to ${relevantReqs[1].toLowerCase()}.`;
    }
    paragraphs.push(whyPara);
    paragraphs.push('');
  }

  // Closing
  paragraphs.push(closer);
  paragraphs.push('');

  // Sign-off
  paragraphs.push('Sincerely,');
  paragraphs.push(personalInfo.fullName || '[Your Name]');

  return paragraphs.join('\n');
}

export default function CoverLetterGenerator() {
  const { resumeData } = useResume();
  const [expanded, setExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState<ToneId>('professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toneDropdownRef = useRef<HTMLDivElement>(null);

  // Close tone dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toneDropdownRef.current && !toneDropdownRef.current.contains(e.target as Node)) {
        setShowToneDropdown(false);
      }
    }
    if (showToneDropdown) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showToneDropdown]);

  const handleGenerate = useCallback(() => {
    const letter = generateCoverLetter(resumeData, jobDescription, companyName, tone);
    setCoverLetter(letter);
    setIsEditing(false);
    toast.success('Cover letter generated');
  }, [resumeData, jobDescription, companyName, tone]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Copied to clipboard');
  }, [coverLetter]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = resumeData.personalInfo.fullName?.replace(/\s+/g, '_') || 'cover_letter';
    a.download = `${name}_Cover_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Cover letter downloaded');
  }, [coverLetter, resumeData.personalInfo.fullName]);

  const hasResumeData = useMemo(() => {
    return !!(resumeData.personalInfo.fullName || resumeData.personalInfo.title || resumeData.experiences.length > 0);
  }, [resumeData]);

  const currentTone = TONES.find(t => t.id === tone)!;

  return (
    <>
      {/* Trigger button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full"
            onClick={() => setExpanded(true)}
          >
            <FileText className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cover letter generator</TooltipContent>
      </Tooltip>

      {/* Modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setExpanded(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col mx-4"
              style={{ background: 'var(--md3-surface-container-lowest)', border: '1px solid var(--md3-outline-variant)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="shrink-0 p-5 pb-4 flex items-start justify-between" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <Wand2 className="size-5" style={{ color: 'var(--md3-primary)' }} />
                    <h3 className="font-display text-lg font-semibold">Cover Letter Generator</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate a tailored cover letter from your resume data. Optionally paste a job description for better personalization.
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="size-9 rounded-full shrink-0" onClick={() => setExpanded(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Input section */}
                <div className="p-5 pb-3 space-y-3">
                  {/* Company name + Tone row */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Company Name (optional)</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          placeholder="e.g. Google, Stripe..."
                          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg focus:outline-none focus:ring-2 transition-all"
                          style={{
                            background: 'var(--md3-surface-container)',
                            border: '1px solid var(--md3-outline-variant)',
                            color: 'var(--md3-on-surface)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-44 relative" ref={toneDropdownRef}>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tone</label>
                      <button
                        onClick={() => setShowToneDropdown(!showToneDropdown)}
                        className="w-full h-9 px-3 text-sm rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 transition-all"
                        style={{
                          background: 'var(--md3-surface-container)',
                          border: '1px solid var(--md3-outline-variant)',
                          color: 'var(--md3-on-surface)',
                        }}
                      >
                        <span>{currentTone.label}</span>
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </button>
                      <AnimatePresence>
                        {showToneDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-10 shadow-lg"
                            style={{ background: 'var(--md3-surface-container-low)', border: '1px solid var(--md3-outline-variant)' }}
                          >
                            {TONES.map(t => (
                              <button
                                key={t.id}
                                onClick={() => { setTone(t.id); setShowToneDropdown(false); }}
                                className="w-full px-3 py-2 text-left text-sm hover:opacity-80 transition-opacity flex items-center justify-between"
                                style={{
                                  background: t.id === tone ? 'var(--md3-primary-container)' : 'transparent',
                                  color: t.id === tone ? 'var(--md3-on-primary-container)' : 'var(--md3-on-surface)',
                                }}
                              >
                                <span className="font-medium">{t.label}</span>
                                <span className="text-[11px] opacity-60">{t.desc}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Job description textarea */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Job Description (optional — improves personalization)</label>
                    <textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here for a more tailored cover letter..."
                      className="w-full h-24 p-3 text-sm rounded-xl resize-none focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'var(--md3-surface-container)',
                        border: '1px solid var(--md3-outline-variant)',
                        color: 'var(--md3-on-surface)',
                      }}
                    />
                  </div>

                  {/* Generate button */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleGenerate}
                      disabled={!hasResumeData}
                      className="gap-2 h-10 text-sm font-display font-medium rounded-full px-6"
                    >
                      <Sparkles className="size-4" />
                      {coverLetter ? 'Regenerate' : 'Generate Cover Letter'}
                    </Button>
                    {!hasResumeData && (
                      <span className="text-xs text-muted-foreground">Fill in your resume first</span>
                    )}
                  </div>
                </div>

                {/* Generated cover letter */}
                {coverLetter && (
                  <div className="px-5 pb-5">
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ border: '1px solid var(--md3-outline-variant)' }}
                    >
                      {/* Letter toolbar */}
                      <div
                        className="px-4 py-2.5 flex items-center justify-between"
                        style={{ background: 'var(--md3-surface-container)', borderBottom: '1px solid var(--md3-outline-variant)' }}
                      >
                        <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                          Generated Cover Letter
                        </span>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 rounded-full"
                                onClick={() => {
                                  setIsEditing(!isEditing);
                                  if (!isEditing) {
                                    setTimeout(() => textareaRef.current?.focus(), 100);
                                  }
                                }}
                              >
                                <Pen className="size-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isEditing ? 'Done editing' : 'Edit letter'}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={handleCopy}>
                                <Copy className="size-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy to clipboard</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={handleDownload}>
                                <Download className="size-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download as .txt</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={handleGenerate}>
                                <RefreshCw className="size-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Regenerate</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Letter content */}
                      {isEditing ? (
                        <textarea
                          ref={textareaRef}
                          value={coverLetter}
                          onChange={e => setCoverLetter(e.target.value)}
                          className="w-full p-6 text-sm leading-relaxed resize-none focus:outline-none min-h-[400px]"
                          style={{
                            background: 'var(--md3-surface-container-lowest)',
                            color: 'var(--md3-on-surface)',
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                          }}
                        />
                      ) : (
                        <div
                          className="p-6 text-sm leading-relaxed whitespace-pre-wrap"
                          style={{
                            background: 'var(--md3-surface-container-lowest)',
                            color: 'var(--md3-on-surface)',
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                          }}
                        >
                          {coverLetter}
                        </div>
                      )}
                    </div>

                    {/* Tips */}
                    <div className="mt-3 flex items-start gap-2 text-[11px] text-muted-foreground">
                      <Sparkles className="size-3 shrink-0 mt-0.5" />
                      <span>
                        This is a starting point — personalize it further by adding specific details about why you are excited about the company and how your unique perspective adds value. Click the edit icon to make changes directly.
                      </span>
                    </div>
                  </div>
                )}

                {/* Empty state when no letter generated yet */}
                {!coverLetter && (
                  <div className="px-5 pb-5">
                    <div
                      className="py-10 text-center rounded-xl"
                      style={{ background: 'var(--md3-surface-container)', border: '1px dashed var(--md3-outline-variant)' }}
                    >
                      <Wand2 className="size-8 mx-auto mb-3 text-muted-foreground opacity-40" />
                      <p className="text-sm text-muted-foreground font-medium">Your cover letter will appear here</p>
                      <p className="text-xs text-muted-foreground mt-1 opacity-70 max-w-sm mx-auto">
                        Click "Generate Cover Letter" above. Add a job description for better keyword matching and personalization.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 px-5 py-3 text-center" style={{ borderTop: '1px solid var(--md3-outline-variant)', background: 'var(--md3-surface-container)' }}>
                <p className="text-[11px] text-muted-foreground">
                  Generated from your resume data. Always review and personalize before sending.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

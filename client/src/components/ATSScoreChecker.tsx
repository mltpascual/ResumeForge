import { useMemo, useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ChevronRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ATSCheck {
  label: string;
  category: 'contact' | 'content' | 'format' | 'keywords';
  status: 'pass' | 'warn' | 'fail';
  tip: string;
  weight: number;
}

function analyzeATS(resumeData: ReturnType<typeof useResume>['resumeData']): { score: number; checks: ATSCheck[]; grade: string } {
  const pi = resumeData.personalInfo;
  const checks: ATSCheck[] = [];

  // ── Contact Information (weight: high) ──
  checks.push({
    label: 'Full name present',
    category: 'contact',
    status: pi.fullName.trim() ? 'pass' : 'fail',
    tip: 'ATS systems use your name to create a candidate profile.',
    weight: 8,
  });

  checks.push({
    label: 'Professional email',
    category: 'contact',
    status: pi.email.trim()
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email.trim()) ? 'pass' : 'warn'
      : 'fail',
    tip: 'Use a professional email address (e.g., name@gmail.com). Avoid novelty domains.',
    weight: 7,
  });

  checks.push({
    label: 'Phone number included',
    category: 'contact',
    status: pi.phone.trim() ? 'pass' : 'fail',
    tip: 'Recruiters need a direct way to reach you. Include country code for international roles.',
    weight: 6,
  });

  checks.push({
    label: 'Location specified',
    category: 'contact',
    status: pi.location.trim() ? 'pass' : 'warn',
    tip: 'Many ATS filter by location. Include city and state/country.',
    weight: 4,
  });

  checks.push({
    label: 'LinkedIn profile',
    category: 'contact',
    status: pi.linkedin.trim() ? 'pass' : 'warn',
    tip: 'LinkedIn profiles help recruiters verify your background and network.',
    weight: 3,
  });

  // ── Content Quality (weight: high) ──
  const summaryWords = pi.summary.trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    label: 'Professional summary',
    category: 'content',
    status: summaryWords >= 30 ? 'pass' : summaryWords >= 10 ? 'warn' : 'fail',
    tip: `Your summary has ${summaryWords} words. Aim for 30–60 words with relevant keywords from your target role.`,
    weight: 10,
  });

  checks.push({
    label: 'Job title specified',
    category: 'content',
    status: pi.title.trim() ? 'pass' : 'fail',
    tip: 'A clear job title helps ATS match you to relevant positions.',
    weight: 8,
  });

  // Experience checks
  const filledExperiences = resumeData.experiences.filter(e => e.position.trim() && e.company.trim());
  checks.push({
    label: 'Work experience entries',
    category: 'content',
    status: filledExperiences.length >= 2 ? 'pass' : filledExperiences.length >= 1 ? 'warn' : 'fail',
    tip: `You have ${filledExperiences.length} experience entries. Most recruiters expect 2–5 relevant positions.`,
    weight: 10,
  });

  // Check experience descriptions have quantifiable achievements
  const expWithDescriptions = filledExperiences.filter(e => e.description.trim().length >= 50);
  checks.push({
    label: 'Detailed experience descriptions',
    category: 'content',
    status: filledExperiences.length === 0
      ? 'fail'
      : expWithDescriptions.length === filledExperiences.length
        ? 'pass'
        : expWithDescriptions.length > 0 ? 'warn' : 'fail',
    tip: `${expWithDescriptions.length}/${filledExperiences.length} positions have detailed descriptions. Use bullet points with measurable achievements.`,
    weight: 8,
  });

  // Check for quantifiable metrics in descriptions
  const allDescriptions = resumeData.experiences.map(e => e.description).join(' ');
  const hasNumbers = /\d+%|\d+\+|\$\d+|\d+ (year|month|team|user|client|project|product)/i.test(allDescriptions);
  checks.push({
    label: 'Quantifiable achievements',
    category: 'content',
    status: hasNumbers ? 'pass' : filledExperiences.length > 0 ? 'warn' : 'fail',
    tip: 'Use numbers to quantify impact (e.g., "increased sales by 25%", "managed team of 8").',
    weight: 7,
  });

  // Check for action verbs
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'designed', 'implemented', 'built', 'launched', 'improved', 'increased', 'reduced', 'achieved', 'delivered', 'established', 'optimized', 'streamlined', 'coordinated', 'analyzed', 'spearheaded', 'mentored', 'architected', 'automated', 'collaborated', 'executed', 'generated', 'negotiated', 'pioneered', 'resolved', 'transformed'];
  const descLower = allDescriptions.toLowerCase();
  const usedVerbs = actionVerbs.filter(v => descLower.includes(v));
  checks.push({
    label: 'Action verbs in descriptions',
    category: 'content',
    status: usedVerbs.length >= 3 ? 'pass' : usedVerbs.length >= 1 ? 'warn' : 'fail',
    tip: `Found ${usedVerbs.length} action verbs. Start bullet points with strong verbs like "Led", "Developed", "Optimized".`,
    weight: 5,
  });

  // Experience date consistency
  const expWithDates = filledExperiences.filter(e => e.startDate.trim());
  checks.push({
    label: 'Experience dates included',
    category: 'content',
    status: filledExperiences.length === 0
      ? 'fail'
      : expWithDates.length === filledExperiences.length
        ? 'pass'
        : expWithDates.length > 0 ? 'warn' : 'fail',
    tip: 'ATS systems parse dates to calculate experience duration. Always include start and end dates.',
    weight: 6,
  });

  // Education
  const filledEducation = resumeData.education.filter(e => e.institution.trim() && e.degree.trim());
  checks.push({
    label: 'Education section',
    category: 'content',
    status: filledEducation.length >= 1 ? 'pass' : 'warn',
    tip: 'Include at least one education entry with degree and institution name.',
    weight: 6,
  });

  // ── Keywords & Skills (weight: high) ──
  const skillsList = resumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
  checks.push({
    label: 'Skills section populated',
    category: 'keywords',
    status: skillsList.length >= 6 ? 'pass' : skillsList.length >= 3 ? 'warn' : 'fail',
    tip: `You have ${skillsList.length} skills listed. Aim for 8–15 relevant skills matching job descriptions.`,
    weight: 10,
  });

  // Check skill diversity (technical vs soft)
  const softSkills = ['leadership', 'communication', 'teamwork', 'problem solving', 'problem-solving', 'critical thinking', 'time management', 'collaboration', 'adaptability', 'creativity', 'mentoring', 'presentation', 'negotiation', 'project management', 'strategic planning', 'agile', 'scrum'];
  const hasSoftSkills = skillsList.some(s => softSkills.some(ss => s.toLowerCase().includes(ss)));
  const hasTechnicalSkills = skillsList.length > 0 && skillsList.some(s => !softSkills.some(ss => s.toLowerCase().includes(ss)));
  checks.push({
    label: 'Balanced skill types',
    category: 'keywords',
    status: hasSoftSkills && hasTechnicalSkills ? 'pass' : skillsList.length >= 3 ? 'warn' : 'fail',
    tip: 'Mix technical and soft skills. ATS often scan for both hard skills (tools, languages) and soft skills (leadership, communication).',
    weight: 5,
  });

  // Check if skills appear in experience descriptions (keyword consistency)
  const skillsInDesc = skillsList.filter(s => descLower.includes(s.toLowerCase()));
  checks.push({
    label: 'Skills reinforced in experience',
    category: 'keywords',
    status: skillsList.length === 0
      ? 'fail'
      : skillsInDesc.length >= Math.ceil(skillsList.length * 0.3)
        ? 'pass'
        : skillsInDesc.length > 0 ? 'warn' : 'fail',
    tip: `${skillsInDesc.length}/${skillsList.length} skills appear in your experience descriptions. Weave key skills into your work descriptions for higher ATS relevance.`,
    weight: 7,
  });

  // ── Formatting (weight: medium) ──
  checks.push({
    label: 'Consistent section structure',
    category: 'format',
    status: filledExperiences.length > 0 && filledEducation.length > 0 && skillsList.length > 0 ? 'pass' : 'warn',
    tip: 'ATS expects standard sections: Contact, Summary, Experience, Education, Skills. Missing sections reduce parseability.',
    weight: 6,
  });

  // Check resume length (word count)
  const allText = [
    pi.fullName, pi.title, pi.email, pi.summary,
    ...resumeData.experiences.flatMap(e => [e.position, e.company, e.description]),
    ...resumeData.education.flatMap(e => [e.institution, e.degree, e.field, e.description]),
    resumeData.skills,
    ...resumeData.projects.flatMap(p => [p.name, p.description, p.technologies]),
    ...resumeData.certifications.flatMap(c => [c.name, c.issuer]),
  ].join(' ');
  const totalWords = allText.split(/\s+/).filter(Boolean).length;
  checks.push({
    label: 'Resume length',
    category: 'format',
    status: totalWords >= 200 && totalWords <= 800 ? 'pass' : totalWords >= 100 ? 'warn' : 'fail',
    tip: `Your resume has ~${totalWords} words. Aim for 300–600 words for a single-page resume, or 500–800 for two pages.`,
    weight: 4,
  });

  // Certifications bonus
  const filledCerts = resumeData.certifications.filter(c => c.name.trim());
  checks.push({
    label: 'Certifications included',
    category: 'keywords',
    status: filledCerts.length >= 1 ? 'pass' : 'warn',
    tip: 'Certifications add credibility and are keyword-rich. Include relevant ones if you have them.',
    weight: 3,
  });

  // Calculate weighted score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.reduce((sum, c) => {
    if (c.status === 'pass') return sum + c.weight;
    if (c.status === 'warn') return sum + c.weight * 0.5;
    return sum;
  }, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  // Grade
  let grade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B+';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C+';
  else if (score >= 50) grade = 'C';
  else if (score >= 40) grade = 'D';

  return { score, checks, grade };
}

function getScoreColor(score: number) {
  if (score >= 80) return '#15803D';
  if (score >= 60) return '#A16207';
  if (score >= 40) return '#C2410C';
  return '#B91C1C';
}

function getStatusIcon(status: 'pass' | 'warn' | 'fail') {
  if (status === 'pass') return <CheckCircle2 className="size-3.5 shrink-0" style={{ color: '#15803D' }} />;
  if (status === 'warn') return <AlertTriangle className="size-3.5 shrink-0" style={{ color: '#A16207' }} />;
  return <XCircle className="size-3.5 shrink-0" style={{ color: '#B91C1C' }} />;
}

function getCategoryLabel(cat: string) {
  switch (cat) {
    case 'contact': return 'Contact Info';
    case 'content': return 'Content Quality';
    case 'format': return 'Formatting';
    case 'keywords': return 'Keywords & Skills';
    default: return cat;
  }
}

export default function ATSScoreChecker() {
  const { resumeData } = useResume();
  const [expanded, setExpanded] = useState(false);

  const { score, checks, grade } = useMemo(() => analyzeATS(resumeData), [resumeData]);

  const color = getScoreColor(score);
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  const categories = ['contact', 'content', 'keywords', 'format'] as const;

  return (
    <>
      {/* Compact badge in bottom bar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="relative size-7 shrink-0">
              <svg viewBox="0 0 36 36" className="size-7 -rotate-90">
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke="var(--md3-outline-variant)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - score / 100) }}
                  transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-[7px] font-mono-accent font-bold"
                style={{ color }}
              >
                {grade}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" style={{ color }} />
              <span className="text-xs font-medium" style={{ color }}>
                ATS {score}%
              </span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          <p className="text-xs">ATS Compatibility Score — Click for details</p>
        </TooltipContent>
      </Tooltip>

      {/* Expanded panel */}
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="relative w-full max-w-lg max-h-[85vh] rounded-2xl overflow-hidden flex flex-col mx-4"
              style={{ background: 'var(--md3-surface-container-lowest)', border: '1px solid var(--md3-outline-variant)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="shrink-0 p-5 pb-4 flex items-start justify-between" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <ShieldCheck className="size-5" style={{ color }} />
                    <h3 className="font-display text-lg font-semibold">ATS Compatibility</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-3xl font-bold" style={{ color }}>{score}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `${color}18`,
                        color,
                      }}
                    >
                      Grade: {grade}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><CheckCircle2 className="size-3" style={{ color: '#15803D' }} />{passCount}</span>
                      <span className="flex items-center gap-1"><AlertTriangle className="size-3" style={{ color: '#A16207' }} />{warnCount}</span>
                      <span className="flex items-center gap-1"><XCircle className="size-3" style={{ color: '#B91C1C' }} />{failCount}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-9 rounded-full shrink-0" onClick={() => setExpanded(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              {/* Score bar */}
              <div className="shrink-0 px-5 py-3" style={{ background: 'var(--md3-surface-container)' }}>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--md3-outline-variant)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
                  />
                </div>
              </div>

              {/* Checks list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {categories.map(cat => {
                  const catChecks = checks.filter(c => c.category === cat);
                  const catPass = catChecks.filter(c => c.status === 'pass').length;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                          {getCategoryLabel(cat)}
                        </h4>
                        <span className="text-[10px] font-mono-accent text-muted-foreground">
                          {catPass}/{catChecks.length} passed
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {catChecks.map((check, i) => (
                          <div
                            key={i}
                            className="group flex items-start gap-2.5 p-2.5 rounded-xl transition-colors hover:bg-[var(--md3-surface-container)]"
                          >
                            <div className="mt-0.5">{getStatusIcon(check.status)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{check.label}</span>
                                <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{check.tip}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="shrink-0 px-5 py-3 text-center" style={{ borderTop: '1px solid var(--md3-outline-variant)', background: 'var(--md3-surface-container)' }}>
                <p className="text-[11px] text-muted-foreground">
                  Score is based on common ATS parsing patterns. Tailor your resume to each job description for best results.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

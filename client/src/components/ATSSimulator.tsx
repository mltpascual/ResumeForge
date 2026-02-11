import { useState, useMemo } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronRight,
  Info, Shield, Zap, Building2, BarChart3,
} from 'lucide-react';
import type { ResumeData, Experience, Education, Project, Certification } from '@/types/resume';

// ─── ATS Platform Definitions ───────────────────────────────────────────────

interface ATSPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  parsingRules: ParsingRules;
}

interface ParsingRules {
  // How well the ATS handles different formatting
  handlesMultiColumn: boolean;
  handlesTables: boolean;
  handlesHeaders: boolean;
  handlesSpecialChars: boolean;
  maxSummaryLength: number;
  preferredDateFormat: string;
  skillsDelimiter: 'comma' | 'pipe' | 'newline';
  sectionLabels: Record<string, string[]>;
  fieldMapping: Record<string, string>;
  quirks: string[];
}

interface ParsedField {
  label: string;
  value: string;
  status: 'parsed' | 'partial' | 'missing' | 'warning';
  note?: string;
}

interface ParsedSection {
  name: string;
  status: 'parsed' | 'partial' | 'missing';
  fields: ParsedField[];
  warnings: string[];
}

interface SimulationResult {
  platform: ATSPlatform;
  overallScore: number;
  sections: ParsedSection[];
  warnings: string[];
  tips: string[];
}

// ─── ATS Platform Configurations ────────────────────────────────────────────

const ATS_PLATFORMS: ATSPlatform[] = [
  {
    id: 'workday',
    name: 'Workday',
    icon: '🏢',
    color: '#0875E1',
    description: 'Enterprise HRIS used by Fortune 500 companies',
    parsingRules: {
      handlesMultiColumn: false,
      handlesTables: false,
      handlesHeaders: true,
      handlesSpecialChars: false,
      maxSummaryLength: 2000,
      preferredDateFormat: 'MM/YYYY',
      skillsDelimiter: 'comma',
      sectionLabels: {
        experience: ['Work Experience', 'Professional Experience', 'Employment History'],
        education: ['Education', 'Academic Background'],
        skills: ['Skills', 'Technical Skills', 'Core Competencies'],
        projects: ['Projects', 'Key Projects'],
        certifications: ['Certifications', 'Licenses & Certifications'],
      },
      fieldMapping: {
        fullName: 'Legal Name',
        title: 'Current Job Title',
        email: 'Email Address',
        phone: 'Phone Number',
        location: 'Current Location',
        website: 'Personal Website',
        linkedin: 'LinkedIn URL',
      },
      quirks: [
        'Strips formatting from multi-column layouts',
        'May truncate summaries over 2000 characters',
        'Requires explicit section headers for parsing',
        'Special characters in bullets may not render',
      ],
    },
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    icon: '🌿',
    color: '#3AB549',
    description: 'Popular ATS for tech startups and mid-size companies',
    parsingRules: {
      handlesMultiColumn: true,
      handlesTables: true,
      handlesHeaders: true,
      handlesSpecialChars: true,
      maxSummaryLength: 5000,
      preferredDateFormat: 'Mon YYYY',
      skillsDelimiter: 'comma',
      sectionLabels: {
        experience: ['Experience', 'Work Experience', 'Professional Experience', 'Employment'],
        education: ['Education', 'Academic'],
        skills: ['Skills', 'Technologies', 'Technical Skills'],
        projects: ['Projects', 'Portfolio'],
        certifications: ['Certifications', 'Certificates'],
      },
      fieldMapping: {
        fullName: 'Full Name',
        title: 'Headline',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        website: 'Website',
        linkedin: 'LinkedIn',
      },
      quirks: [
        'Generally good at parsing most formats',
        'May merge adjacent sections without clear headers',
        'LinkedIn URL auto-linked to profile',
      ],
    },
  },
  {
    id: 'lever',
    name: 'Lever',
    icon: '⚡',
    color: '#5C5CE0',
    description: 'Modern ATS focused on collaborative hiring',
    parsingRules: {
      handlesMultiColumn: true,
      handlesTables: false,
      handlesHeaders: true,
      handlesSpecialChars: true,
      maxSummaryLength: 3000,
      preferredDateFormat: 'YYYY-MM',
      skillsDelimiter: 'comma',
      sectionLabels: {
        experience: ['Experience', 'Work History', 'Professional Background'],
        education: ['Education', 'Degrees'],
        skills: ['Skills', 'Expertise', 'Competencies'],
        projects: ['Projects', 'Work Samples'],
        certifications: ['Certifications', 'Credentials'],
      },
      fieldMapping: {
        fullName: 'Name',
        title: 'Current Title',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        website: 'Portfolio',
        linkedin: 'LinkedIn Profile',
      },
      quirks: [
        'Tables may be flattened into plain text',
        'Excellent at extracting contact information',
        'Tags skills automatically from resume content',
      ],
    },
  },
  {
    id: 'taleo',
    name: 'Taleo (Oracle)',
    icon: '🔴',
    color: '#C74634',
    description: 'Legacy enterprise ATS used by large corporations',
    parsingRules: {
      handlesMultiColumn: false,
      handlesTables: false,
      handlesHeaders: false,
      handlesSpecialChars: false,
      maxSummaryLength: 1500,
      preferredDateFormat: 'MM/DD/YYYY',
      skillsDelimiter: 'newline',
      sectionLabels: {
        experience: ['Work Experience', 'Employment History'],
        education: ['Education'],
        skills: ['Skills'],
        projects: ['Projects'],
        certifications: ['Certifications'],
      },
      fieldMapping: {
        fullName: 'Candidate Name',
        title: 'Position Title',
        email: 'E-mail',
        phone: 'Telephone',
        location: 'Address',
        website: 'URL',
        linkedin: 'Social Profile',
      },
      quirks: [
        'Struggles with non-standard formatting',
        'May not recognize creative section headers',
        'Truncates summaries over 1500 characters',
        'Special characters often stripped or corrupted',
        'Multi-column layouts completely broken',
        'Requires very explicit, standard section names',
      ],
    },
  },
  {
    id: 'icims',
    name: 'iCIMS',
    icon: '🔵',
    color: '#0066CC',
    description: 'Cloud-based talent acquisition platform',
    parsingRules: {
      handlesMultiColumn: false,
      handlesTables: true,
      handlesHeaders: true,
      handlesSpecialChars: true,
      maxSummaryLength: 4000,
      preferredDateFormat: 'MM/YYYY',
      skillsDelimiter: 'comma',
      sectionLabels: {
        experience: ['Experience', 'Work Experience', 'Professional Experience'],
        education: ['Education', 'Academic History'],
        skills: ['Skills', 'Technical Skills', 'Key Skills'],
        projects: ['Projects', 'Notable Projects'],
        certifications: ['Certifications', 'Professional Certifications'],
      },
      fieldMapping: {
        fullName: 'Applicant Name',
        title: 'Job Title',
        email: 'Email Address',
        phone: 'Contact Number',
        location: 'City/State',
        website: 'Website URL',
        linkedin: 'LinkedIn URL',
      },
      quirks: [
        'Multi-column layouts may lose ordering',
        'Good at extracting structured data',
        'May auto-categorize skills from descriptions',
      ],
    },
  },
];

// ─── Parsing Engine ─────────────────────────────────────────────────────────

function simulateATSParsing(resume: ResumeData, platform: ATSPlatform): SimulationResult {
  const { parsingRules } = platform;
  const sections: ParsedSection[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];
  let totalScore = 0;
  let maxScore = 0;

  // ── Contact Information ──
  const contactFields: ParsedField[] = [];
  const pi = resume.personalInfo;

  const addContactField = (label: string, value: string, mappedLabel: string) => {
    if (value && value.trim()) {
      contactFields.push({ label: mappedLabel, value: value.trim(), status: 'parsed' });
      totalScore += 10;
    } else {
      contactFields.push({ label: mappedLabel, value: '—', status: 'missing', note: 'Not provided' });
    }
    maxScore += 10;
  };

  addContactField('Name', pi.fullName, parsingRules.fieldMapping.fullName);
  addContactField('Title', pi.title, parsingRules.fieldMapping.title);
  addContactField('Email', pi.email, parsingRules.fieldMapping.email);
  addContactField('Phone', pi.phone, parsingRules.fieldMapping.phone);
  addContactField('Location', pi.location, parsingRules.fieldMapping.location);

  // Website & LinkedIn — some ATS handle these differently
  if (pi.website) {
    const websiteStatus = pi.website.startsWith('http') ? 'parsed' : 'warning';
    contactFields.push({
      label: parsingRules.fieldMapping.website,
      value: pi.website,
      status: websiteStatus,
      note: websiteStatus === 'warning' ? 'Missing protocol (https://) — may not be clickable' : undefined,
    });
    totalScore += websiteStatus === 'parsed' ? 10 : 7;
  } else {
    contactFields.push({ label: parsingRules.fieldMapping.website, value: '—', status: 'missing' });
  }
  maxScore += 10;

  if (pi.linkedin) {
    const linkedinStatus = pi.linkedin.includes('linkedin.com') ? 'parsed' : 'warning';
    contactFields.push({
      label: parsingRules.fieldMapping.linkedin,
      value: pi.linkedin,
      status: linkedinStatus,
      note: linkedinStatus === 'warning' ? 'May not be recognized as LinkedIn profile' : undefined,
    });
    totalScore += linkedinStatus === 'parsed' ? 10 : 7;
  } else {
    contactFields.push({ label: parsingRules.fieldMapping.linkedin, value: '—', status: 'missing' });
  }
  maxScore += 10;

  const contactWarnings: string[] = [];
  if (!pi.email) contactWarnings.push('Missing email address — critical for recruiter contact');
  if (!pi.phone) contactWarnings.push('Missing phone number — many recruiters prefer phone outreach');
  if (!pi.fullName) contactWarnings.push('Missing name — cannot create candidate profile');

  const contactParsed = contactFields.filter(f => f.status === 'parsed').length;
  const contactStatus = contactParsed >= 5 ? 'parsed' : contactParsed >= 3 ? 'partial' : 'missing';

  sections.push({
    name: 'Contact Information',
    status: contactStatus,
    fields: contactFields,
    warnings: contactWarnings,
  });

  // ── Summary / Objective ──
  const summaryFields: ParsedField[] = [];
  const summaryWarnings: string[] = [];
  maxScore += 15;

  if (pi.summary) {
    const summaryLen = pi.summary.length;
    if (summaryLen > parsingRules.maxSummaryLength) {
      summaryFields.push({
        label: 'Professional Summary',
        value: pi.summary.substring(0, parsingRules.maxSummaryLength) + '...',
        status: 'warning',
        note: `Truncated from ${summaryLen} to ${parsingRules.maxSummaryLength} characters`,
      });
      summaryWarnings.push(`Summary exceeds ${platform.name}'s ${parsingRules.maxSummaryLength} character limit`);
      totalScore += 10;
    } else {
      summaryFields.push({
        label: 'Professional Summary',
        value: pi.summary,
        status: 'parsed',
      });
      totalScore += 15;
    }
  } else {
    summaryFields.push({
      label: 'Professional Summary',
      value: '—',
      status: 'missing',
      note: 'No summary detected',
    });
    summaryWarnings.push('Missing professional summary — reduces keyword matching');
  }

  sections.push({
    name: 'Summary',
    status: pi.summary ? (pi.summary.length > parsingRules.maxSummaryLength ? 'partial' : 'parsed') : 'missing',
    fields: summaryFields,
    warnings: summaryWarnings,
  });

  // ── Experience ──
  const expFields: ParsedField[] = [];
  const expWarnings: string[] = [];
  maxScore += 25;

  if (resume.experiences.length > 0) {
    resume.experiences.forEach((exp: Experience, i: number) => {
      const dateStr = formatDateForATS(exp.startDate, exp.endDate, exp.current, parsingRules.preferredDateFormat);

      // Check for potential parsing issues
      const issues: string[] = [];
      if (!exp.company) issues.push('Missing company name');
      if (!exp.position) issues.push('Missing job title');
      if (!exp.startDate) issues.push('Missing start date');
      if (!exp.description) issues.push('No description — keywords won\'t be extracted');

      // Check for special characters that might break
      if (!parsingRules.handlesSpecialChars && exp.description) {
        const specialChars = exp.description.match(/[•◦▪►→✓★●]/g);
        if (specialChars) {
          issues.push(`Special characters (${specialChars.slice(0, 3).join(', ')}) may be stripped`);
        }
      }

      const status = issues.length === 0 ? 'parsed' : issues.length <= 1 ? 'warning' : 'partial';

      expFields.push({
        label: `Position ${i + 1}`,
        value: `${exp.position || '(untitled)'}${exp.company ? ' at ' + exp.company : ''} — ${dateStr}`,
        status,
        note: issues.length > 0 ? issues.join('; ') : undefined,
      });

      // Description sub-field
      if (exp.description) {
        const descDisplay = !parsingRules.handlesSpecialChars
          ? exp.description.replace(/[•◦▪►→✓★●]/g, '-')
          : exp.description;
        expFields.push({
          label: `  Description`,
          value: descDisplay.length > 200 ? descDisplay.substring(0, 200) + '...' : descDisplay,
          status: !parsingRules.handlesSpecialChars && exp.description !== descDisplay ? 'warning' : 'parsed',
          note: !parsingRules.handlesSpecialChars && exp.description !== descDisplay ? 'Special characters replaced with dashes' : undefined,
        });
      }
    });

    const expIssueCount = expFields.filter(f => f.status !== 'parsed').length;
    totalScore += expIssueCount === 0 ? 25 : expIssueCount <= 2 ? 20 : 12;
  } else {
    expFields.push({ label: 'Work Experience', value: '—', status: 'missing', note: 'No experience entries found' });
    expWarnings.push('No work experience detected — this is a critical section for most ATS');
  }

  sections.push({
    name: 'Work Experience',
    status: resume.experiences.length > 0 ? (expFields.some(f => f.status !== 'parsed') ? 'partial' : 'parsed') : 'missing',
    fields: expFields,
    warnings: expWarnings,
  });

  // ── Education ──
  const eduFields: ParsedField[] = [];
  const eduWarnings: string[] = [];
  maxScore += 15;

  if (resume.education.length > 0) {
    resume.education.forEach((edu: Education, i: number) => {
      const issues: string[] = [];
      if (!edu.institution) issues.push('Missing institution');
      if (!edu.degree) issues.push('Missing degree');

      eduFields.push({
        label: `Education ${i + 1}`,
        value: `${edu.degree || '(no degree)'} in ${edu.field || '(no field)'}${edu.institution ? ' — ' + edu.institution : ''}`,
        status: issues.length === 0 ? 'parsed' : 'partial',
        note: issues.length > 0 ? issues.join('; ') : undefined,
      });

      if (edu.gpa) {
        eduFields.push({
          label: `  GPA`,
          value: edu.gpa,
          status: 'parsed',
        });
      }
    });

    totalScore += eduFields.some(f => f.status !== 'parsed') ? 10 : 15;
  } else {
    eduFields.push({ label: 'Education', value: '—', status: 'missing', note: 'No education entries found' });
    eduWarnings.push('No education detected');
  }

  sections.push({
    name: 'Education',
    status: resume.education.length > 0 ? (eduFields.some(f => f.status !== 'parsed') ? 'partial' : 'parsed') : 'missing',
    fields: eduFields,
    warnings: eduWarnings,
  });

  // ── Skills ──
  const skillsFields: ParsedField[] = [];
  const skillsWarnings: string[] = [];
  maxScore += 20;

  if (resume.skills && resume.skills.trim()) {
    const skillsList = resume.skills.split(',').map(s => s.trim()).filter(Boolean);

    // Show how ATS would parse the skills
    const displayDelimiter = parsingRules.skillsDelimiter === 'pipe' ? ' | ' : parsingRules.skillsDelimiter === 'newline' ? '\n' : ', ';

    skillsFields.push({
      label: 'Detected Skills',
      value: skillsList.join(displayDelimiter),
      status: 'parsed',
      note: `${skillsList.length} skills extracted`,
    });

    // Check skill count
    if (skillsList.length < 5) {
      skillsWarnings.push('Consider adding more skills — 8-15 is optimal for ATS matching');
      totalScore += 12;
    } else if (skillsList.length > 20) {
      skillsWarnings.push('Many skills listed — some ATS may only index the first 15-20');
      totalScore += 15;
    } else {
      totalScore += 20;
    }
  } else {
    skillsFields.push({ label: 'Skills', value: '—', status: 'missing', note: 'No skills section detected' });
    skillsWarnings.push('Missing skills section — critical for keyword matching');
  }

  sections.push({
    name: 'Skills',
    status: resume.skills ? (skillsWarnings.length > 0 ? 'partial' : 'parsed') : 'missing',
    fields: skillsFields,
    warnings: skillsWarnings,
  });

  // ── Projects ──
  const projFields: ParsedField[] = [];
  maxScore += 10;

  if (resume.projects.length > 0) {
    resume.projects.forEach((proj: Project, i: number) => {
      projFields.push({
        label: `Project ${i + 1}`,
        value: `${proj.name || '(untitled)'}${proj.technologies ? ' — ' + proj.technologies : ''}`,
        status: proj.name ? 'parsed' : 'partial',
      });
    });
    totalScore += 10;
  } else {
    projFields.push({ label: 'Projects', value: '—', status: 'missing', note: 'No projects section' });
    totalScore += 3; // Minor section
  }

  sections.push({
    name: 'Projects',
    status: resume.projects.length > 0 ? 'parsed' : 'missing',
    fields: projFields,
    warnings: [],
  });

  // ── Certifications ──
  const certFields: ParsedField[] = [];
  maxScore += 5;

  if (resume.certifications.length > 0) {
    resume.certifications.forEach((cert: Certification, i: number) => {
      certFields.push({
        label: `Certification ${i + 1}`,
        value: `${cert.name || '(untitled)'}${cert.issuer ? ' — ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`,
        status: cert.name ? 'parsed' : 'partial',
      });
    });
    totalScore += 5;
  } else {
    certFields.push({ label: 'Certifications', value: '—', status: 'missing', note: 'No certifications detected' });
    totalScore += 2;
  }

  sections.push({
    name: 'Certifications',
    status: resume.certifications.length > 0 ? 'parsed' : 'missing',
    fields: certFields,
    warnings: [],
  });

  // ── Platform-specific warnings ──
  parsingRules.quirks.forEach(q => warnings.push(q));

  // ── Generate tips ──
  const score = Math.round((totalScore / maxScore) * 100);

  if (score < 70) {
    tips.push('Fill in all contact information fields for better parsing');
    tips.push('Add a professional summary with relevant keywords');
  }
  if (!parsingRules.handlesMultiColumn) {
    tips.push(`${platform.name} struggles with multi-column layouts — use a single-column template for best results`);
  }
  if (!parsingRules.handlesSpecialChars) {
    tips.push(`Avoid special bullet characters (•, ►, ★) — ${platform.name} may strip or corrupt them`);
  }
  if (!parsingRules.handlesTables) {
    tips.push(`${platform.name} cannot parse tables — ensure all content is in standard text format`);
  }
  if (resume.experiences.some(e => !e.description)) {
    tips.push('Add descriptions to all experience entries — ATS extracts keywords from these');
  }
  if (score >= 90) {
    tips.push(`Your resume is well-optimized for ${platform.name}!`);
  }

  return {
    platform,
    overallScore: Math.min(score, 100),
    sections,
    warnings,
    tips,
  };
}

function formatDateForATS(start: string, end: string, current: boolean, format: string): string {
  const formatSingle = (d: string) => {
    if (!d) return '?';
    if (format === 'MM/YYYY' && d.includes('-')) {
      const [y, m] = d.split('-');
      return `${m || '01'}/${y}`;
    }
    if (format === 'Mon YYYY' && d.includes('-')) {
      const [y, m] = d.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(m || '1') - 1] || 'Jan'} ${y}`;
    }
    return d;
  };
  return `${formatSingle(start)} — ${current ? 'Present' : formatSingle(end)}`;
}

// ─── Status Icon Helper ─────────────────────────────────────────────────────

function StatusIcon({ status }: { status: 'parsed' | 'partial' | 'missing' | 'warning' }) {
  switch (status) {
    case 'parsed':
      return <CheckCircle2 className="size-4 shrink-0 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="size-4 shrink-0 text-amber-500" />;
    case 'partial':
      return <AlertTriangle className="size-4 shrink-0 text-orange-500" />;
    case 'missing':
      return <XCircle className="size-4 shrink-0 text-red-400" />;
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface ATSSimulatorProps {
  isVisible: boolean;
}

export default function ATSSimulator({ isVisible }: ATSSimulatorProps) {
  const { resumeData } = useResume();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('workday');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Contact Information', 'Work Experience']));

  const result = useMemo(() => {
    const platform = ATS_PLATFORMS.find(p => p.id === selectedPlatform);
    if (!platform) return null;
    return simulateATSParsing(resumeData, platform);
  }, [resumeData, selectedPlatform]);

  const toggleSection = (name: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (!isVisible || !result) return null;

  const scoreColor = result.overallScore >= 85 ? '#3AB549' : result.overallScore >= 65 ? '#E6A817' : '#DC3545';
  const scoreLabel = result.overallScore >= 85 ? 'Excellent' : result.overallScore >= 65 ? 'Good' : 'Needs Work';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="w-full max-w-md flex flex-col h-full"
      style={{ background: 'var(--md3-surface-container)', borderLeft: '1px solid var(--md3-outline-variant)' }}
    >
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="size-5" style={{ color: 'var(--md3-primary)' }} />
          <h3 className="font-display text-sm font-semibold" style={{ color: 'var(--md3-on-surface)' }}>ATS Simulation</h3>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--md3-on-surface-variant)' }}>
          See how different ATS platforms would parse your resume
        </p>

        {/* Platform Selector */}
        <div className="flex flex-wrap gap-1.5">
          {ATS_PLATFORMS.map(platform => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: selectedPlatform === platform.id ? platform.color + '18' : 'var(--md3-surface-container-high)',
                color: selectedPlatform === platform.id ? platform.color : 'var(--md3-on-surface-variant)',
                border: selectedPlatform === platform.id ? `1.5px solid ${platform.color}` : '1.5px solid transparent',
              }}
            >
              <span>{platform.icon}</span>
              <span>{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Score Card */}
        <div className="rounded-xl p-4" style={{ background: 'var(--md3-surface-container-low)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--md3-on-surface-variant)' }}>
                {result.platform.name} Parse Score
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold" style={{ color: scoreColor }}>
                  {result.overallScore}%
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: scoreColor + '20', color: scoreColor }}>
                  {scoreLabel}
                </span>
              </div>
            </div>
            <div className="relative size-14">
              <svg viewBox="0 0 56 56" className="size-14 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="var(--md3-outline-variant)" strokeWidth="4" opacity="0.3" />
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke={scoreColor} strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${(result.overallScore / 100) * 150.8} 150.8`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="size-5" style={{ color: scoreColor }} />
              </div>
            </div>
          </div>

          {/* Section status summary */}
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-green-500" />
              {result.sections.filter(s => s.status === 'parsed').length} parsed
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-500" />
              {result.sections.filter(s => s.status === 'partial').length} partial
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-red-400" />
              {result.sections.filter(s => s.status === 'missing').length} missing
            </span>
          </div>
        </div>

        {/* Platform Info */}
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ background: result.platform.color + '0A', border: `1px solid ${result.platform.color}25` }}>
          <Info className="size-3.5 shrink-0 mt-0.5" style={{ color: result.platform.color }} />
          <span style={{ color: 'var(--md3-on-surface-variant)' }}>{result.platform.description}</span>
        </div>

        {/* Parsed Sections */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--md3-on-surface-variant)' }}>
            Parsed Sections
          </h4>

          {result.sections.map(section => {
            const isExpanded = expandedSections.has(section.name);
            return (
              <div key={section.name} className="rounded-lg overflow-hidden" style={{ background: 'var(--md3-surface-container-low)', border: '1px solid var(--md3-outline-variant)' }}>
                <button
                  onClick={() => toggleSection(section.name)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:opacity-80"
                >
                  <StatusIcon status={section.status} />
                  <span className="flex-1 text-xs font-medium" style={{ color: 'var(--md3-on-surface)' }}>
                    {section.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                    background: section.status === 'parsed' ? '#3AB54920' : section.status === 'partial' ? '#E6A81720' : '#DC354520',
                    color: section.status === 'parsed' ? '#3AB549' : section.status === 'partial' ? '#E6A817' : '#DC3545',
                  }}>
                    {section.status}
                  </span>
                  {isExpanded ? <ChevronDown className="size-3.5" style={{ color: 'var(--md3-on-surface-variant)' }} /> : <ChevronRight className="size-3.5" style={{ color: 'var(--md3-on-surface-variant)' }} />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-1.5" style={{ borderTop: '1px solid var(--md3-outline-variant)' }}>
                        <div className="pt-2" />
                        {section.fields.map((field, fi) => (
                          <div key={fi} className="flex items-start gap-2 py-1">
                            <StatusIcon status={field.status} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: 'var(--md3-on-surface-variant)' }}>
                                {field.label}
                              </div>
                              <div className="text-xs break-words" style={{ color: 'var(--md3-on-surface)', fontFamily: 'monospace', fontSize: '11px' }}>
                                {field.value}
                              </div>
                              {field.note && (
                                <div className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: field.status === 'warning' ? '#E6A817' : field.status === 'missing' ? '#DC3545' : 'var(--md3-on-surface-variant)' }}>
                                  <AlertTriangle className="size-2.5" />
                                  {field.note}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {section.warnings.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {section.warnings.map((w, wi) => (
                              <div key={wi} className="flex items-start gap-1.5 text-[10px] px-2 py-1.5 rounded" style={{ background: '#DC354510', color: '#DC3545' }}>
                                <AlertTriangle className="size-3 shrink-0 mt-0.5" />
                                {w}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Platform Quirks */}
        {result.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--md3-on-surface-variant)' }}>
              <Shield className="size-3.5" />
              {result.platform.name} Known Behaviors
            </h4>
            <div className="space-y-1.5">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--md3-surface-container-low)' }}>
                  <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <span style={{ color: 'var(--md3-on-surface-variant)' }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {result.tips.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--md3-on-surface-variant)' }}>
              <Zap className="size-3.5" />
              Optimization Tips
            </h4>
            <div className="space-y-1.5">
              {result.tips.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--md3-primary)' + '08' }}>
                  <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" style={{ color: 'var(--md3-primary)' }} />
                  <span style={{ color: 'var(--md3-on-surface-variant)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare All Platforms */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--md3-on-surface-variant)' }}>
            <Building2 className="size-3.5" />
            Cross-Platform Comparison
          </h4>
          <div className="rounded-lg overflow-hidden" style={{ background: 'var(--md3-surface-container-low)', border: '1px solid var(--md3-outline-variant)' }}>
            {ATS_PLATFORMS.map(platform => {
              const sim = simulateATSParsing(resumeData, platform);
              const barColor = sim.overallScore >= 85 ? '#3AB549' : sim.overallScore >= 65 ? '#E6A817' : '#DC3545';
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors hover:opacity-80"
                  style={{
                    borderBottom: '1px solid var(--md3-outline-variant)',
                    background: selectedPlatform === platform.id ? 'var(--md3-primary)' + '08' : 'transparent',
                  }}
                >
                  <span className="text-sm">{platform.icon}</span>
                  <span className="flex-1 text-xs font-medium text-left" style={{ color: 'var(--md3-on-surface)' }}>
                    {platform.name}
                  </span>
                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--md3-outline-variant)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sim.overallScore}%`, background: barColor }} />
                  </div>
                  <span className="text-xs font-mono font-medium w-8 text-right" style={{ color: barColor }}>
                    {sim.overallScore}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </motion.div>
  );
}

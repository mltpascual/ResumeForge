import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const TIPS: Record<string, { title: string; tips: string[] }> = {
  personal: {
    title: 'Personal Info Tips',
    tips: [
      'Use a professional email address (firstname.lastname@email.com)',
      'Include a LinkedIn URL — recruiters check it 87% of the time',
      'Add your city and state, not your full street address',
      'Write a compelling 2-3 sentence summary highlighting your unique value',
      'Include a portfolio or personal website if relevant to your field',
    ],
  },
  experience: {
    title: 'Experience Tips',
    tips: [
      'Start each bullet with a strong action verb: Led, Built, Designed, Increased, Reduced',
      'Quantify achievements: "Increased revenue by 25%" beats "Improved sales"',
      'Use the XYZ formula: Accomplished [X] as measured by [Y] by doing [Z]',
      'List your most recent position first (reverse chronological)',
      'Focus on impact and results, not just responsibilities',
      'Keep descriptions to 3-5 bullet points per role',
    ],
  },
  education: {
    title: 'Education Tips',
    tips: [
      'Include GPA only if 3.5+ or if you\'re a recent graduate',
      'List relevant coursework, honors, or thesis topics',
      'For experienced professionals, keep education brief — 1-2 lines',
      'Include study abroad, relevant extracurriculars, or leadership roles',
    ],
  },
  skills: {
    title: 'Skills Tips',
    tips: [
      'Mix hard skills (Python, Figma, SQL) with soft skills (Leadership, Communication)',
      'Match skills to the job description keywords for ATS optimization',
      'Group skills by category if you have many (e.g., Languages, Tools, Frameworks)',
      'Remove outdated or basic skills (e.g., Microsoft Word, typing)',
      'Include certifications and proficiency levels where relevant',
    ],
  },
  projects: {
    title: 'Projects Tips',
    tips: [
      'Include a link to live demos or GitHub repositories',
      'Describe the problem solved, your approach, and the outcome',
      'List the tech stack used for each project',
      'Highlight projects relevant to the target role',
      'Include personal, open-source, or freelance projects',
    ],
  },
  certifications: {
    title: 'Certifications Tips',
    tips: [
      'List the most relevant certifications first',
      'Include the issuing organization and date obtained',
      'Add credential IDs or verification links if available',
      'Remove expired certifications unless they\'re still relevant',
    ],
  },
};

export default function SectionTips({ section }: { section: string }) {
  const [expanded, setExpanded] = useState(false);
  const tipData = TIPS[section];
  if (!tipData) return null;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: 'var(--md3-tertiary-container, #f0e6ff)',
        border: '1px solid var(--md3-outline-variant)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:opacity-80"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="size-3.5" style={{ color: 'var(--md3-tertiary, #7c5800)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--md3-on-tertiary-container, #2b1700)' }}>
            {tipData.title}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="px-3.5 pb-3 space-y-1.5">
          {tipData.tips.map((tip, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span
                className="mt-1.5 size-1.5 rounded-full shrink-0"
                style={{ background: 'var(--md3-tertiary, #7c5800)' }}
              />
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--md3-on-tertiary-container, #2b1700)', opacity: 0.85 }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

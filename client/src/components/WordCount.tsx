import { useMemo, useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';

function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface SectionCount {
  name: string;
  words: number;
  ideal: [number, number]; // min, max ideal range
}

export default function WordCount() {
  const { resumeData } = useResume();
  const [expanded, setExpanded] = useState(false);

  const sections = useMemo<SectionCount[]>(() => {
    const { personalInfo, experiences, education, skills, projects, certifications } = resumeData;

    const result: SectionCount[] = [];

    // Summary
    result.push({
      name: 'Summary',
      words: countWords(personalInfo.summary),
      ideal: [30, 60],
    });

    // Experience (all combined)
    const expWords = experiences.reduce((sum, exp) => sum + countWords(exp.description) + countWords(exp.position) + countWords(exp.company), 0);
    result.push({
      name: 'Experience',
      words: expWords,
      ideal: [80, 250],
    });

    // Education
    const eduWords = education.reduce((sum, edu) => sum + countWords(edu.description) + countWords(edu.degree) + countWords(edu.field) + countWords(edu.institution), 0);
    result.push({
      name: 'Education',
      words: eduWords,
      ideal: [20, 80],
    });

    // Skills
    result.push({
      name: 'Skills',
      words: countWords(skills),
      ideal: [10, 40],
    });

    // Projects
    const projWords = projects.reduce((sum, p) => sum + countWords(p.name) + countWords(p.description) + countWords(p.technologies), 0);
    result.push({
      name: 'Projects',
      words: projWords,
      ideal: [20, 100],
    });

    // Certifications
    const certWords = certifications.reduce((sum, c) => sum + countWords(c.name) + countWords(c.issuer), 0);
    result.push({
      name: 'Certifications',
      words: certWords,
      ideal: [5, 30],
    });

    return result;
  }, [resumeData]);

  const totalWords = sections.reduce((sum, s) => sum + s.words, 0);
  const readingTime = Math.max(1, Math.ceil(totalWords / 200)); // ~200 wpm average

  const getBarColor = (words: number, ideal: [number, number]) => {
    if (words === 0) return 'var(--md3-outline-variant)';
    if (words < ideal[0]) return 'var(--md3-tertiary, #f59e0b)';
    if (words > ideal[1]) return 'var(--md3-error, #ef4444)';
    return 'var(--md3-primary)';
  };

  const getBarWidth = (words: number, ideal: [number, number]) => {
    const max = ideal[1] * 1.5;
    return Math.min(100, (words / max) * 100);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors hover:bg-accent/10 relative"
      >
        <BarChart3 className="size-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground">
          {totalWords} words · {readingTime} min read
        </span>
        {expanded ? (
          <ChevronDown className="size-3 text-muted-foreground" />
        ) : (
          <ChevronUp className="size-3 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div
          className="absolute bottom-full left-0 right-0 mb-1 p-3 rounded-xl shadow-lg z-10"
          style={{
            background: 'var(--md3-surface-container)',
            border: '1px solid var(--md3-outline-variant)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-display font-semibold">Word Count by Section</span>
            <span className="text-[10px] text-muted-foreground">{totalWords} total · ~{readingTime} min</span>
          </div>
          <div className="space-y-2">
            {sections.map(section => (
              <div key={section.name} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium">{section.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {section.words} / {section.ideal[0]}–{section.ideal[1]}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--md3-surface-container-high)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${getBarWidth(section.words, section.ideal)}%`,
                      background: getBarColor(section.words, section.ideal),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 flex gap-3 text-[9px] text-muted-foreground" style={{ borderTop: '1px solid var(--md3-outline-variant)' }}>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ background: 'var(--md3-primary)' }} /> In range
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ background: 'var(--md3-tertiary, #f59e0b)' }} /> Too short
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ background: 'var(--md3-error, #ef4444)' }} /> Too long
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

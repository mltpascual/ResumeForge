import { useMemo } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface CheckItem {
  label: string;
  filled: boolean;
}

export default function ResumeCompleteness() {
  const { resumeData } = useResume();

  const { score, checks } = useMemo(() => {
    const pi = resumeData.personalInfo;
    const items: CheckItem[] = [
      { label: 'Full name', filled: !!pi.fullName.trim() },
      { label: 'Job title', filled: !!pi.title.trim() },
      { label: 'Email', filled: !!pi.email.trim() },
      { label: 'Phone', filled: !!pi.phone.trim() },
      { label: 'Location', filled: !!pi.location.trim() },
      { label: 'Summary', filled: !!pi.summary.trim() },
      { label: 'Experience (1+)', filled: resumeData.experiences.length > 0 && resumeData.experiences.some(e => !!e.position.trim()) },
      { label: 'Education (1+)', filled: resumeData.education.length > 0 && resumeData.education.some(e => !!e.institution.trim()) },
      { label: 'Skills', filled: !!resumeData.skills.trim() },
      { label: 'Projects (1+)', filled: resumeData.projects.length > 0 && resumeData.projects.some(p => !!p.name.trim()) },
    ];
    const filledCount = items.filter(i => i.filled).length;
    return { score: Math.round((filledCount / items.length) * 100), checks: items };
  }, [resumeData]);

  // Color based on score
  const getColor = () => {
    if (score >= 80) return 'var(--md3-primary)';
    if (score >= 50) return '#A16207';
    return 'var(--destructive)';
  };

  const color = getColor();
  const missing = checks.filter(c => !c.filled);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2.5 cursor-default">
          {/* Circular progress ring */}
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
              className="absolute inset-0 flex items-center justify-center text-[8px] font-mono-accent font-bold"
              style={{ color }}
            >
              {score}
            </span>
          </div>
          <span className="text-xs font-medium" style={{ color }}>
            {score}% complete
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8} className="max-w-[220px]">
        {missing.length === 0 ? (
          <p className="text-xs">Your resume is complete!</p>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-medium mb-1.5">Missing sections:</p>
            {missing.map(m => (
              <p key={m.label} className="text-xs opacity-80">• {m.label}</p>
            ))}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

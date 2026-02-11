import { useResume } from '@/contexts/ResumeContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function SkillsForm() {
  const { resumeData, setResumeData } = useResume();

  const handleSkillsChange = (value: string) => {
    setResumeData({ ...resumeData, skills: value });
  };

  // Count non-empty skills
  const skillCount = resumeData.skills
    ? resumeData.skills.split(',').filter(s => s.trim()).length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Skills</h3>
        <p className="text-sm text-muted-foreground mb-6">
          List your technical and professional skills, separated by commas.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="skills" className="text-sm font-medium">
          Skills
        </Label>
        <Textarea
          id="skills"
          value={resumeData.skills}
          onChange={e => handleSkillsChange(e.target.value)}
          placeholder="e.g. JavaScript, React, Node.js, Python, Figma, Project Management"
          className="min-h-[160px] text-base leading-relaxed resize-y"
        />
        <p className="text-xs text-muted-foreground">
          {skillCount} {skillCount === 1 ? 'skill' : 'skills'} listed
        </p>
      </div>
    </div>
  );
}

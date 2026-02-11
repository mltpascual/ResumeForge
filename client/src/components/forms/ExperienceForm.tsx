/*
 * DESIGN: "Black Tie Elegance" — Experience Form
 * Dark card surfaces, gold accents, refined inputs.
 */

import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const labelClass = "text-xs tracking-[0.1em] uppercase text-muted-foreground";
const inputClass = "bg-secondary/50 border-border focus:border-gold/50 focus:ring-gold/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground/50";
const labelStyle = { fontFamily: 'var(--font-body)', fontWeight: 500 } as const;

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {resumeData.experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-secondary/30 border border-border rounded-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold/60" />
                <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}>
                  Position {index + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 transition-colors duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className={labelClass} style={labelStyle}>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Senior Product Designer"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className={labelClass} style={labelStyle}>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Meridian Technologies"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className={labelClass} style={labelStyle}>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className={labelClass} style={labelStyle}>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className={labelClass} style={labelStyle}>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className={`${inputClass} disabled:opacity-40`}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) => updateExperience(exp.id, 'current', !!checked)}
                    className="data-[state=checked]:bg-gold data-[state=checked]:border-gold border-border"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-xs text-muted-foreground cursor-pointer">
                    Currently working here
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={labelClass} style={labelStyle}>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Describe your key responsibilities and achievements..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.experiences.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ fontWeight: 300 }}>No work experience added yet</p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full border-dashed border-gold/30 text-gold hover:bg-gold-muted hover:border-gold/50 transition-all duration-300"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}

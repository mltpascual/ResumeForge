import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {resumeData.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/50 border border-border rounded-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-warm-gray" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
                  Education {index + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Rhode Island School of Design"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Master of Fine Arts"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Graphic Design"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Start Year</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2014"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>End Year</Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2016"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>GPA (Optional)</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.9"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Additional Details (Optional)</Label>
              <Textarea
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                placeholder="Honors, thesis, relevant coursework..."
                rows={2}
                className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 resize-none"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.education.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No education added yet</p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={addEducation}
        className="w-full border-dashed border-terracotta/30 text-terracotta hover:bg-terracotta/5 hover:border-terracotta/50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}

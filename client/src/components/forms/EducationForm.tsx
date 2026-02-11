import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MonthPicker from '@/components/MonthPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Plus, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function EducationForm() {
  const { resumeData, addEducation, duplicateEducation, updateEducation, removeEducation } = useResume();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Education</h3>
        <p className="text-sm text-muted-foreground mb-6">Add your educational background.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-4">
              <CardContent className="pt-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-accent text-muted-foreground uppercase tracking-wider">
                    Education {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            duplicateEducation(edu.id);
                            toast.success('Education entry duplicated');
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Duplicate entry</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeEducation(edu.id)} className="text-muted-foreground hover:text-destructive">
                          <X className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove entry</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="Stanford University" className="h-11 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" className="h-11 text-base" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" className="h-11 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <MonthPicker
                      value={edu.startDate}
                      onChange={(val) => updateEducation(edu.id, 'startDate', val)}
                      placeholder="Start month"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <MonthPicker
                      value={edu.endDate}
                      onChange={(val) => updateEducation(edu.id, 'endDate', val)}
                      placeholder="End month"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GPA (optional)</Label>
                  <Input value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.9/4.0" className="h-11 text-base max-w-[200px]" />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} placeholder="Relevant coursework, honors, activities..." rows={3} className="text-base min-h-[100px] resize-none" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.education.length === 0 && (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No education added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addEducation} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Education
      </Button>
    </div>
  );
}

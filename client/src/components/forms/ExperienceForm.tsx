import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BulletPointEditor from '@/components/BulletPointEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Work Experience</h3>
        <p className="text-sm text-muted-foreground mb-6">Add your professional experience, most recent first.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-4">
              <CardContent className="pt-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-accent text-muted-foreground uppercase tracking-wider">
                    Position {String(index + 1).padStart(2, '0')}
                  </span>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeExperience(exp.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={e => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Senior Product Designer"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Meridian Technologies"
                      className="h-11 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="h-11 text-base"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) => updateExperience(exp.id, 'current', !!checked)}
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-sm text-muted-foreground cursor-pointer">
                        Current role
                      </label>
                    </div>
                  </div>
                </div>

                <BulletPointEditor
                  value={exp.description}
                  onChange={(val) => updateExperience(exp.id, 'description', val)}
                  placeholder="Key achievement or responsibility..."
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.experiences.length === 0 && (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No experience added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addExperience} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Experience
      </Button>
    </div>
  );
}

import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const levels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

export default function SkillsForm() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResume();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Skills</h3>
        <p className="text-sm text-muted-foreground mb-6">List your technical and professional skills.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Card className="mb-3">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <Label className="sr-only">Skill name</Label>
                    <Input
                      value={skill.name}
                      onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                      placeholder="e.g. React, Python, Project Management"
                      className="h-11 text-base"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {levels.map(level => (
                        <Badge
                          key={level}
                          variant={skill.level === level ? 'default' : 'outline'}
                          className="cursor-pointer text-xs px-2.5 py-1 capitalize"
                          onClick={() => updateSkill(skill.id, 'level', level)}
                        >
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeSkill(skill.id)} className="text-muted-foreground hover:text-destructive shrink-0 mt-1.5">
                    <X className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.skills.length === 0 && (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No skills added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addSkill} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Skill
      </Button>
    </div>
  );
}

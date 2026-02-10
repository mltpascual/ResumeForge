import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillsForm() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {resumeData.skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-end gap-3 bg-white/50 border border-border rounded-md p-3"
          >
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Skill</Label>
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="e.g. Figma, React, Project Management"
                className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
              />
            </div>
            <div className="w-40 space-y-1.5">
              <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Level</Label>
              <Select value={skill.level} onValueChange={(val) => updateSkill(skill.id, 'level', val)}>
                <SelectTrigger className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSkill(skill.id)}
              className="text-muted-foreground hover:text-destructive h-9 w-9 p-0 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.skills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Zap className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No skills added yet</p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={addSkill}
        className="w-full border-dashed border-terracotta/30 text-terracotta hover:bg-terracotta/5 hover:border-terracotta/50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Skill
      </Button>
    </div>
  );
}

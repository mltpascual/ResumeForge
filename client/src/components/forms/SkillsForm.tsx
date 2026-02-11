import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillsForm() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResume();
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill();
      // Update the last added skill with the typed name
      const skills = resumeData.skills;
      // We need to add then update — but since addSkill creates with empty name,
      // let's just add and the user types in the input
    }
    addSkill();
  };

  const handleKeyDown = (e: React.KeyboardEvent, skillId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
      e.preventDefault();
      removeSkill(skillId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Skills</h3>
        <p className="text-sm text-muted-foreground mb-6">
          List your technical and professional skills. Press Enter to add a new skill.
        </p>
      </div>

      {/* Skills as tag-like inputs */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {resumeData.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <Badge variant="outline" className="h-auto py-0 pl-0 pr-1 gap-0 text-base font-normal rounded-lg border-input">
                <Input
                  value={skill.name}
                  onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                  onKeyDown={e => handleKeyDown(e, skill.id)}
                  placeholder={`Skill ${index + 1}`}
                  className="border-0 shadow-none h-10 text-base focus-visible:ring-0 bg-transparent min-w-[120px]"
                  autoFocus={!skill.name}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeSkill(skill.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0 size-7"
                >
                  <X className="size-3.5" />
                </Button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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

/*
 * DESIGN: Minimalist / Severe — Skills Form
 * Inline row layout, hairline borders, monospace labels
 */

import { useResume } from '@/contexts/ResumeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full bg-transparent border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#09090B] placeholder:text-[#D4D4D8] focus:outline-none focus:border-[#09090B] transition-colors duration-200";
const labelClass = "block text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] mb-1.5";
const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

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
            transition={{ duration: 0.15 }}
            className="flex items-end gap-3 border border-[#E4E4E7] p-3"
          >
            <div className="flex-1">
              <label className={labelClass} style={labelStyle}>Skill</label>
              <input
                value={skill.name}
                onChange={e => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="e.g. Figma, React, Project Management"
                className={inputClass}
              />
            </div>
            <div className="w-36">
              <label className={labelClass} style={labelStyle}>Level</label>
              <Select value={skill.level} onValueChange={(val) => updateSkill(skill.id, 'level', val)}>
                <SelectTrigger className="bg-transparent border-[#E4E4E7] focus:border-[#09090B] text-sm h-[42px]">
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
            <button
              onClick={() => removeSkill(skill.id)}
              className="w-8 h-[42px] flex items-center justify-center text-[#D4D4D8] hover:text-[#DC2626] transition-colors duration-200 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.skills.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[10px] tracking-[0.1em] uppercase text-[#D4D4D8]" style={labelStyle}>
            No skills added
          </p>
        </div>
      )}

      <button
        onClick={addSkill}
        className="w-full border border-dashed border-[#D4D4D8] py-3 text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] hover:border-[#09090B] hover:text-[#09090B] transition-colors duration-200 flex items-center justify-center gap-2"
        style={labelStyle}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Skill
      </button>
    </div>
  );
}

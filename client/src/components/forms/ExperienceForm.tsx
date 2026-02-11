/*
 * DESIGN: Minimalist / Severe — Experience Form
 * Hairline borders, monospace labels, no color, no icons in labels
 */

import { useResume } from '@/contexts/ResumeContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full bg-transparent border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#09090B] placeholder:text-[#D4D4D8] focus:outline-none focus:border-[#09090B] transition-colors duration-200";
const labelClass = "block text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] mb-1.5";
const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {resumeData.experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-[#E4E4E7] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA]" style={labelStyle}>
                Position {String(index + 1).padStart(2, '0')}
              </span>
              <button
                onClick={() => removeExperience(exp.id)}
                className="w-6 h-6 flex items-center justify-center text-[#D4D4D8] hover:text-[#DC2626] transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Position</label>
                <input
                  value={exp.position}
                  onChange={e => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Senior Product Designer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Company</label>
                <input
                  value={exp.company}
                  onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Meridian Technologies"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Location</label>
                <input
                  value={exp.location}
                  onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Start</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>End</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className={`${inputClass} disabled:opacity-30`}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) => updateExperience(exp.id, 'current', !!checked)}
                    className="data-[state=checked]:bg-[#09090B] data-[state=checked]:border-[#09090B] border-[#E4E4E7]"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-[10px] text-[#A1A1AA] cursor-pointer" style={labelStyle}>
                    Current
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>Description</label>
              <textarea
                value={exp.description}
                onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Key responsibilities and achievements..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.experiences.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[10px] tracking-[0.1em] uppercase text-[#D4D4D8]" style={labelStyle}>
            No experience added
          </p>
        </div>
      )}

      <button
        onClick={addExperience}
        className="w-full border border-dashed border-[#D4D4D8] py-3 text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] hover:border-[#09090B] hover:text-[#09090B] transition-colors duration-200 flex items-center justify-center gap-2"
        style={labelStyle}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Experience
      </button>
    </div>
  );
}

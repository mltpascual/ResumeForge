/*
 * DESIGN: Minimalist / Severe — Education Form
 * Hairline borders, monospace labels, no color
 */

import { useResume } from '@/contexts/ResumeContext';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full bg-transparent border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#09090B] placeholder:text-[#D4D4D8] focus:outline-none focus:border-[#09090B] transition-colors duration-200";
const labelClass = "block text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] mb-1.5";
const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export default function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {resumeData.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-[#E4E4E7] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA]" style={labelStyle}>
                Education {String(index + 1).padStart(2, '0')}
              </span>
              <button
                onClick={() => removeEducation(edu.id)}
                className="w-6 h-6 flex items-center justify-center text-[#D4D4D8] hover:text-[#DC2626] transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Institution</label>
                <input
                  value={edu.institution}
                  onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Rhode Island School of Design"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Degree</label>
                <input
                  value={edu.degree}
                  onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Master of Fine Arts"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Field</label>
                <input
                  value={edu.field}
                  onChange={e => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Graphic Design"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Start</label>
                <input
                  value={edu.startDate}
                  onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2014"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>End</label>
                <input
                  value={edu.endDate}
                  onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2016"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>GPA</label>
                <input
                  value={edu.gpa}
                  onChange={e => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.9"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>Details</label>
              <textarea
                value={edu.description}
                onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                placeholder="Honors, thesis, relevant coursework..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.education.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[10px] tracking-[0.1em] uppercase text-[#D4D4D8]" style={labelStyle}>
            No education added
          </p>
        </div>
      )}

      <button
        onClick={addEducation}
        className="w-full border border-dashed border-[#D4D4D8] py-3 text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] hover:border-[#09090B] hover:text-[#09090B] transition-colors duration-200 flex items-center justify-center gap-2"
        style={labelStyle}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Education
      </button>
    </div>
  );
}

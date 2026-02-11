/*
 * DESIGN: Minimalist / Severe — Projects Form
 * Hairline borders, monospace labels, no color
 */

import { useResume } from '@/contexts/ResumeContext';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full bg-transparent border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#09090B] placeholder:text-[#D4D4D8] focus:outline-none focus:border-[#09090B] transition-colors duration-200";
const labelClass = "block text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] mb-1.5";
const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {resumeData.projects.map((proj, index) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-[#E4E4E7] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA]" style={labelStyle}>
                Project {String(index + 1).padStart(2, '0')}
              </span>
              <button
                onClick={() => removeProject(proj.id)}
                className="w-6 h-6 flex items-center justify-center text-[#D4D4D8] hover:text-[#DC2626] transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Name</label>
                <input
                  value={proj.name}
                  onChange={e => updateProject(proj.id, 'name', e.target.value)}
                  placeholder="Design System"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Link</label>
                <input
                  value={proj.link}
                  onChange={e => updateProject(proj.id, 'link', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>Technologies</label>
              <input
                value={proj.technologies}
                onChange={e => updateProject(proj.id, 'technologies', e.target.value)}
                placeholder="React, TypeScript, Figma"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>Description</label>
              <textarea
                value={proj.description}
                onChange={e => updateProject(proj.id, 'description', e.target.value)}
                placeholder="Describe the project and your contributions..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.projects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[10px] tracking-[0.1em] uppercase text-[#D4D4D8]" style={labelStyle}>
            No projects added
          </p>
        </div>
      )}

      <button
        onClick={addProject}
        className="w-full border border-dashed border-[#D4D4D8] py-3 text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] hover:border-[#09090B] hover:text-[#09090B] transition-colors duration-200 flex items-center justify-center gap-2"
        style={labelStyle}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Project
      </button>
    </div>
  );
}

/*
 * DESIGN: Minimalist / Severe — Certifications Form
 * Hairline borders, monospace labels, no color
 */

import { useResume } from '@/contexts/ResumeContext';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full bg-transparent border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#09090B] placeholder:text-[#D4D4D8] focus:outline-none focus:border-[#09090B] transition-colors duration-200";
const labelClass = "block text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] mb-1.5";
const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export default function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume();

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {resumeData.certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-[#E4E4E7] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA]" style={labelStyle}>
                Certification {String(index + 1).padStart(2, '0')}
              </span>
              <button
                onClick={() => removeCertification(cert.id)}
                className="w-6 h-6 flex items-center justify-center text-[#D4D4D8] hover:text-[#DC2626] transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Name</label>
                <input
                  value={cert.name}
                  onChange={e => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="Google UX Design Certificate"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Issuer</label>
                <input
                  value={cert.issuer}
                  onChange={e => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Google"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Date</label>
                <input
                  value={cert.date}
                  onChange={e => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="2022"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Link</label>
                <input
                  value={cert.link}
                  onChange={e => updateCertification(cert.id, 'link', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.certifications.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[10px] tracking-[0.1em] uppercase text-[#D4D4D8]" style={labelStyle}>
            No certifications added
          </p>
        </div>
      )}

      <button
        onClick={addCertification}
        className="w-full border border-dashed border-[#D4D4D8] py-3 text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] hover:border-[#09090B] hover:text-[#09090B] transition-colors duration-200 flex items-center justify-center gap-2"
        style={labelStyle}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Certification
      </button>
    </div>
  );
}

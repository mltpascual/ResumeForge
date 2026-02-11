/*
 * DESIGN: Minimalist / Severe — Personal Info Form
 * Black text on white, hairline borders, monospace labels, no icons
 */

import { useResume } from '@/contexts/ResumeContext';

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const inputClass = "w-full bg-transparent border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#09090B] placeholder:text-[#D4D4D8] focus:outline-none focus:border-[#09090B] transition-colors duration-200";
  const labelClass = "block text-[10px] tracking-[0.1em] uppercase text-[#A1A1AA] mb-1.5";
  const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Full Name</label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={e => updatePersonalInfo('fullName', e.target.value)}
            placeholder="Alexandra Sterling"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Title</label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={e => updatePersonalInfo('title', e.target.value)}
            placeholder="Senior Product Designer"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Email</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={e => updatePersonalInfo('email', e.target.value)}
            placeholder="alex@email.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Phone</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={e => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 234-5678"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Location</label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={e => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Website</label>
          <input
            type="text"
            value={personalInfo.website}
            onChange={e => updatePersonalInfo('website', e.target.value)}
            placeholder="alexsterling.design"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>LinkedIn</label>
        <input
          type="text"
          value={personalInfo.linkedin}
          onChange={e => updatePersonalInfo('linkedin', e.target.value)}
          placeholder="linkedin.com/in/alexsterling"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>Professional Summary</label>
        <textarea
          value={personalInfo.summary}
          onChange={e => updatePersonalInfo('summary', e.target.value)}
          placeholder="A brief overview of your professional background, key achievements, and career objectives..."
          rows={4}
          maxLength={500}
          className={`${inputClass} resize-none`}
        />
        <p className="text-[10px] text-[#D4D4D8] mt-1" style={labelStyle}>
          {personalInfo.summary.length}/500
        </p>
      </div>
    </div>
  );
}

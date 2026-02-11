/*
 * Resume Preview Templates with section order + accent color support
 * Templates: Classic, Modern, Executive
 * Skills rendered as comma-delimited text.
 * All use inline styles for PDF export fidelity.
 */

import { useResume, type SectionId } from '@/contexts/ResumeContext';
import { type ResumeData, type TemplateId } from '@/types/resume';
import { forwardRef } from 'react';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

function lightenColor(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const r = Math.min(255, parseInt(c.substring(0, 2), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(c.substring(2, 4), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(c.substring(4, 6), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const emptyState = (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px' }}>
    <div>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', color: '#09090B', marginBottom: '8px', fontWeight: 600, letterSpacing: '-0.02em' }}>
        Your resume preview
      </p>
      <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '13px', color: '#A1A1AA' }}>
        Start filling in your details, or load sample data.
      </p>
    </div>
  </div>
);

// ============ SECTION RENDERERS ============

interface SectionColors {
  accent: string;
  black: string;
  body: string;
  muted: string;
  line: string;
}

function ExperienceSection({ data, colors, headingStyle }: { data: ResumeData; colors: SectionColors; headingStyle: React.CSSProperties }) {
  if (data.experiences.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Experience</h2>
      {data.experiences.map(exp => (
        <div key={exp.id} style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: colors.black, letterSpacing: '-0.01em' }}>{exp.position}</h3>
            <span style={{ fontSize: '10px', color: colors.muted, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
              {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: colors.muted, marginBottom: '3px' }}>
            {exp.company}{exp.location ? ` · ${exp.location}` : ''}
          </p>
          {exp.description && <p style={{ fontSize: '11px', color: colors.body, lineHeight: 1.6 }}>{exp.description}</p>}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ data, colors, headingStyle }: { data: ResumeData; colors: SectionColors; headingStyle: React.CSSProperties }) {
  if (data.education.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Education</h2>
      {data.education.map(edu => (
        <div key={edu.id} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
            <span style={{ fontSize: '10px', color: colors.muted, fontFamily: "'JetBrains Mono', monospace" }}>{edu.startDate} — {edu.endDate}</span>
          </div>
          <p style={{ fontSize: '11px', color: colors.body }}>
            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
          </p>
          {edu.description && <p style={{ fontSize: '10.5px', color: colors.muted }}>{edu.description}</p>}
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ data, colors, headingStyle }: { data: ResumeData; colors: SectionColors; headingStyle: React.CSSProperties }) {
  if (!data.skills || !data.skills.trim()) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Skills</h2>
      <p style={{ fontSize: '11px', color: colors.body, lineHeight: 1.7 }}>
        {data.skills}
      </p>
    </div>
  );
}

function ProjectsSection({ data, colors, headingStyle }: { data: ResumeData; colors: SectionColors; headingStyle: React.CSSProperties }) {
  if (data.projects.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Projects</h2>
      {data.projects.map(proj => (
        <div key={proj.id} style={{ marginBottom: '10px' }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, color: colors.black }}>{proj.name}</h3>
          {proj.technologies && <p style={{ fontSize: '10px', color: colors.muted, fontFamily: "'JetBrains Mono', monospace" }}>{proj.technologies}</p>}
          {proj.description && <p style={{ fontSize: '11px', color: colors.body, lineHeight: 1.6 }}>{proj.description}</p>}
        </div>
      ))}
    </div>
  );
}

function CertificationsSection({ data, colors, headingStyle }: { data: ResumeData; colors: SectionColors; headingStyle: React.CSSProperties }) {
  if (data.certifications.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Certifications</h2>
      {data.certifications.map(cert => (
        <div key={cert.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 500, color: colors.black }}>{cert.name}</span>
            {cert.issuer && <span style={{ fontSize: '10.5px', color: colors.muted }}> — {cert.issuer}</span>}
          </div>
          {cert.date && <span style={{ fontSize: '10px', color: colors.muted, fontFamily: "'JetBrains Mono', monospace" }}>{cert.date}</span>}
        </div>
      ))}
    </div>
  );
}

function renderOrderedSections(data: ResumeData, order: SectionId[], colors: SectionColors, headingStyle: React.CSSProperties) {
  const sectionMap: Record<SectionId, React.ReactNode> = {
    experiences: <ExperienceSection key="experiences" data={data} colors={colors} headingStyle={headingStyle} />,
    education: <EducationSection key="education" data={data} colors={colors} headingStyle={headingStyle} />,
    skills: <SkillsSection key="skills" data={data} colors={colors} headingStyle={headingStyle} />,
    projects: <ProjectsSection key="projects" data={data} colors={colors} headingStyle={headingStyle} />,
    certifications: <CertificationsSection key="certifications" data={data} colors={colors} headingStyle={headingStyle} />,
  };
  return order.map(id => sectionMap[id]);
}

// ============ CLASSIC TEMPLATE ============
function ClassicTemplate({ data, sectionOrder, accent }: { data: ResumeData; sectionOrder: SectionId[]; accent: string }) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em', color: accent,
    borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '12px',
  };

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", color: colors.black, padding: '44px 40px', lineHeight: 1.5 }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: `2px solid ${accent}` }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px', color: colors.black }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '13px', color: accent, marginBottom: '10px', fontWeight: 500, letterSpacing: '0.02em' }}>{personalInfo.title}</p>
        )}
        <div style={{ fontSize: '10px', color: colors.muted, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 14px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {personalInfo.summary && (
        <div style={{ marginBottom: '22px' }}>
          <p style={{ fontSize: '11.5px', color: colors.body, lineHeight: 1.7 }}>{personalInfo.summary}</p>
        </div>
      )}
      {renderOrderedSections(data, sectionOrder, colors, headingStyle)}
    </div>
  );
}

// ============ MODERN TEMPLATE ============
function ModernTemplate({ data, sectionOrder, accent }: { data: ResumeData; sectionOrder: SectionId[]; accent: string }) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const sidebarBg = accent;
  const sidebarText = isLightColor(accent) ? '#09090B' : '#FAFAFA';
  const sidebarMuted = isLightColor(accent) ? '#3f3f46' : '#A1A1AA';
  const sidebarSubtle = isLightColor(accent) ? '#71717A' : '#71717A';

  const mainSections = sectionOrder.filter(s => s !== 'skills' && s !== 'certifications');
  const mainHeadingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: '14px',
  };

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", color: colors.black, display: 'flex', minHeight: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: '35%', backgroundColor: sidebarBg, color: sidebarText, padding: '36px 22px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, marginBottom: '2px', color: sidebarText, letterSpacing: '-0.03em' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '11px', color: sidebarMuted, marginBottom: '24px', fontWeight: 400 }}>{personalInfo.title}</p>
        )}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: sidebarSubtle, marginBottom: '10px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>Contact</h3>
          <div style={{ fontSize: '10.5px', lineHeight: 1.8, color: sidebarMuted }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>
        {data.skills && data.skills.trim() && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: sidebarSubtle, marginBottom: '12px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>Skills</h3>
            <p style={{ fontSize: '10.5px', color: sidebarText, lineHeight: 1.7 }}>
              {data.skills}
            </p>
          </div>
        )}
        {data.certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: sidebarSubtle, marginBottom: '12px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>Certifications</h3>
            {data.certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '10.5px', fontWeight: 500, color: sidebarText }}>{cert.name}</p>
                <p style={{ fontSize: '9.5px', color: sidebarSubtle }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ width: '65%', padding: '36px 28px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={mainHeadingStyle}>Profile</h2>
            <p style={{ fontSize: '11px', color: colors.body, lineHeight: 1.7 }}>{personalInfo.summary}</p>
          </div>
        )}
        {mainSections.map(sectionId => {
          const borderStyle: React.CSSProperties = { ...mainHeadingStyle };
          switch (sectionId) {
            case 'experiences':
              if (data.experiences.length === 0) return null;
              return (
                <div key="experiences" style={{ marginBottom: '22px' }}>
                  <h2 style={borderStyle}>Experience</h2>
                  {data.experiences.map(exp => (
                    <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: `2px solid ${accent}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, color: colors.black }}>{exp.position}</h3>
                        <span style={{ fontSize: '9.5px', color: colors.muted, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p style={{ fontSize: '10.5px', color: colors.muted, marginBottom: '3px' }}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                      {exp.description && <p style={{ fontSize: '10.5px', color: colors.body, lineHeight: 1.6 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              );
            case 'education':
              if (data.education.length === 0) return null;
              return (
                <div key="education" style={{ marginBottom: '22px' }}>
                  <h2 style={borderStyle}>Education</h2>
                  {data.education.map(edu => (
                    <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${accent}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
                        <span style={{ fontSize: '9.5px', color: colors.muted, fontFamily: "'JetBrains Mono', monospace" }}>{edu.startDate} — {edu.endDate}</span>
                      </div>
                      <p style={{ fontSize: '10.5px', color: colors.body }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              );
            case 'projects':
              if (data.projects.length === 0) return null;
              return (
                <div key="projects" style={{ marginBottom: '22px' }}>
                  <h2 style={borderStyle}>Projects</h2>
                  {data.projects.map(proj => (
                    <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${accent}` }}>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: colors.black }}>{proj.name}</h3>
                      {proj.technologies && <p style={{ fontSize: '9.5px', color: colors.muted, fontFamily: "'JetBrains Mono', monospace" }}>{proj.technologies}</p>}
                      {proj.description && <p style={{ fontSize: '10.5px', color: colors.body, lineHeight: 1.5 }}>{proj.description}</p>}
                    </div>
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

// ============ EXECUTIVE TEMPLATE ============
function ExecutiveTemplate({ data, sectionOrder, accent }: { data: ResumeData; sectionOrder: SectionId[]; accent: string }) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const headerText = isLightColor(accent) ? '#09090B' : '#FAFAFA';
  const headerMuted = isLightColor(accent) ? '#3f3f46' : '#A1A1AA';
  const headingStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700,
    color: accent, textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: '12px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px',
  };

  const leftSections = sectionOrder.filter(s => s === 'education' || s === 'projects');
  const rightSections = sectionOrder.filter(s => s === 'skills' || s === 'certifications');

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", color: colors.black }}>
      <div style={{ backgroundColor: accent, padding: '28px 40px', color: headerText }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px' }}>
          {personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '12px', color: headerMuted, fontWeight: 400, letterSpacing: '0.04em' }}>{personalInfo.title}</p>
        )}
      </div>

      <div style={{ backgroundColor: lightenColor(accent, 0.7), padding: '8px 40px', display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9.5px', color: colors.muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em' }}>
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>

      <div style={{ padding: '24px 40px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px', borderLeft: `3px solid ${accent}`, paddingLeft: '14px' }}>
            <p style={{ fontSize: '11.5px', color: colors.body, lineHeight: 1.7 }}>{personalInfo.summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={headingStyle}>Professional Experience</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12.5px', fontWeight: 700, color: colors.black }}>{exp.position}</h3>
                  <span style={{ fontSize: '9.5px', color: colors.muted, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: colors.muted, fontWeight: 500, marginBottom: '3px' }}>
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </p>
                {exp.description && <p style={{ fontSize: '11px', color: colors.body, lineHeight: 1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '28px' }}>
          <div style={{ flex: '1' }}>
            {leftSections.map(sectionId => {
              switch (sectionId) {
                case 'education':
                  if (data.education.length === 0) return null;
                  return (
                    <div key="education" style={{ marginBottom: '22px' }}>
                      <h2 style={headingStyle}>Education</h2>
                      {data.education.map(edu => (
                        <div key={edu.id} style={{ marginBottom: '10px' }}>
                          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
                          <p style={{ fontSize: '10.5px', color: colors.body }}>
                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''} · {edu.startDate}–{edu.endDate}
                          </p>
                          {edu.gpa && <p style={{ fontSize: '9.5px', color: colors.muted }}>GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  );
                case 'projects':
                  if (data.projects.length === 0) return null;
                  return (
                    <div key="projects" style={{ marginBottom: '22px' }}>
                      <h2 style={headingStyle}>Key Projects</h2>
                      {data.projects.map(proj => (
                        <div key={proj.id} style={{ marginBottom: '10px' }}>
                          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: colors.black }}>{proj.name}</h3>
                          {proj.description && <p style={{ fontSize: '10.5px', color: colors.body, lineHeight: 1.5 }}>{proj.description}</p>}
                        </div>
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          <div style={{ width: '190px', flexShrink: 0 }}>
            {rightSections.map(sectionId => {
              switch (sectionId) {
                case 'skills':
                  if (!data.skills || !data.skills.trim()) return null;
                  return (
                    <div key="skills" style={{ marginBottom: '22px' }}>
                      <h2 style={headingStyle}>Skills</h2>
                      <p style={{ fontSize: '10.5px', color: colors.body, lineHeight: 1.7 }}>
                        {data.skills}
                      </p>
                    </div>
                  );
                case 'certifications':
                  if (data.certifications.length === 0) return null;
                  return (
                    <div key="certifications" style={{ marginBottom: '22px' }}>
                      <h2 style={headingStyle}>Certifications</h2>
                      {data.certifications.map(cert => (
                        <div key={cert.id} style={{ marginBottom: '8px' }}>
                          <p style={{ fontSize: '10.5px', fontWeight: 500, color: colors.black }}>{cert.name}</p>
                          <p style={{ fontSize: '9.5px', color: colors.muted }}>{cert.issuer} · {cert.date}</p>
                        </div>
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PREVIEW COMPONENT ============
const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { resumeData, selectedTemplate, sectionOrder, accentColor } = useResume();

  const templates: Record<TemplateId, React.ComponentType<{ data: ResumeData; sectionOrder: SectionId[]; accent: string }>> = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
  };

  const Template = templates[selectedTemplate];

  return (
    <div
      ref={ref}
      id="resume-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        transformOrigin: 'top left',
      }}
    >
      <Template data={resumeData} sectionOrder={sectionOrder} accent={accentColor} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

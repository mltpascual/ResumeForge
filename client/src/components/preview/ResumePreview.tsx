/*
 * DESIGN: Resume Preview Component
 * Renders the resume in real-time based on selected template.
 * Each template is a pure HTML/CSS layout designed for print fidelity.
 */

import { useResume } from '@/contexts/ResumeContext';
import { type ResumeData, type TemplateId } from '@/types/resume';
import { forwardRef } from 'react';

// Format date string
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr; // Just a year
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

// Skill level to visual representation
function skillDots(level: string) {
  const levels: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
  const filled = levels[level] || 2;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i <= filled ? '#c17f59' : '#e5ddd5' }}
        />
      ))}
    </div>
  );
}

// ============ CLASSIC TEMPLATE ============
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  const hasContent = personalInfo.fullName || experiences.length > 0 || education.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#2d2926', marginBottom: '8px' }}>
            Your resume preview will appear here
          </p>
          <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '13px', color: '#8a8078' }}>
            Start filling in your details on the left, or load sample data to see a preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Source Sans 3, sans-serif', color: '#2d2926', padding: '40px', lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #c17f59', paddingBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, letterSpacing: '0.02em', marginBottom: '4px', color: '#2d2926' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontStyle: 'italic', color: '#c17f59', marginBottom: '8px' }}>
            {personalInfo.title}
          </p>
        )}
        <div style={{ fontSize: '11px', color: '#6b6158', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#4a4440', lineHeight: 1.6 }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c17f59', borderBottom: '1px solid #e5ddd5', paddingBottom: '4px', marginBottom: '12px' }}>
            Experience
          </h2>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '13px', fontWeight: 600 }}>{exp.position}</h3>
                <span style={{ fontSize: '11px', color: '#8a8078', whiteSpace: 'nowrap' }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#c17f59', fontStyle: 'italic', marginBottom: '4px' }}>
                {exp.company}{exp.location ? `, ${exp.location}` : ''}
              </p>
              {exp.description && (
                <p style={{ fontSize: '11.5px', color: '#4a4440', lineHeight: 1.6 }}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c17f59', borderBottom: '1px solid #e5ddd5', paddingBottom: '4px', marginBottom: '12px' }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '13px', fontWeight: 600 }}>{edu.institution}</h3>
                <span style={{ fontSize: '11px', color: '#8a8078' }}>
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a4440' }}>
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
              </p>
              {edu.description && (
                <p style={{ fontSize: '11px', color: '#6b6158', fontStyle: 'italic' }}>{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c17f59', borderBottom: '1px solid #e5ddd5', paddingBottom: '4px', marginBottom: '12px' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map(skill => (
              <span key={skill.id} style={{ fontSize: '11px', padding: '3px 10px', backgroundColor: '#f5f0eb', borderRadius: '2px', color: '#4a4440' }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c17f59', borderBottom: '1px solid #e5ddd5', paddingBottom: '4px', marginBottom: '12px' }}>
            Projects
          </h2>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '13px', fontWeight: 600 }}>{proj.name}</h3>
              {proj.technologies && (
                <p style={{ fontSize: '11px', color: '#c17f59', marginBottom: '2px' }}>{proj.technologies}</p>
              )}
              {proj.description && (
                <p style={{ fontSize: '11.5px', color: '#4a4440', lineHeight: 1.6 }}>{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c17f59', borderBottom: '1px solid #e5ddd5', paddingBottom: '4px', marginBottom: '12px' }}>
            Certifications
          </h2>
          {certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: '11px', color: '#6b6158' }}> — {cert.issuer}</span>}
              </div>
              {cert.date && <span style={{ fontSize: '11px', color: '#8a8078' }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ MODERN TEMPLATE ============
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  const hasContent = personalInfo.fullName || experiences.length > 0 || education.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#2d2926', marginBottom: '8px' }}>
            Your resume preview will appear here
          </p>
          <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '13px', color: '#8a8078' }}>
            Start filling in your details on the left, or load sample data to see a preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Source Sans 3, sans-serif', color: '#2d2926', display: 'flex', minHeight: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: '35%', backgroundColor: '#2d2926', color: '#f5f0eb', padding: '32px 20px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, marginBottom: '4px', color: '#ffffff' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '12px', color: '#c17f59', marginBottom: '20px', fontWeight: 500 }}>
            {personalInfo.title}
          </p>
        )}

        {/* Contact */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#c17f59', marginBottom: '8px', fontWeight: 600 }}>Contact</h3>
          <div style={{ fontSize: '11px', lineHeight: 1.8, color: '#d4cdc6' }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#c17f59', marginBottom: '10px', fontWeight: 600 }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {skills.map(skill => (
                <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#d4cdc6' }}>{skill.name}</span>
                  {skillDots(skill.level)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#c17f59', marginBottom: '10px', fontWeight: 600 }}>Certifications</h3>
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 500, color: '#f5f0eb' }}>{cert.name}</p>
                <p style={{ fontSize: '10px', color: '#8a8078' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ width: '65%', padding: '32px 24px' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c17f59', marginBottom: '8px' }}>Profile</h2>
            <p style={{ fontSize: '11.5px', color: '#4a4440', lineHeight: 1.6 }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c17f59', marginBottom: '12px' }}>Experience</h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: '2px solid #e5ddd5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600 }}>{exp.position}</h3>
                  <span style={{ fontSize: '10px', color: '#8a8078', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#c17f59', marginBottom: '4px' }}>
                  {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                </p>
                {exp.description && (
                  <p style={{ fontSize: '11px', color: '#4a4440', lineHeight: 1.6 }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c17f59', marginBottom: '12px' }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #e5ddd5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 600 }}>{edu.institution}</h3>
                  <span style={{ fontSize: '10px', color: '#8a8078' }}>{edu.startDate} — {edu.endDate}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#4a4440' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c17f59', marginBottom: '12px' }}>Projects</h2>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #e5ddd5' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 600 }}>{proj.name}</h3>
                {proj.technologies && <p style={{ fontSize: '10px', color: '#c17f59' }}>{proj.technologies}</p>}
                {proj.description && <p style={{ fontSize: '11px', color: '#4a4440', lineHeight: 1.5 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ EXECUTIVE TEMPLATE ============
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  const hasContent = personalInfo.fullName || experiences.length > 0 || education.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#2d2926', marginBottom: '8px' }}>
            Your resume preview will appear here
          </p>
          <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: '13px', color: '#8a8078' }}>
            Start filling in your details on the left, or load sample data to see a preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Source Sans 3, sans-serif', color: '#2d2926' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a2744', padding: '28px 40px', color: '#ffffff' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
          {personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '13px', color: '#b8a88a', fontWeight: 500, letterSpacing: '0.03em' }}>{personalInfo.title}</p>
        )}
      </div>

      {/* Contact bar */}
      <div style={{ backgroundColor: '#f5f0eb', padding: '10px 40px', display: 'flex', flexWrap: 'wrap', gap: '4px 20px', fontSize: '10.5px', color: '#6b6158' }}>
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>

      <div style={{ padding: '24px 40px' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '20px', borderLeft: '3px solid #1a2744', paddingLeft: '16px' }}>
            <p style={{ fontSize: '12px', color: '#4a4440', lineHeight: 1.6, fontStyle: 'italic' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', borderBottom: '1px solid #1a2744', paddingBottom: '4px' }}>
              Professional Experience
            </h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1a2744' }}>{exp.position}</h3>
                  <span style={{ fontSize: '10.5px', color: '#8a8078', whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#b8a88a', fontWeight: 500, marginBottom: '4px' }}>
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </p>
                {exp.description && (
                  <p style={{ fontSize: '11.5px', color: '#4a4440', lineHeight: 1.6 }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Two-column layout for Education + Skills */}
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ flex: '1' }}>
            {education.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', borderBottom: '1px solid #1a2744', paddingBottom: '4px' }}>
                  Education
                </h2>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#1a2744' }}>{edu.institution}</h3>
                    <p style={{ fontSize: '11px', color: '#4a4440' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''} · {edu.startDate}–{edu.endDate}
                    </p>
                    {edu.gpa && <p style={{ fontSize: '10px', color: '#8a8078' }}>GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', borderBottom: '1px solid #1a2744', paddingBottom: '4px' }}>
                  Key Projects
                </h2>
                {projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#1a2744' }}>{proj.name}</h3>
                    {proj.description && <p style={{ fontSize: '11px', color: '#4a4440', lineHeight: 1.5 }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '200px', flexShrink: 0 }}>
            {skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', borderBottom: '1px solid #1a2744', paddingBottom: '4px' }}>
                  Skills
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {skills.map(skill => (
                    <span key={skill.id} style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: '#f5f0eb', color: '#4a4440', borderRadius: '1px' }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontWeight: 600, color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', borderBottom: '1px solid #1a2744', paddingBottom: '4px' }}>
                  Certifications
                </h2>
                {certifications.map(cert => (
                  <div key={cert.id} style={{ marginBottom: '6px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500 }}>{cert.name}</p>
                    <p style={{ fontSize: '10px', color: '#8a8078' }}>{cert.issuer} · {cert.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PREVIEW COMPONENT ============
const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { resumeData, selectedTemplate } = useResume();

  const templates: Record<TemplateId, React.ComponentType<{ data: ResumeData }>> = {
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
        boxShadow: '0 4px 24px rgba(45, 41, 38, 0.12), 0 1px 4px rgba(45, 41, 38, 0.08)',
        transformOrigin: 'top left',
      }}
    >
      <Template data={resumeData} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

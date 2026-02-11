/*
 * DESIGN: Minimalist / Severe — Resume Preview Templates
 * All templates use pure black/white/gray palette
 * Typography: Space Grotesk (headings) + Archivo (body)
 * No color, no rounded corners, hairline rules only
 * All use inline styles for PDF export fidelity.
 */

import { useResume } from '@/contexts/ResumeContext';
import { type ResumeData, type TemplateId } from '@/types/resume';
import { forwardRef } from 'react';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
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

// ============ CLASSIC TEMPLATE ============
// Centered header, horizontal rules, clean single-column
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  if (!(personalInfo.fullName || experiences.length > 0 || education.length > 0)) return emptyState;

  const black = '#09090B';
  const body = '#3f3f46';
  const muted = '#71717A';
  const line = '#E4E4E7';

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", color: black, padding: '44px 40px', lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${black}` }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px', color: black }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '13px', color: muted, marginBottom: '10px', fontWeight: 400, letterSpacing: '0.02em' }}>
            {personalInfo.title}
          </p>
        )}
        <div style={{ fontSize: '10px', color: muted, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 14px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '22px' }}>
          <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.7 }}>{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Experience
          </h2>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: black, letterSpacing: '-0.01em' }}>{exp.position}</h3>
                <span style={{ fontSize: '10px', color: muted, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: muted, marginBottom: '3px' }}>
                {exp.company}{exp.location ? ` · ${exp.location}` : ''}
              </p>
              {exp.description && <p style={{ fontSize: '11px', color: body, lineHeight: 1.6 }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, color: black }}>{edu.institution}</h3>
                <span style={{ fontSize: '10px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{edu.startDate} — {edu.endDate}</span>
              </div>
              <p style={{ fontSize: '11px', color: body }}>
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </p>
              {edu.description && <p style={{ fontSize: '10.5px', color: muted }}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {skills.map(skill => (
              <span key={skill.id} style={{ fontSize: '10px', padding: '2px 8px', border: `1px solid ${line}`, color: body, fontFamily: "'JetBrains Mono', monospace" }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Projects
          </h2>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, color: black }}>{proj.name}</h3>
              {proj.technologies && <p style={{ fontSize: '10px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{proj.technologies}</p>}
              {proj.description && <p style={{ fontSize: '11px', color: body, lineHeight: 1.6 }}>{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Certifications
          </h2>
          {certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: black }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: '10.5px', color: muted }}> — {cert.issuer}</span>}
              </div>
              {cert.date && <span style={{ fontSize: '10px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ MODERN TEMPLATE ============
// Two-column: dark sidebar left, content right
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  if (!(personalInfo.fullName || experiences.length > 0 || education.length > 0)) return emptyState;

  const black = '#09090B';
  const body = '#3f3f46';
  const muted = '#71717A';
  const sidebarBg = '#18181B';
  const sidebarText = '#D4D4D8';
  const line = '#E4E4E7';

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", color: black, display: 'flex', minHeight: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: '35%', backgroundColor: sidebarBg, color: sidebarText, padding: '36px 22px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, marginBottom: '2px', color: '#FAFAFA', letterSpacing: '-0.03em' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '11px', color: '#A1A1AA', marginBottom: '24px', fontWeight: 400 }}>{personalInfo.title}</p>
        )}

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#71717A', marginBottom: '10px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>Contact</h3>
          <div style={{ fontSize: '10.5px', lineHeight: 1.8, color: '#A1A1AA' }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#71717A', marginBottom: '12px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {skills.map(skill => (
                <span key={skill.id} style={{ fontSize: '10.5px', color: '#D4D4D8' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#71717A', marginBottom: '12px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>Certifications</h3>
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '10.5px', fontWeight: 500, color: '#FAFAFA' }}>{cert.name}</p>
                <p style={{ fontSize: '9.5px', color: '#71717A' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ width: '65%', padding: '36px 28px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, marginBottom: '8px' }}>Profile</h2>
            <p style={{ fontSize: '11px', color: body, lineHeight: 1.7 }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, marginBottom: '14px' }}>Experience</h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: `1px solid ${line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 600, color: black }}>{exp.position}</h3>
                  <span style={{ fontSize: '9.5px', color: muted, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '10.5px', color: muted, marginBottom: '3px' }}>
                  {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                </p>
                {exp.description && <p style={{ fontSize: '10.5px', color: body, lineHeight: 1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, marginBottom: '14px' }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `1px solid ${line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: black }}>{edu.institution}</h3>
                  <span style={{ fontSize: '9.5px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{edu.startDate} — {edu.endDate}</span>
                </div>
                <p style={{ fontSize: '10.5px', color: body }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: black, marginBottom: '14px' }}>Projects</h2>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `1px solid ${line}` }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: black }}>{proj.name}</h3>
                {proj.technologies && <p style={{ fontSize: '9.5px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{proj.technologies}</p>}
                {proj.description && <p style={{ fontSize: '10.5px', color: body, lineHeight: 1.5 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ EXECUTIVE TEMPLATE ============
// Bold header bar, two-column body
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  if (!(personalInfo.fullName || experiences.length > 0 || education.length > 0)) return emptyState;

  const black = '#09090B';
  const body = '#3f3f46';
  const muted = '#71717A';
  const line = '#E4E4E7';
  const headerBg = '#09090B';
  const contactBg = '#F4F4F5';

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", color: black }}>
      {/* Header */}
      <div style={{ backgroundColor: headerBg, padding: '28px 40px', color: '#FAFAFA' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px' }}>
          {personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '12px', color: '#A1A1AA', fontWeight: 400, letterSpacing: '0.04em' }}>{personalInfo.title}</p>
        )}
      </div>

      {/* Contact bar */}
      <div style={{ backgroundColor: contactBg, padding: '8px 40px', display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9.5px', color: muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em' }}>
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>

      <div style={{ padding: '24px 40px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px', borderLeft: `2px solid ${black}`, paddingLeft: '14px' }}>
            <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.7 }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, color: black, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${line}`, paddingBottom: '4px' }}>
              Professional Experience
            </h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12.5px', fontWeight: 700, color: black }}>{exp.position}</h3>
                  <span style={{ fontSize: '9.5px', color: muted, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: muted, fontWeight: 500, marginBottom: '3px' }}>
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </p>
                {exp.description && <p style={{ fontSize: '11px', color: body, lineHeight: 1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '28px' }}>
          <div style={{ flex: '1' }}>
            {education.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, color: black, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${line}`, paddingBottom: '4px' }}>
                  Education
                </h2>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: black }}>{edu.institution}</h3>
                    <p style={{ fontSize: '10.5px', color: body }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''} · {edu.startDate}–{edu.endDate}
                    </p>
                    {edu.gpa && <p style={{ fontSize: '9.5px', color: muted }}>GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, color: black, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${line}`, paddingBottom: '4px' }}>
                  Key Projects
                </h2>
                {projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11.5px', fontWeight: 600, color: black }}>{proj.name}</h3>
                    {proj.description && <p style={{ fontSize: '10.5px', color: body, lineHeight: 1.5 }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '190px', flexShrink: 0 }}>
            {skills.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, color: black, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${line}`, paddingBottom: '4px' }}>
                  Skills
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {skills.map(skill => (
                    <span key={skill.id} style={{ fontSize: '9.5px', padding: '2px 7px', border: `1px solid ${line}`, color: body, fontFamily: "'JetBrains Mono', monospace" }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, color: black, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${line}`, paddingBottom: '4px' }}>
                  Certifications
                </h2>
                {certifications.map(cert => (
                  <div key={cert.id} style={{ marginBottom: '8px' }}>
                    <p style={{ fontSize: '10.5px', fontWeight: 500, color: black }}>{cert.name}</p>
                    <p style={{ fontSize: '9.5px', color: muted }}>{cert.issuer} · {cert.date}</p>
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
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        transformOrigin: 'top left',
      }}
    >
      <Template data={resumeData} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

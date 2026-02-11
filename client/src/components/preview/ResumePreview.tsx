/*
 * DESIGN: Resume Preview Component — Luxury Edition
 * Three templates with refined color palettes.
 * Classic: warm cream + gold accents
 * Modern: dark sidebar + gold headings
 * Executive: deep navy + champagne gold
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

function skillDots(level: string) {
  const levels: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
  const filled = levels[level] || 2;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i <= filled ? '#C9A96E' : '#3a3a3c' }}
        />
      ))}
    </div>
  );
}

const emptyState = (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px' }}>
    <div>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#2a2a2a', marginBottom: '8px', fontWeight: 500 }}>
        Your resume preview will appear here
      </p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#999' }}>
        Start filling in your details, or load sample data.
      </p>
    </div>
  </div>
);

// ============ CLASSIC TEMPLATE ============
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;
  if (!(personalInfo.fullName || experiences.length > 0 || education.length > 0)) return emptyState;

  const gold = '#C9A96E';
  const dark = '#1a1a1a';
  const body = '#3a3a3a';
  const muted = '#777';
  const line = '#e8e2d8';
  const tagBg = '#f7f4ef';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: dark, padding: '44px 40px', lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: `2px solid ${gold}`, paddingBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '30px', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px', color: dark }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontStyle: 'italic', color: gold, marginBottom: '10px', fontWeight: 400 }}>
            {personalInfo.title}
          </p>
        )}
        <div style={{ fontSize: '10.5px', color: muted, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '22px' }}>
          <p style={{ fontSize: '12px', color: body, lineHeight: 1.65 }}>{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Experience
          </h2>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13.5px', fontWeight: 600, color: dark }}>{exp.position}</h3>
                <span style={{ fontSize: '10.5px', color: muted, whiteSpace: 'nowrap' }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: gold, fontStyle: 'italic', marginBottom: '4px' }}>
                {exp.company}{exp.location ? `, ${exp.location}` : ''}
              </p>
              {exp.description && <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.6 }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px', fontWeight: 600, color: dark }}>{edu.institution}</h3>
                <span style={{ fontSize: '10.5px', color: muted }}>{edu.startDate} — {edu.endDate}</span>
              </div>
              <p style={{ fontSize: '11.5px', color: body }}>
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
              </p>
              {edu.description && <p style={{ fontSize: '11px', color: muted, fontStyle: 'italic' }}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map(skill => (
              <span key={skill.id} style={{ fontSize: '11px', padding: '3px 10px', backgroundColor: tagBg, borderRadius: '2px', color: body, border: `1px solid ${line}` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Projects
          </h2>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px', fontWeight: 600, color: dark }}>{proj.name}</h3>
              {proj.technologies && <p style={{ fontSize: '10.5px', color: gold, marginBottom: '2px' }}>{proj.technologies}</p>}
              {proj.description && <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.6 }}>{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, borderBottom: `1px solid ${line}`, paddingBottom: '4px', marginBottom: '12px' }}>
            Certifications
          </h2>
          {certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: dark }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: '11px', color: muted }}> — {cert.issuer}</span>}
              </div>
              {cert.date && <span style={{ fontSize: '10.5px', color: muted }}>{cert.date}</span>}
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
  if (!(personalInfo.fullName || experiences.length > 0 || education.length > 0)) return emptyState;

  const gold = '#C9A96E';
  const sidebarBg = '#1a1a1a';
  const sidebarText = '#e8e2d8';
  const dark = '#1a1a1a';
  const body = '#3a3a3a';
  const muted = '#888';
  const line = '#e0dbd4';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: dark, display: 'flex', minHeight: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: '35%', backgroundColor: sidebarBg, color: sidebarText, padding: '36px 22px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 600, marginBottom: '4px', color: '#fff' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '12px', color: gold, marginBottom: '24px', fontWeight: 500 }}>{personalInfo.title}</p>
        )}

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: gold, marginBottom: '10px', fontWeight: 600 }}>Contact</h3>
          <div style={{ fontSize: '11px', lineHeight: 1.7, color: '#bbb' }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: gold, marginBottom: '12px', fontWeight: 600 }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {skills.map(skill => (
                <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>{skill.name}</span>
                  {skillDots(skill.level)}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: gold, marginBottom: '12px', fontWeight: 600 }}>Certifications</h3>
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 500, color: '#f0ece4' }}>{cert.name}</p>
                <p style={{ fontSize: '10px', color: '#888' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ width: '65%', padding: '36px 28px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, marginBottom: '8px' }}>Profile</h2>
            <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.65 }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, marginBottom: '14px' }}>Experience</h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: `2px solid ${line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: dark }}>{exp.position}</h3>
                  <span style={{ fontSize: '10px', color: muted, whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: gold, marginBottom: '4px' }}>
                  {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                </p>
                {exp.description && <p style={{ fontSize: '11px', color: body, lineHeight: 1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, marginBottom: '14px' }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 600, color: dark }}>{edu.institution}</h3>
                  <span style={{ fontSize: '10px', color: muted }}>{edu.startDate} — {edu.endDate}</span>
                </div>
                <p style={{ fontSize: '11px', color: body }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: gold, marginBottom: '14px' }}>Projects</h2>
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${line}` }}>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: dark }}>{proj.name}</h3>
                {proj.technologies && <p style={{ fontSize: '10px', color: gold }}>{proj.technologies}</p>}
                {proj.description && <p style={{ fontSize: '11px', color: body, lineHeight: 1.5 }}>{proj.description}</p>}
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
  if (!(personalInfo.fullName || experiences.length > 0 || education.length > 0)) return emptyState;

  const navy = '#0f1b2d';
  const gold = '#C9A96E';
  const dark = '#1a1a1a';
  const body = '#3a3a3a';
  const muted = '#888';
  const contactBg = '#f7f4ef';
  const line = '#e0dbd4';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: dark }}>
      {/* Header */}
      <div style={{ backgroundColor: navy, padding: '30px 40px', color: '#fff' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '4px' }}>
          {personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: '13px', color: gold, fontWeight: 500, letterSpacing: '0.03em' }}>{personalInfo.title}</p>
        )}
      </div>

      {/* Contact bar */}
      <div style={{ backgroundColor: contactBg, padding: '10px 40px', display: 'flex', flexWrap: 'wrap', gap: '4px 20px', fontSize: '10.5px', color: '#6b6158' }}>
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>

      <div style={{ padding: '26px 40px' }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px', borderLeft: `3px solid ${navy}`, paddingLeft: '16px' }}>
            <p style={{ fontSize: '12px', color: body, lineHeight: 1.65, fontStyle: 'italic' }}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, color: navy, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${navy}`, paddingBottom: '4px' }}>
              Professional Experience
            </h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: navy }}>{exp.position}</h3>
                  <span style={{ fontSize: '10.5px', color: muted, whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: gold, fontWeight: 500, marginBottom: '4px' }}>
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </p>
                {exp.description && <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.6 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ flex: '1' }}>
            {education.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, color: navy, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${navy}`, paddingBottom: '4px' }}>
                  Education
                </h2>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, color: navy }}>{edu.institution}</h3>
                    <p style={{ fontSize: '11px', color: body }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''} · {edu.startDate}–{edu.endDate}
                    </p>
                    {edu.gpa && <p style={{ fontSize: '10px', color: muted }}>GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, color: navy, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${navy}`, paddingBottom: '4px' }}>
                  Key Projects
                </h2>
                {projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, color: navy }}>{proj.name}</h3>
                    {proj.description && <p style={{ fontSize: '11px', color: body, lineHeight: 1.5 }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '200px', flexShrink: 0 }}>
            {skills.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, color: navy, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${navy}`, paddingBottom: '4px' }}>
                  Skills
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {skills.map(skill => (
                    <span key={skill.id} style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: contactBg, color: body, borderRadius: '1px', border: `1px solid ${line}` }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 600, color: navy, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: `1px solid ${navy}`, paddingBottom: '4px' }}>
                  Certifications
                </h2>
                {certifications.map(cert => (
                  <div key={cert.id} style={{ marginBottom: '8px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: dark }}>{cert.name}</p>
                    <p style={{ fontSize: '10px', color: muted }}>{cert.issuer} · {cert.date}</p>
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
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
        transformOrigin: 'top left',
      }}
    >
      <Template data={resumeData} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

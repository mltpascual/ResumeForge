/**
 * New Resume Templates: Creative, Developer, Academic, Elegance
 * All use inline styles for PDF export fidelity.
 */

import { type TemplateProps } from './ResumePreview';
import { type SectionId } from '@/contexts/ResumeContext';
import { type ResumeData, type FontPairing } from '@/types/resume';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function sz(base: number, scale: number): string {
  return `${(base * scale).toFixed(1)}px`;
}

function renderDescription(text: string, style: React.CSSProperties): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  const bulletLines: string[] = [];
  const result: React.ReactNode[] = [];
  const flushBullets = () => {
    if (bulletLines.length > 0) {
      result.push(
        <ul key={`ul-${result.length}`} style={{ ...style, margin: '2px 0', paddingLeft: '16px', listStyleType: 'disc' }}>
          {bulletLines.map((line, i) => <li key={i} style={{ marginBottom: '1px' }}>{line}</li>)}
        </ul>
      );
      bulletLines.length = 0;
    }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      bulletLines.push(trimmed.replace(/^[•\-*]\s*/, ''));
    } else if (trimmed === '') {
      flushBullets();
    } else {
      flushBullets();
      result.push(<p key={`p-${result.length}`} style={style}>{trimmed}</p>);
    }
  }
  flushBullets();
  return <>{result}</>;
}

function lightenColor(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const r = Math.min(255, parseInt(c.substring(0, 2), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(c.substring(2, 4), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(c.substring(4, 6), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ============ CREATIVE TEMPLATE ============
// Bold, colorful header with asymmetric layout and playful typography
export function CreativeTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px' }}><div><p style={{ fontSize: '18px', fontWeight: 600 }}>Your resume preview</p><p style={{ fontSize: '13px', color: '#A1A1AA' }}>Start filling in your details.</p></div></div>;
  }

  const bgLight = lightenColor(accent, 0.82);

  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(13, fs), fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.08em', color: accent,
    marginBottom: '10px', position: 'relative' as const, paddingLeft: '14px',
  };

  const sectionMap: Record<SectionId, React.ReactNode> = {
    experiences: data.experiences.length === 0 ? null : (
      <div key="experiences" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}><span style={{ position: 'absolute', left: 0, top: '2px', width: '4px', height: '16px', background: accent, borderRadius: '2px' }} />Experience</h2>
        {data.experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `2px solid ${bgLight}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: sz(12.5, fs), fontWeight: 700, color: '#1a1a2e' }}>{exp.position}</h3>
              <span style={{ fontSize: sz(9.5, fs), color: '#888', fontFamily: font.mono }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
            <p style={{ fontSize: sz(10.5, fs), color: accent, fontWeight: 600, fontFamily: font.body }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
            {exp.description && renderDescription(exp.description, { fontSize: sz(10.5, fs), color: '#444', lineHeight: 1.6 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    education: data.education.length === 0 ? null : (
      <div key="education" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}><span style={{ position: 'absolute', left: 0, top: '2px', width: '4px', height: '16px', background: accent, borderRadius: '2px' }} />Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '14px' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 700, color: '#1a1a2e' }}>{edu.institution}</h3>
            <p style={{ fontSize: sz(10.5, fs), color: '#555', fontFamily: font.body }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
            <span style={{ fontSize: sz(9.5, fs), color: '#888', fontFamily: font.mono }}>{edu.startDate} — {edu.endDate}</span>
          </div>
        ))}
      </div>
    ),
    skills: !data.skills?.trim() ? null : (
      <div key="skills" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}><span style={{ position: 'absolute', left: 0, top: '2px', width: '4px', height: '16px', background: accent, borderRadius: '2px' }} />Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '14px' }}>
          {data.skills.split(',').map((skill, i) => (
            <span key={i} style={{ fontSize: sz(9.5, fs), padding: '3px 10px', borderRadius: '20px', background: bgLight, color: accent, fontWeight: 600, fontFamily: font.body }}>{skill.trim()}</span>
          ))}
        </div>
      </div>
    ),
    projects: data.projects.length === 0 ? null : (
      <div key="projects" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}><span style={{ position: 'absolute', left: 0, top: '2px', width: '4px', height: '16px', background: accent, borderRadius: '2px' }} />Projects</h2>
        {data.projects.map(proj => (
          <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '14px' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 700, color: '#1a1a2e' }}>{proj.name}</h3>
            {proj.technologies && <p style={{ fontSize: sz(9.5, fs), color: accent, fontFamily: font.mono, fontWeight: 500 }}>{proj.technologies}</p>}
            {proj.description && renderDescription(proj.description, { fontSize: sz(10.5, fs), color: '#444', lineHeight: 1.6 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    certifications: data.certifications.length === 0 ? null : (
      <div key="certifications" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}><span style={{ position: 'absolute', left: 0, top: '2px', width: '4px', height: '16px', background: accent, borderRadius: '2px' }} />Certifications</h2>
        {data.certifications.map(cert => (
          <div key={cert.id} style={{ marginBottom: '6px', paddingLeft: '14px' }}>
            <span style={{ fontSize: sz(10.5, fs), fontWeight: 600, color: '#1a1a2e', fontFamily: font.body }}>{cert.name}</span>
            {cert.issuer && <span style={{ fontSize: sz(10, fs), color: '#888', fontFamily: font.body }}> — {cert.issuer}</span>}
            {cert.date && <span style={{ fontSize: sz(9.5, fs), color: '#aaa', fontFamily: font.mono, marginLeft: '8px' }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div style={{ fontFamily: font.body, color: '#1a1a2e' }}>
      {/* Colorful header */}
      <div style={{ background: accent, padding: `${32 * ms}px ${40 * ms}px`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '60px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <h1 style={{ fontFamily: font.heading, fontSize: sz(28, fs), fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '4px' }}>{personalInfo.fullName}</h1>
        {personalInfo.title && <p style={{ fontSize: sz(14, fs), fontWeight: 300, opacity: 0.9, fontFamily: font.body }}>{personalInfo.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', fontSize: sz(10, fs), opacity: 0.85 }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span>◎ {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>⊕ {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>⊙ {personalInfo.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${28 * ms}px ${40 * ms}px`, lineHeight: 1.5 * ls }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px', padding: '14px 18px', background: bgLight, borderRadius: '8px', borderLeft: `4px solid ${accent}` }}>
            <p style={{ fontSize: sz(11, fs), color: '#333', lineHeight: 1.7 * ls, fontFamily: font.body, fontStyle: 'italic' }}>{personalInfo.summary}</p>
          </div>
        )}
        {sectionOrder.map(id => sectionMap[id])}
      </div>
    </div>
  );
}

// ============ DEVELOPER TEMPLATE ============
// Monospace-inspired, terminal-like aesthetic with skills bar chart
export function DeveloperTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px' }}><div><p style={{ fontSize: '18px', fontWeight: 600 }}>Your resume preview</p><p style={{ fontSize: '13px', color: '#A1A1AA' }}>Start filling in your details.</p></div></div>;
  }

  const monoFont = font.mono || "'JetBrains Mono', 'Fira Code', monospace";
  const headingStyle: React.CSSProperties = {
    fontFamily: monoFont, fontSize: sz(11, fs), fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em', color: accent,
    marginBottom: '10px', paddingBottom: '4px',
    borderBottom: `1px dashed ${accent}`,
  };

  const sectionMap: Record<SectionId, React.ReactNode> = {
    experiences: data.experiences.length === 0 ? null : (
      <div key="experiences" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}>{'// Experience'}</h2>
        {data.experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: sz(12.5, fs), fontWeight: 700, color: '#e2e8f0' }}>{exp.position}</h3>
              <span style={{ fontSize: sz(9, fs), color: '#64748b', fontFamily: monoFont }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
            <p style={{ fontSize: sz(10, fs), color: accent, fontFamily: monoFont }}>{exp.company}{exp.location ? ` // ${exp.location}` : ''}</p>
            {exp.description && renderDescription(exp.description, { fontSize: sz(10, fs), color: '#94a3b8', lineHeight: 1.6 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    education: data.education.length === 0 ? null : (
      <div key="education" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}>{'// Education'}</h2>
        {data.education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '10px' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 700, color: '#e2e8f0' }}>{edu.institution}</h3>
            <p style={{ fontSize: sz(10, fs), color: '#94a3b8', fontFamily: font.body }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
            <span style={{ fontSize: sz(9, fs), color: '#64748b', fontFamily: monoFont }}>{edu.startDate} — {edu.endDate}</span>
          </div>
        ))}
      </div>
    ),
    skills: !data.skills?.trim() ? null : (
      <div key="skills" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}>{'// Skills'}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {data.skills.split(',').map((skill, i) => (
            <span key={i} style={{ fontSize: sz(9, fs), padding: '2px 8px', borderRadius: '3px', background: '#1e293b', border: `1px solid ${accent}40`, color: accent, fontFamily: monoFont }}>{skill.trim()}</span>
          ))}
        </div>
      </div>
    ),
    projects: data.projects.length === 0 ? null : (
      <div key="projects" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}>{'// Projects'}</h2>
        {data.projects.map(proj => (
          <div key={proj.id} style={{ marginBottom: '10px' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 700, color: '#e2e8f0' }}>{proj.name}</h3>
            {proj.technologies && <p style={{ fontSize: sz(9, fs), color: accent, fontFamily: monoFont }}>stack: [{proj.technologies}]</p>}
            {proj.description && renderDescription(proj.description, { fontSize: sz(10, fs), color: '#94a3b8', lineHeight: 1.6 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    certifications: data.certifications.length === 0 ? null : (
      <div key="certifications" style={{ marginBottom: '20px' }}>
        <h2 style={headingStyle}>{'// Certifications'}</h2>
        {data.certifications.map(cert => (
          <div key={cert.id} style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: sz(10, fs), fontWeight: 600, color: '#e2e8f0', fontFamily: font.body }}>{cert.name}</span>
            {cert.issuer && <span style={{ fontSize: sz(9.5, fs), color: '#64748b', fontFamily: monoFont }}> @ {cert.issuer}</span>}
            {cert.date && <span style={{ fontSize: sz(9, fs), color: '#475569', fontFamily: monoFont, marginLeft: '8px' }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div style={{ fontFamily: font.body, background: '#0f172a', color: '#e2e8f0', minHeight: '297mm' }}>
      {/* Terminal-style header */}
      <div style={{ padding: `${32 * ms}px ${40 * ms}px`, borderBottom: `2px solid ${accent}` }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <h1 style={{ fontFamily: monoFont, fontSize: sz(26, fs), fontWeight: 800, color: accent, marginBottom: '4px' }}>
          {'> '}{personalInfo.fullName}
        </h1>
        {personalInfo.title && <p style={{ fontSize: sz(13, fs), color: '#94a3b8', fontFamily: monoFont }}>{'$ '}{personalInfo.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: sz(9.5, fs), color: '#64748b', fontFamily: monoFont }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${28 * ms}px ${40 * ms}px`, lineHeight: 1.5 * ls }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px', padding: '12px 16px', background: '#1e293b', borderRadius: '6px', borderLeft: `3px solid ${accent}` }}>
            <p style={{ fontSize: sz(10.5, fs), color: '#94a3b8', lineHeight: 1.7 * ls, fontFamily: font.body }}>{personalInfo.summary}</p>
          </div>
        )}
        {sectionOrder.map(id => sectionMap[id])}
      </div>
    </div>
  );
}

// ============ ACADEMIC TEMPLATE ============
// Formal, serif-heavy, two-page-friendly with clear section hierarchy
export function AcademicTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px' }}><div><p style={{ fontSize: '18px', fontWeight: 600 }}>Your resume preview</p><p style={{ fontSize: '13px', color: '#A1A1AA' }}>Start filling in your details.</p></div></div>;
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(13, fs), fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a1a',
    marginBottom: '10px', paddingBottom: '6px',
    borderBottom: `1px solid #ccc`,
  };

  const sectionMap: Record<SectionId, React.ReactNode> = {
    experiences: data.experiences.length === 0 ? null : (
      <div key="experiences" style={{ marginBottom: '22px' }}>
        <h2 style={headingStyle}>Professional Experience</h2>
        {data.experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: sz(12.5, fs), fontWeight: 700, color: '#111' }}>{exp.position}</h3>
              <span style={{ fontSize: sz(10, fs), color: '#666', fontFamily: font.body, fontStyle: 'italic' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
            <p style={{ fontSize: sz(11, fs), color: '#444', fontFamily: font.body, fontStyle: 'italic' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
            {exp.description && renderDescription(exp.description, { fontSize: sz(10.5, fs), color: '#333', lineHeight: 1.65 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    education: data.education.length === 0 ? null : (
      <div key="education" style={{ marginBottom: '22px' }}>
        <h2 style={headingStyle}>Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 700, color: '#111' }}>{edu.institution}</h3>
              <span style={{ fontSize: sz(10, fs), color: '#666', fontFamily: font.body, fontStyle: 'italic' }}>{edu.startDate} – {edu.endDate}</span>
            </div>
            <p style={{ fontSize: sz(11, fs), color: '#333', fontFamily: font.body }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
            {edu.description && renderDescription(edu.description, { fontSize: sz(10, fs), color: '#555', fontFamily: font.body, lineHeight: 1.6 * ls })}
          </div>
        ))}
      </div>
    ),
    skills: !data.skills?.trim() ? null : (
      <div key="skills" style={{ marginBottom: '22px' }}>
        <h2 style={headingStyle}>Technical Skills & Competencies</h2>
        <p style={{ fontSize: sz(11, fs), color: '#333', lineHeight: 1.7 * ls, fontFamily: font.body }}>{data.skills}</p>
      </div>
    ),
    projects: data.projects.length === 0 ? null : (
      <div key="projects" style={{ marginBottom: '22px' }}>
        <h2 style={headingStyle}>Research & Projects</h2>
        {data.projects.map(proj => (
          <div key={proj.id} style={{ marginBottom: '12px' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 700, color: '#111' }}>{proj.name}</h3>
            {proj.technologies && <p style={{ fontSize: sz(10, fs), color: '#666', fontFamily: font.body, fontStyle: 'italic' }}>{proj.technologies}</p>}
            {proj.description && renderDescription(proj.description, { fontSize: sz(10.5, fs), color: '#333', lineHeight: 1.6 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    certifications: data.certifications.length === 0 ? null : (
      <div key="certifications" style={{ marginBottom: '22px' }}>
        <h2 style={headingStyle}>Certifications & Awards</h2>
        {data.certifications.map(cert => (
          <div key={cert.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: sz(11, fs), fontWeight: 600, color: '#111', fontFamily: font.body }}>{cert.name}</span>
              {cert.issuer && <span style={{ fontSize: sz(10.5, fs), color: '#666', fontFamily: font.body }}> — {cert.issuer}</span>}
            </div>
            {cert.date && <span style={{ fontSize: sz(10, fs), color: '#888', fontFamily: font.body, fontStyle: 'italic' }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div style={{ fontFamily: font.body, color: '#111', padding: `${48 * ms}px ${50 * ms}px`, lineHeight: 1.5 * ls }}>
      {/* Formal header */}
      <div style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '18px', borderBottom: '2px solid #111' }}>
        <h1 style={{ fontFamily: font.heading, fontSize: sz(26, fs), fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{personalInfo.fullName}</h1>
        {personalInfo.title && <p style={{ fontSize: sz(13, fs), color: '#444', fontFamily: font.body, fontStyle: 'italic', marginBottom: '8px' }}>{personalInfo.title}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', fontSize: sz(10, fs), color: '#555' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: sz(11, fs), color: '#333', lineHeight: 1.7 * ls, fontFamily: font.body, textAlign: 'justify' }}>{personalInfo.summary}</p>
        </div>
      )}

      {sectionOrder.map(id => sectionMap[id])}
    </div>
  );
}

// ============ ELEGANCE TEMPLATE ============
// Refined, minimal with subtle accent touches, generous whitespace
export function EleganceTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px' }}><div><p style={{ fontSize: '18px', fontWeight: 600 }}>Your resume preview</p><p style={{ fontSize: '13px', color: '#A1A1AA' }}>Start filling in your details.</p></div></div>;
  }

  const bgLight = lightenColor(accent, 0.88);

  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(10.5, fs), fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.2em', color: accent,
    marginBottom: '14px',
  };

  const sectionMap: Record<SectionId, React.ReactNode> = {
    experiences: data.experiences.length === 0 ? null : (
      <div key="experiences" style={{ marginBottom: '26px' }}>
        <h2 style={headingStyle}>Experience</h2>
        {data.experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: sz(13, fs), fontWeight: 600, color: '#1a1a1a' }}>{exp.position}</h3>
              <span style={{ fontSize: sz(9.5, fs), color: '#999', fontFamily: font.body, letterSpacing: '0.05em' }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
            <p style={{ fontSize: sz(10.5, fs), color: accent, fontWeight: 500, fontFamily: font.body, marginBottom: '4px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
            {exp.description && renderDescription(exp.description, { fontSize: sz(10.5, fs), color: '#555', lineHeight: 1.7 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    education: data.education.length === 0 ? null : (
      <div key="education" style={{ marginBottom: '26px' }}>
        <h2 style={headingStyle}>Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 600, color: '#1a1a1a' }}>{edu.institution}</h3>
              <span style={{ fontSize: sz(9.5, fs), color: '#999', fontFamily: font.body }}>{edu.startDate} — {edu.endDate}</span>
            </div>
            <p style={{ fontSize: sz(10.5, fs), color: '#555', fontFamily: font.body }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
          </div>
        ))}
      </div>
    ),
    skills: !data.skills?.trim() ? null : (
      <div key="skills" style={{ marginBottom: '26px' }}>
        <h2 style={headingStyle}>Skills</h2>
        <p style={{ fontSize: sz(10.5, fs), color: '#555', lineHeight: 1.8 * ls, fontFamily: font.body }}>{data.skills}</p>
      </div>
    ),
    projects: data.projects.length === 0 ? null : (
      <div key="projects" style={{ marginBottom: '26px' }}>
        <h2 style={headingStyle}>Projects</h2>
        {data.projects.map(proj => (
          <div key={proj.id} style={{ marginBottom: '12px' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 600, color: '#1a1a1a' }}>{proj.name}</h3>
            {proj.technologies && <p style={{ fontSize: sz(9.5, fs), color: '#999', fontFamily: font.body }}>{proj.technologies}</p>}
            {proj.description && renderDescription(proj.description, { fontSize: sz(10.5, fs), color: '#555', lineHeight: 1.7 * ls, fontFamily: font.body })}
          </div>
        ))}
      </div>
    ),
    certifications: data.certifications.length === 0 ? null : (
      <div key="certifications" style={{ marginBottom: '26px' }}>
        <h2 style={headingStyle}>Certifications</h2>
        {data.certifications.map(cert => (
          <div key={cert.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: sz(10.5, fs), fontWeight: 500, color: '#1a1a1a', fontFamily: font.body }}>{cert.name}</span>
              {cert.issuer && <span style={{ fontSize: sz(10, fs), color: '#999', fontFamily: font.body }}> — {cert.issuer}</span>}
            </div>
            {cert.date && <span style={{ fontSize: sz(9.5, fs), color: '#bbb', fontFamily: font.body }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div style={{ fontFamily: font.body, color: '#1a1a1a' }}>
      {/* Elegant header with subtle accent line */}
      <div style={{ padding: `${44 * ms}px ${48 * ms}px ${28 * ms}px`, borderBottom: `1px solid #e5e5e5` }}>
        <div style={{ width: '40px', height: '3px', background: accent, marginBottom: '18px', borderRadius: '2px' }} />
        <h1 style={{ fontFamily: font.heading, fontSize: sz(30, fs), fontWeight: 300, letterSpacing: '0.04em', marginBottom: '4px', color: '#1a1a1a' }}>{personalInfo.fullName}</h1>
        {personalInfo.title && <p style={{ fontSize: sz(12, fs), color: '#888', fontFamily: font.body, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400 }}>{personalInfo.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px', fontSize: sz(9.5, fs), color: '#999', letterSpacing: '0.02em' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${28 * ms}px ${48 * ms}px`, lineHeight: 1.5 * ls }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: sz(11, fs), color: '#666', lineHeight: 1.8 * ls, fontFamily: font.body }}>{personalInfo.summary}</p>
          </div>
        )}
        {sectionOrder.map(id => sectionMap[id])}
      </div>
    </div>
  );
}

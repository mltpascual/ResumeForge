/**
 * Resume Preview Templates with section order + accent color + font pairing + font size support
 * Templates: Classic, Modern, Executive, Compact, Minimal, TwoColumn
 * Skills rendered as comma-delimited text.
 * All use inline styles for PDF export fidelity.
 * Font size scaling via s(basePx, scale) helper.
 */

import { useResume, type SectionId } from '@/contexts/ResumeContext';
import { type ResumeData, type TemplateId, type FontPairing, FONT_PAIRINGS } from '@/types/resume';
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
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

function lightenColor(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  const r = Math.min(255, parseInt(c.substring(0, 2), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(c.substring(2, 4), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(c.substring(4, 6), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Scale a base px size by the fontSize factor */
function sz(base: number, scale: number): string {
  return `${(base * scale).toFixed(1)}px`;
}

export interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionId[];
  accent: string;
  font: FontPairing;
  fontSize: number;
  lineSpacing: number;
  marginSize: number;
}

/** Render description text with bullet point support.
 * Lines starting with • or - are rendered as bullet items.
 * Other lines are rendered as paragraphs.
 */
function renderDescription(text: string, style: React.CSSProperties): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  const bulletLines: string[] = [];
  const result: React.ReactNode[] = [];

  const flushBullets = () => {
    if (bulletLines.length > 0) {
      result.push(
        <ul key={`ul-${result.length}`} style={{ ...style, margin: '2px 0', paddingLeft: '16px', listStyleType: 'disc' }}>
          {bulletLines.map((line, i) => (
            <li key={i} style={{ marginBottom: '1px' }}>{line}</li>
          ))}
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

interface SectionColors {
  accent: string;
  black: string;
  body: string;
  muted: string;
  line: string;
}

const emptyState = (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '60px' }}>
    <div>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', color: '#09090B', marginBottom: '8px', fontWeight: 600 }}>
        Your resume preview
      </p>
      <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '13px', color: '#A1A1AA' }}>
        Start filling in your details, or load sample data.
      </p>
    </div>
  </div>
);

// ============ SECTION RENDERERS ============

interface SectionRendererProps {
  data: ResumeData;
  colors: SectionColors;
  headingStyle: React.CSSProperties;
  font: FontPairing;
  fs: number;
  ls: number;
  ms: number;
}

function ExperienceSection({ data, colors, headingStyle, font, fs, ls }: SectionRendererProps) {
  if (data.experiences.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Experience</h2>
      {data.experiences.map(exp => (
        <div key={exp.id} style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(13, fs), fontWeight: 600, color: colors.black }}>{exp.position}</h3>
            <span style={{ fontSize: sz(10, fs), color: colors.muted, whiteSpace: 'nowrap', fontFamily: font.mono }}>
              {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
            </span>
          </div>
          <p style={{ fontSize: sz(11, fs), color: colors.muted, marginBottom: '3px', fontFamily: font.body }}>
            {exp.company}{exp.location ? ` · ${exp.location}` : ''}
          </p>
          {exp.description && renderDescription(exp.description, { fontSize: sz(11, fs), color: colors.body, lineHeight: 1.6 * ls, fontFamily: font.body })}
        </div>
      ))}
    </div>
  );
}

function EducationSection({ data, colors, headingStyle, font, fs, ls }: SectionRendererProps) {
  if (data.education.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Education</h2>
      {data.education.map(edu => (
        <div key={edu.id} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
            <span style={{ fontSize: sz(10, fs), color: colors.muted, fontFamily: font.mono }}>{edu.startDate} — {edu.endDate}</span>
          </div>
          <p style={{ fontSize: sz(11, fs), color: colors.body, fontFamily: font.body, lineHeight: 1.5 * ls }}>
            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
          </p>
          {edu.description && renderDescription(edu.description, { fontSize: sz(10.5, fs), color: colors.muted, fontFamily: font.body, lineHeight: 1.5 * ls })}
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ data, colors, headingStyle, font, fs, ls }: SectionRendererProps) {
  if (!data.skills || !data.skills.trim()) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Skills</h2>
      <p style={{ fontSize: sz(11, fs), color: colors.body, lineHeight: 1.7 * ls, fontFamily: font.body }}>{data.skills}</p>
    </div>
  );
}

function ProjectsSection({ data, colors, headingStyle, font, fs, ls }: SectionRendererProps) {
  if (data.projects.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Projects</h2>
      {data.projects.map(proj => (
        <div key={proj.id} style={{ marginBottom: '10px' }}>
          <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 600, color: colors.black }}>{proj.name}</h3>
          {proj.technologies && <p style={{ fontSize: sz(10, fs), color: colors.muted, fontFamily: font.mono }}>{proj.technologies}</p>}
          {proj.description && renderDescription(proj.description, { fontSize: sz(11, fs), color: colors.body, lineHeight: 1.6 * ls, fontFamily: font.body })}
        </div>
      ))}
    </div>
  );
}

function CertificationsSection({ data, colors, headingStyle, font, fs, ls }: SectionRendererProps) {
  if (data.certifications.length === 0) return null;
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={headingStyle}>Certifications</h2>
      {data.certifications.map(cert => (
        <div key={cert.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontSize: sz(11, fs), fontWeight: 500, color: colors.black, fontFamily: font.body }}>{cert.name}</span>
            {cert.issuer && <span style={{ fontSize: sz(10.5, fs), color: colors.muted, fontFamily: font.body }}> — {cert.issuer}</span>}
          </div>
          {cert.date && <span style={{ fontSize: sz(10, fs), color: colors.muted, fontFamily: font.mono }}>{cert.date}</span>}
        </div>
      ))}
    </div>
  );
}

function renderOrderedSections(data: ResumeData, order: SectionId[], colors: SectionColors, headingStyle: React.CSSProperties, font: FontPairing, fs: number, ls: number, ms: number) {
  const sectionMap: Record<SectionId, React.ReactNode> = {
    experiences: <ExperienceSection key="experiences" data={data} colors={colors} headingStyle={headingStyle} font={font} fs={fs} ls={ls} ms={ms} />,
    education: <EducationSection key="education" data={data} colors={colors} headingStyle={headingStyle} font={font} fs={fs} ls={ls} ms={ms} />,
    skills: <SkillsSection key="skills" data={data} colors={colors} headingStyle={headingStyle} font={font} fs={fs} ls={ls} ms={ms} />,
    projects: <ProjectsSection key="projects" data={data} colors={colors} headingStyle={headingStyle} font={font} fs={fs} ls={ls} ms={ms} />,
    certifications: <CertificationsSection key="certifications" data={data} colors={colors} headingStyle={headingStyle} font={font} fs={fs} ls={ls} ms={ms} />,
  };
  return order.map(id => sectionMap[id]);
}

// ============ 1. CLASSIC TEMPLATE ============
export function ClassicTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(11, fs), fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em', color: accent,
    borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '12px',
  };

  return (
    <div style={{ fontFamily: font.body, color: colors.black, padding: `${44 * ms}px ${40 * ms}px`, lineHeight: 1.5 * ls }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: `2px solid ${accent}` }}>
        <h1 style={{ fontFamily: font.heading, fontSize: sz(28, fs), fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px', color: colors.black }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: sz(13, fs), color: accent, marginBottom: '10px', fontWeight: 500, fontFamily: font.body }}>{personalInfo.title}</p>
        )}
        <div style={{ fontSize: sz(10, fs), color: colors.muted, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 14px', fontFamily: font.mono }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>
      {personalInfo.summary && (
        <div style={{ marginBottom: '22px' }}>
          <p style={{ fontSize: sz(11.5, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{personalInfo.summary}</p>
        </div>
      )}
      {renderOrderedSections(data, sectionOrder, colors, headingStyle, font, fs, ls, ms)}
    </div>
  );
}

// ============ 2. MODERN TEMPLATE ============
export function ModernTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const sidebarBg = accent;
  const sidebarText = isLightColor(accent) ? '#09090B' : '#FAFAFA';
  const sidebarMuted = isLightColor(accent) ? '#3f3f46' : '#A1A1AA';
  const sidebarSubtle = isLightColor(accent) ? '#71717A' : '#71717A';

  const mainSections = sectionOrder.filter(s => s !== 'skills' && s !== 'certifications');
  const mainHeadingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(10, fs), fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em', color: accent,
    marginBottom: '10px', paddingBottom: '4px', borderBottom: `2px solid ${accent}`,
  };

  return (
    <div style={{ fontFamily: font.body, color: colors.black, display: 'flex', minHeight: '100%', lineHeight: 1.5 * ls }}>
      <div style={{ width: '35%', backgroundColor: sidebarBg, color: sidebarText, padding: `${36 * ms}px ${22 * ms}px` }}>
        <h1 style={{ fontFamily: font.heading, fontSize: sz(22, fs), fontWeight: 700, marginBottom: '2px', color: sidebarText, letterSpacing: '-0.03em' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: sz(11, fs), color: sidebarMuted, marginBottom: '24px', fontFamily: font.body }}>{personalInfo.title}</p>
        )}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: sz(9, fs), textTransform: 'uppercase', letterSpacing: '0.15em', color: sidebarSubtle, marginBottom: '10px', fontWeight: 600, fontFamily: font.mono }}>Contact</h3>
          <div style={{ fontSize: sz(10.5, fs), lineHeight: 1.8, color: sidebarMuted, fontFamily: font.body }}>
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>
        {data.skills && data.skills.trim() && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: sz(9, fs), textTransform: 'uppercase', letterSpacing: '0.15em', color: sidebarSubtle, marginBottom: '12px', fontWeight: 600, fontFamily: font.mono }}>Skills</h3>
            <p style={{ fontSize: sz(10.5, fs), color: sidebarText, lineHeight: 1.7, fontFamily: font.body }}>{data.skills}</p>
          </div>
        )}
        {data.certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: sz(9, fs), textTransform: 'uppercase', letterSpacing: '0.15em', color: sidebarSubtle, marginBottom: '12px', fontWeight: 600, fontFamily: font.mono }}>Certifications</h3>
            {data.certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: sz(10.5, fs), fontWeight: 500, color: sidebarText, fontFamily: font.body }}>{cert.name}</p>
                <p style={{ fontSize: sz(9.5, fs), color: sidebarSubtle, fontFamily: font.body }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '65%', padding: `${36 * ms}px ${28 * ms}px` }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={mainHeadingStyle}>Profile</h2>
            <p style={{ fontSize: sz(11, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{personalInfo.summary}</p>
          </div>
        )}
        {mainSections.map(sectionId => {
          switch (sectionId) {
            case 'experiences':
              if (data.experiences.length === 0) return null;
              return (
                <div key="experiences" style={{ marginBottom: '22px' }}>
                  <h2 style={mainHeadingStyle}>Experience</h2>
                  {data.experiences.map(exp => (
                    <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: `2px solid ${accent}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 600, color: colors.black }}>{exp.position}</h3>
                        <span style={{ fontSize: sz(9.5, fs), color: colors.muted, whiteSpace: 'nowrap', fontFamily: font.mono }}>
                          {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p style={{ fontSize: sz(10.5, fs), color: colors.muted, marginBottom: '3px', fontFamily: font.body }}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                      {exp.description && renderDescription(exp.description, { fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.6 * ls, fontFamily: font.body })}
                    </div>
                  ))}
                </div>
              );
            case 'education':
              if (data.education.length === 0) return null;
              return (
                <div key="education" style={{ marginBottom: '22px' }}>
                  <h2 style={mainHeadingStyle}>Education</h2>
                  {data.education.map(edu => (
                    <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${accent}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontFamily: font.heading, fontSize: sz(11.5, fs), fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
                        <span style={{ fontSize: sz(9.5, fs), color: colors.muted, fontFamily: font.mono }}>{edu.startDate} — {edu.endDate}</span>
                      </div>
                      <p style={{ fontSize: sz(10.5, fs), color: colors.body, fontFamily: font.body }}>
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
                  <h2 style={mainHeadingStyle}>Projects</h2>
                  {data.projects.map(proj => (
                    <div key={proj.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `2px solid ${accent}` }}>
                      <h3 style={{ fontFamily: font.heading, fontSize: sz(11.5, fs), fontWeight: 600, color: colors.black }}>{proj.name}</h3>
                      {proj.technologies && <p style={{ fontSize: sz(9.5, fs), color: colors.muted, fontFamily: font.mono }}>{proj.technologies}</p>}
                      {proj.description && renderDescription(proj.description, { fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.5 * ls, fontFamily: font.body })}
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

// ============ 3. EXECUTIVE TEMPLATE ============
export function ExecutiveTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const headerText = isLightColor(accent) ? '#09090B' : '#FAFAFA';
  const headerMuted = isLightColor(accent) ? '#3f3f46' : '#A1A1AA';
  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(11, fs), fontWeight: 700,
    color: accent, textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: '12px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px',
  };

  const leftSections = sectionOrder.filter(s => s === 'education' || s === 'projects');
  const rightSections = sectionOrder.filter(s => s === 'skills' || s === 'certifications');

  return (
    <div style={{ fontFamily: font.body, color: colors.black, lineHeight: 1.5 * ls }}>
      <div style={{ backgroundColor: accent, padding: `${28 * ms}px ${40 * ms}px`, color: headerText }}>
        <h1 style={{ fontFamily: font.heading, fontSize: sz(26, fs), fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px' }}>
          {personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: sz(12, fs), color: headerMuted, fontWeight: 400, fontFamily: font.body }}>{personalInfo.title}</p>
        )}
      </div>

      <div style={{ backgroundColor: lightenColor(accent, 0.7), padding: `8px ${40 * ms}px`, display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: sz(9.5, fs), color: colors.muted, fontFamily: font.mono }}>
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>

      <div style={{ padding: `${24 * ms}px ${40 * ms}px` }}>
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px', borderLeft: `3px solid ${accent}`, paddingLeft: '14px' }}>
            <p style={{ fontSize: sz(11.5, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{personalInfo.summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <h2 style={headingStyle}>Professional Experience</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontFamily: font.heading, fontSize: sz(12.5, fs), fontWeight: 700, color: colors.black }}>{exp.position}</h3>
                  <span style={{ fontSize: sz(9.5, fs), color: colors.muted, whiteSpace: 'nowrap', fontFamily: font.mono }}>
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p style={{ fontSize: sz(11, fs), color: colors.muted, fontWeight: 500, marginBottom: '3px', fontFamily: font.body }}>
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </p>
                {exp.description && renderDescription(exp.description, { fontSize: sz(11, fs), color: colors.body, lineHeight: 1.6 * ls, fontFamily: font.body })}
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
                          <h3 style={{ fontFamily: font.heading, fontSize: sz(11.5, fs), fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
                          <p style={{ fontSize: sz(10.5, fs), color: colors.body, fontFamily: font.body }}>
                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''} · {edu.startDate}–{edu.endDate}
                          </p>
                          {edu.gpa && <p style={{ fontSize: sz(9.5, fs), color: colors.muted, fontFamily: font.body }}>GPA: {edu.gpa}</p>}
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
                          <h3 style={{ fontFamily: font.heading, fontSize: sz(11.5, fs), fontWeight: 600, color: colors.black }}>{proj.name}</h3>
                          {proj.description && renderDescription(proj.description, { fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.5 * ls, fontFamily: font.body })}
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
                      <p style={{ fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{data.skills}</p>
                    </div>
                  );
                case 'certifications':
                  if (data.certifications.length === 0) return null;
                  return (
                    <div key="certifications" style={{ marginBottom: '22px' }}>
                      <h2 style={headingStyle}>Certifications</h2>
                      {data.certifications.map(cert => (
                        <div key={cert.id} style={{ marginBottom: '8px' }}>
                          <p style={{ fontSize: sz(10.5, fs), fontWeight: 500, color: colors.black, fontFamily: font.body }}>{cert.name}</p>
                          <p style={{ fontSize: sz(9.5, fs), color: colors.muted, fontFamily: font.body }}>{cert.issuer} · {cert.date}</p>
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

// ============ 4. COMPACT TEMPLATE ============
export function CompactTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(10, fs), fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.14em', color: accent,
    marginBottom: '8px', paddingBottom: '3px', borderBottom: `1.5px solid ${accent}`,
  };

  return (
    <div style={{ fontFamily: font.body, color: colors.black, padding: `${28 * ms}px ${32 * ms}px`, lineHeight: 1.4 * ls, fontSize: sz(10, fs) }}>
      {/* Compact header — name left, contact right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', paddingBottom: '10px', borderBottom: `2px solid ${accent}` }}>
        <div>
          <h1 style={{ fontFamily: font.heading, fontSize: sz(24, fs), fontWeight: 700, letterSpacing: '-0.03em', color: colors.black, marginBottom: '1px' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{ fontSize: sz(11, fs), color: accent, fontWeight: 500, fontFamily: font.body }}>{personalInfo.title}</p>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: sz(9, fs), color: colors.muted, fontFamily: font.mono, lineHeight: 1.7 }}>
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: sz(10, fs), color: colors.body, lineHeight: 1.6, fontFamily: font.body }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Compact sections — tighter spacing */}
      {sectionOrder.map(sectionId => {
        switch (sectionId) {
          case 'experiences':
            if (data.experiences.length === 0) return null;
            return (
              <div key="experiences" style={{ marginBottom: '14px' }}>
                <h2 style={headingStyle}>Experience</h2>
                {data.experiences.map(exp => (
                  <div key={exp.id} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: font.heading, fontSize: sz(11, fs), fontWeight: 600, color: colors.black }}>
                        {exp.position} <span style={{ fontWeight: 400, color: colors.muted }}>— {exp.company}</span>
                      </span>
                      <span style={{ fontSize: sz(9, fs), color: colors.muted, whiteSpace: 'nowrap', fontFamily: font.mono }}>
                        {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && renderDescription(exp.description, { fontSize: sz(10, fs), color: colors.body, lineHeight: 1.5 * ls, marginTop: '2px', fontFamily: font.body })}
                  </div>
                ))}
              </div>
            );
          case 'education':
            if (data.education.length === 0) return null;
            return (
              <div key="education" style={{ marginBottom: '14px' }}>
                <h2 style={headingStyle}>Education</h2>
                {data.education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: font.heading, fontSize: sz(10.5, fs), fontWeight: 600, color: colors.black }}>
                      {edu.institution} <span style={{ fontWeight: 400, color: colors.body }}>— {edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                    </span>
                    <span style={{ fontSize: sz(9, fs), color: colors.muted, fontFamily: font.mono }}>{edu.startDate}–{edu.endDate}</span>
                  </div>
                ))}
              </div>
            );
          case 'skills':
            if (!data.skills || !data.skills.trim()) return null;
            return (
              <div key="skills" style={{ marginBottom: '14px' }}>
                <h2 style={headingStyle}>Skills</h2>
                <p style={{ fontSize: sz(10, fs), color: colors.body, lineHeight: 1.6, fontFamily: font.body }}>{data.skills}</p>
              </div>
            );
          case 'projects':
            if (data.projects.length === 0) return null;
            return (
              <div key="projects" style={{ marginBottom: '14px' }}>
                <h2 style={headingStyle}>Projects</h2>
                {data.projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: '6px' }}>
                    <span style={{ fontFamily: font.heading, fontSize: sz(10.5, fs), fontWeight: 600, color: colors.black }}>{proj.name}</span>
                    {proj.technologies && <span style={{ fontSize: sz(9, fs), color: colors.muted, fontFamily: font.mono }}> · {proj.technologies}</span>}
                    {proj.description && renderDescription(proj.description, { fontSize: sz(10, fs), color: colors.body, lineHeight: 1.5 * ls, fontFamily: font.body })}
                  </div>
                ))}
              </div>
            );
          case 'certifications':
            if (data.certifications.length === 0) return null;
            return (
              <div key="certifications" style={{ marginBottom: '14px' }}>
                <h2 style={headingStyle}>Certifications</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 16px' }}>
                  {data.certifications.map(cert => (
                    <span key={cert.id} style={{ fontSize: sz(10, fs), color: colors.body, fontFamily: font.body }}>
                      {cert.name} <span style={{ color: colors.muted }}>({cert.issuer})</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

// ============ 5. MINIMAL TEMPLATE ============
export function MinimalTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(13, fs), fontWeight: 700,
    color: colors.black, marginBottom: '12px', paddingBottom: '6px',
    borderBottom: `1px solid ${colors.line}`,
  };

  return (
    <div style={{ fontFamily: font.body, color: colors.black, padding: `${48 * ms}px ${44 * ms}px`, lineHeight: 1.5 * ls }}>
      {/* Minimal header — clean, no accent color in header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: font.heading, fontSize: sz(32, fs), fontWeight: 700, letterSpacing: '-0.04em', color: colors.black, marginBottom: '4px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: sz(14, fs), color: colors.muted, marginBottom: '12px', fontFamily: font.body }}>{personalInfo.title}</p>
        )}
        <div style={{ fontSize: sz(10, fs), color: colors.muted, display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontFamily: font.mono }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: sz(12, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{personalInfo.summary}</p>
        </div>
      )}

      {renderOrderedSections(data, sectionOrder, colors, headingStyle, font, fs, ls, ms)}
    </div>
  );
}

// ============ 6. TWO COLUMN TEMPLATE ============
export function TwoColumnTemplate({ data, sectionOrder, accent, font, fontSize: fs, lineSpacing: ls, marginSize: ms }: TemplateProps) {
  const { personalInfo } = data;
  if (!(personalInfo.fullName || data.experiences.length > 0 || data.education.length > 0)) return emptyState;

  const colors: SectionColors = { accent, black: '#09090B', body: '#3f3f46', muted: '#71717A', line: '#E4E4E7' };
  const accentBg = lightenColor(accent, 0.82);
  const headingStyle: React.CSSProperties = {
    fontFamily: font.heading, fontSize: sz(10, fs), fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em', color: accent,
    marginBottom: '10px',
  };

  const leftSections = sectionOrder.filter(s => s === 'experiences' || s === 'projects');
  const rightSections = sectionOrder.filter(s => s === 'education' || s === 'skills' || s === 'certifications');

  return (
    <div style={{ fontFamily: font.body, color: colors.black, lineHeight: 1.5 * ls }}>
      {/* Header */}
      <div style={{ padding: `${32 * ms}px ${36 * ms}px`, borderBottom: `3px solid ${accent}` }}>
        <h1 style={{ fontFamily: font.heading, fontSize: sz(28, fs), fontWeight: 700, letterSpacing: '-0.03em', color: colors.black, marginBottom: '2px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ fontSize: sz(13, fs), color: accent, fontWeight: 500, marginBottom: '10px', fontFamily: font.body }}>{personalInfo.title}</p>
        )}
        <div style={{ fontSize: sz(9.5, fs), color: colors.muted, display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontFamily: font.mono }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div style={{ padding: `16px ${36 * ms}px`, backgroundColor: accentBg }}>
          <p style={{ fontSize: sz(11, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: 'flex', padding: `${24 * ms}px ${36 * ms}px`, gap: '28px' }}>
        {/* Left — 60% */}
        <div style={{ flex: '1.4' }}>
          {leftSections.map(sectionId => {
            switch (sectionId) {
              case 'experiences':
                if (data.experiences.length === 0) return null;
                return (
                  <div key="experiences" style={{ marginBottom: '22px' }}>
                    <h2 style={headingStyle}>Experience</h2>
                    {data.experiences.map(exp => (
                      <div key={exp.id} style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: `1px solid ${colors.line}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h3 style={{ fontFamily: font.heading, fontSize: sz(12, fs), fontWeight: 600, color: colors.black }}>{exp.position}</h3>
                          <span style={{ fontSize: sz(9, fs), color: colors.muted, whiteSpace: 'nowrap', fontFamily: font.mono }}>
                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <p style={{ fontSize: sz(10.5, fs), color: colors.muted, marginBottom: '3px', fontFamily: font.body }}>
                          {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                        </p>
                        {exp.description && renderDescription(exp.description, { fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.6 * ls, fontFamily: font.body })}
                      </div>
                    ))}
                  </div>
                );
              case 'projects':
                if (data.projects.length === 0) return null;
                return (
                  <div key="projects" style={{ marginBottom: '22px' }}>
                    <h2 style={headingStyle}>Projects</h2>
                    {data.projects.map(proj => (
                      <div key={proj.id} style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontFamily: font.heading, fontSize: sz(11.5, fs), fontWeight: 600, color: colors.black }}>{proj.name}</h3>
                        {proj.technologies && <p style={{ fontSize: sz(9.5, fs), color: colors.muted, fontFamily: font.mono }}>{proj.technologies}</p>}
                        {proj.description && renderDescription(proj.description, { fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.5 * ls, fontFamily: font.body })}
                      </div>
                    ))}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Right — 40% */}
        <div style={{ flex: '1', paddingLeft: '20px', borderLeft: `2px solid ${accent}` }}>
          {rightSections.map(sectionId => {
            switch (sectionId) {
              case 'education':
                if (data.education.length === 0) return null;
                return (
                  <div key="education" style={{ marginBottom: '22px' }}>
                    <h2 style={headingStyle}>Education</h2>
                    {data.education.map(edu => (
                      <div key={edu.id} style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontFamily: font.heading, fontSize: sz(11, fs), fontWeight: 600, color: colors.black }}>{edu.institution}</h3>
                        <p style={{ fontSize: sz(10, fs), color: colors.body, fontFamily: font.body }}>
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </p>
                        <p style={{ fontSize: sz(9, fs), color: colors.muted, fontFamily: font.mono }}>{edu.startDate} — {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                );
              case 'skills':
                if (!data.skills || !data.skills.trim()) return null;
                return (
                  <div key="skills" style={{ marginBottom: '22px' }}>
                    <h2 style={headingStyle}>Skills</h2>
                    <p style={{ fontSize: sz(10.5, fs), color: colors.body, lineHeight: 1.7, fontFamily: font.body }}>{data.skills}</p>
                  </div>
                );
              case 'certifications':
                if (data.certifications.length === 0) return null;
                return (
                  <div key="certifications" style={{ marginBottom: '22px' }}>
                    <h2 style={headingStyle}>Certifications</h2>
                    {data.certifications.map(cert => (
                      <div key={cert.id} style={{ marginBottom: '8px' }}>
                        <p style={{ fontSize: sz(10.5, fs), fontWeight: 500, color: colors.black, fontFamily: font.body }}>{cert.name}</p>
                        <p style={{ fontSize: sz(9, fs), color: colors.muted, fontFamily: font.body }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
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
  );
}

// ============ MAIN PREVIEW COMPONENT ============
const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { resumeData, selectedTemplate, sectionOrder, accentColor, selectedFont, fontSize, lineSpacing, marginSize } = useResume();

  const templates: Record<TemplateId, React.ComponentType<TemplateProps>> = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
    compact: CompactTemplate,
    minimal: MinimalTemplate,
    twocolumn: TwoColumnTemplate,
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
      <Template data={resumeData} sectionOrder={sectionOrder} accent={accentColor} font={selectedFont} fontSize={fontSize} lineSpacing={lineSpacing} marginSize={marginSize} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;

import { useCallback } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  TabStopPosition, TabStopType, BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'present') return 'Present';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function DocxExport() {
  const { resumeData, accentColor } = useResume();

  const exportDocx = useCallback(async () => {
    try {
      const { personalInfo, experiences, education, skills, projects, certifications } = resumeData;

      // Convert hex color to docx format (remove #)
      const accent = accentColor.replace('#', '');

      const children: Paragraph[] = [];

      // Name
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: personalInfo.fullName || 'Your Name',
              bold: true,
              size: 36,
              color: accent,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Title
      if (personalInfo.title) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: personalInfo.title,
                size: 22,
                color: '555555',
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Contact line
      const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
        personalInfo.linkedin,
        personalInfo.website,
      ].filter(Boolean);

      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: contactParts.join('  |  '),
                size: 18,
                color: '777777',
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Summary
      if (personalInfo.summary) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            border: { bottom: { color: accent, space: 1, size: 6, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 22,
                color: accent,
                font: 'Calibri',
              }),
            ],
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: personalInfo.summary,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Experience
      if (experiences.length > 0) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            border: { bottom: { color: accent, space: 1, size: 6, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({
                text: 'EXPERIENCE',
                bold: true,
                size: 22,
                color: accent,
                font: 'Calibri',
              }),
            ],
          })
        );

        for (const exp of experiences) {
          // Position + Company
          children.push(
            new Paragraph({
              spacing: { before: 120, after: 40 },
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({
                  text: exp.position || 'Position',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: `\t${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`,
                  size: 18,
                  color: '777777',
                  font: 'Calibri',
                }),
              ],
            })
          );

          const companyParts = [exp.company, exp.location].filter(Boolean);
          if (companyParts.length > 0) {
            children.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: companyParts.join('  •  '),
                    italics: true,
                    size: 20,
                    color: '555555',
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }

          // Description bullets
          if (exp.description) {
            const bullets = exp.description.split('\n').filter(Boolean);
            for (const bullet of bullets) {
              children.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: bullet.replace(/^[-•*]\s*/, ''),
                      size: 20,
                      font: 'Calibri',
                    }),
                  ],
                })
              );
            }
          }
        }
      }

      // Education
      if (education.length > 0) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            border: { bottom: { color: accent, space: 1, size: 6, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 22,
                color: accent,
                font: 'Calibri',
              }),
            ],
          })
        );

        for (const edu of education) {
          children.push(
            new Paragraph({
              spacing: { before: 120, after: 40 },
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({
                  text: [edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: `\t${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`,
                  size: 18,
                  color: '777777',
                  font: 'Calibri',
                }),
              ],
            })
          );
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: edu.institution || '',
                  italics: true,
                  size: 20,
                  color: '555555',
                  font: 'Calibri',
                }),
                ...(edu.gpa ? [new TextRun({ text: `  •  GPA: ${edu.gpa}`, size: 20, color: '555555', font: 'Calibri' })] : []),
              ],
            })
          );
        }
      }

      // Skills
      if (skills) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            border: { bottom: { color: accent, space: 1, size: 6, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({
                text: 'SKILLS',
                bold: true,
                size: 22,
                color: accent,
                font: 'Calibri',
              }),
            ],
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: skills,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Projects
      if (projects.length > 0) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            border: { bottom: { color: accent, space: 1, size: 6, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({
                text: 'PROJECTS',
                bold: true,
                size: 22,
                color: accent,
                font: 'Calibri',
              }),
            ],
          })
        );

        for (const proj of projects) {
          children.push(
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [
                new TextRun({
                  text: proj.name || 'Project',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
                ...(proj.link ? [new TextRun({ text: `  •  ${proj.link}`, size: 18, color: accent, font: 'Calibri' })] : []),
              ],
            })
          );
          if (proj.technologies) {
            children.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: `Tech: ${proj.technologies}`,
                    italics: true,
                    size: 18,
                    color: '777777',
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
          if (proj.description) {
            children.push(
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: proj.description,
                    size: 20,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
        }
      }

      // Certifications
      if (certifications.length > 0) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            border: { bottom: { color: accent, space: 1, size: 6, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({
                text: 'CERTIFICATIONS',
                bold: true,
                size: 22,
                color: accent,
                font: 'Calibri',
              }),
            ],
          })
        );

        for (const cert of certifications) {
          children.push(
            new Paragraph({
              spacing: { before: 60, after: 40 },
              children: [
                new TextRun({
                  text: cert.name || 'Certification',
                  bold: true,
                  size: 20,
                  font: 'Calibri',
                }),
                ...(cert.issuer ? [new TextRun({ text: `  •  ${cert.issuer}`, size: 18, color: '555555', font: 'Calibri' })] : []),
                ...(cert.date ? [new TextRun({ text: `  •  ${formatDate(cert.date)}`, size: 18, color: '777777', font: 'Calibri' })] : []),
              ],
            })
          );
        }
      }

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 720, right: 720 },
            },
          },
          children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `${personalInfo.fullName || 'Resume'}_Resume.docx`.replace(/\s+/g, '_');
      saveAs(blob, fileName);
      toast.success('DOCX exported successfully');
    } catch (err) {
      console.error('DOCX export error:', err);
      toast.error('Failed to export DOCX');
    }
  }, [resumeData, accentColor]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={exportDocx}>
          <FileDown className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Export DOCX</TooltipContent>
    </Tooltip>
  );
}

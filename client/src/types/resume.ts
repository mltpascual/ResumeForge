export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string; // Comma-separated list of skills
  projects: Project[];
  certifications: Certification[];
}

export type TemplateId = 'classic' | 'modern' | 'executive' | 'compact' | 'minimal' | 'twocolumn';

export interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
  mono: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  { id: 'default', name: 'Space Grotesk + Archivo', heading: "'Space Grotesk', sans-serif", body: "'Archivo', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'classic-serif', name: 'Playfair Display + Source Sans', heading: "'Playfair Display', serif", body: "'Source Sans 3', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'modern-clean', name: 'DM Sans + Inter', heading: "'DM Sans', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'editorial', name: 'Lora + Nunito Sans', heading: "'Lora', serif", body: "'Nunito Sans', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'elegant', name: 'Crimson Text + Roboto', heading: "'Crimson Text', serif", body: "'Roboto', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'traditional', name: 'Merriweather + Source Sans', heading: "'Merriweather', serif", body: "'Source Sans 3', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'minimal-sans', name: 'Inter + Inter', heading: "'Inter', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" },
  { id: 'literary', name: 'Libre Baskerville + Archivo', heading: "'Libre Baskerville', serif", body: "'Archivo', sans-serif", mono: "'JetBrains Mono', monospace" },
];

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: '',
  projects: [],
  certifications: [],
};

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Alexandra Sterling',
    title: 'Senior Product Designer',
    email: 'alex.sterling@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'alexsterling.design',
    linkedin: 'linkedin.com/in/alexsterling',
    summary: 'Award-winning product designer with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies. Passionate about bridging the gap between user needs and business objectives through research-driven design and elegant visual systems.',
  },
  experiences: [
    {
      id: '1',
      company: 'Meridian Technologies',
      position: 'Senior Product Designer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Led the redesign of the core analytics platform, resulting in a 40% increase in user engagement. Managed a team of 4 designers and established a comprehensive design system used across 12 product teams.',
    },
    {
      id: '2',
      company: 'Cascade Studios',
      position: 'Product Designer',
      location: 'Portland, OR',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Designed end-to-end user experiences for mobile and web applications serving 2M+ users. Conducted user research studies and translated insights into actionable design improvements.',
    },
    {
      id: '3',
      company: 'Brightpath Digital',
      position: 'UI/UX Designer',
      location: 'Seattle, WA',
      startDate: '2016-01',
      endDate: '2018-05',
      current: false,
      description: 'Created wireframes, prototypes, and high-fidelity mockups for client projects across healthcare, fintech, and e-commerce sectors. Improved client satisfaction scores by 35%.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Rhode Island School of Design',
      degree: 'Master of Fine Arts',
      field: 'Graphic Design',
      startDate: '2014',
      endDate: '2016',
      gpa: '3.9',
      description: 'Thesis: "The Intersection of Typography and User Interface Design in Digital Media"',
    },
    {
      id: '2',
      institution: 'University of Washington',
      degree: 'Bachelor of Arts',
      field: 'Visual Communication Design',
      startDate: '2010',
      endDate: '2014',
      gpa: '3.7',
      description: '',
    },
  ],
  skills: 'Figma, Design Systems, User Research, Prototyping, HTML/CSS, React, Adobe Creative Suite, Motion Design',
  projects: [
    {
      id: '1',
      name: 'Meridian Design System',
      description: 'Built a comprehensive design system with 200+ components, serving 12 product teams and reducing design-to-development handoff time by 60%.',
      technologies: 'Figma, Storybook, React, TypeScript',
      link: '',
    },
    {
      id: '2',
      name: 'HealthBridge Patient Portal',
      description: 'Redesigned the patient portal experience for a major healthcare provider, improving task completion rates by 45% and reducing support tickets by 30%.',
      technologies: 'Figma, UserTesting, Maze',
      link: '',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'Google UX Design Professional Certificate',
      issuer: 'Google',
      date: '2022',
      link: '',
    },
    {
      id: '2',
      name: 'Certified Usability Analyst',
      issuer: 'Human Factors International',
      date: '2020',
      link: '',
    },
  ],
};

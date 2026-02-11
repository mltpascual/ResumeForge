/*
 * DESIGN: "Black Tie Elegance" — Personal Info Form
 * Dark inputs with gold focus states, refined typography.
 */

import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const labelClass = "text-xs tracking-[0.1em] uppercase text-muted-foreground flex items-center gap-1.5";
  const inputClass = "bg-secondary/50 border-border focus:border-gold/50 focus:ring-gold/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground/50";
  const labelStyle = { fontFamily: 'var(--font-body)', fontWeight: 500 } as const;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className={labelClass} style={labelStyle}>
            <User className="w-3.5 h-3.5 text-gold/60" />
            Full Name
          </Label>
          <Input
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="Alexandra Sterling"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass} style={labelStyle}>
            Professional Title
          </Label>
          <Input
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            placeholder="Senior Product Designer"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className={labelClass} style={labelStyle}>
            <Mail className="w-3.5 h-3.5 text-gold/60" />
            Email
          </Label>
          <Input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="alex@email.com"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass} style={labelStyle}>
            <Phone className="w-3.5 h-3.5 text-gold/60" />
            Phone
          </Label>
          <Input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 234-5678"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className={labelClass} style={labelStyle}>
            <MapPin className="w-3.5 h-3.5 text-gold/60" />
            Location
          </Label>
          <Input
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className={labelClass} style={labelStyle}>
            <Globe className="w-3.5 h-3.5 text-gold/60" />
            Website
          </Label>
          <Input
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="alexsterling.design"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelClass} style={labelStyle}>
          <Linkedin className="w-3.5 h-3.5 text-gold/60" />
          LinkedIn
        </Label>
        <Input
          value={personalInfo.linkedin}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          placeholder="linkedin.com/in/alexsterling"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs tracking-[0.1em] uppercase text-muted-foreground" style={labelStyle}>
          Professional Summary
        </Label>
        <Textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          placeholder="A brief overview of your professional background, key achievements, and career objectives..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
        <p className="text-xs text-muted-foreground/60" style={{ fontWeight: 300 }}>
          {personalInfo.summary.length}/500 characters
        </p>
      </div>
    </div>
  );
}

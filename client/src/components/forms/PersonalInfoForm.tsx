/*
 * DESIGN: "Ink & Paper" — Personal Info Form
 * Warm inputs with terracotta focus states, editorial typography.
 */

import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            <User className="w-3.5 h-3.5" />
            Full Name
          </Label>
          <Input
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="Alexandra Sterling"
            className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            Professional Title
          </Label>
          <Input
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            placeholder="Senior Product Designer"
            className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            <Mail className="w-3.5 h-3.5" />
            Email
          </Label>
          <Input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="alex@email.com"
            className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            <Phone className="w-3.5 h-3.5" />
            Phone
          </Label>
          <Input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 234-5678"
            className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            <MapPin className="w-3.5 h-3.5" />
            Location
          </Label>
          <Input
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            <Globe className="w-3.5 h-3.5" />
            Website
          </Label>
          <Input
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="alexsterling.design"
            className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs tracking-wide uppercase text-warm-gray flex items-center gap-1.5" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          <Linkedin className="w-3.5 h-3.5" />
          LinkedIn
        </Label>
        <Input
          value={personalInfo.linkedin}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          placeholder="linkedin.com/in/alexsterling"
          className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          Professional Summary
        </Label>
        <Textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          placeholder="A brief overview of your professional background, key achievements, and career objectives..."
          rows={4}
          className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {personalInfo.summary.length}/500 characters
        </p>
      </div>
    </div>
  );
}

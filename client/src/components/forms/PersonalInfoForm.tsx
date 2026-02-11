import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Personal Information</h3>
        <p className="text-sm text-muted-foreground mb-6">Basic details that appear at the top of your resume.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={personalInfo.fullName}
            onChange={e => updatePersonalInfo('fullName', e.target.value)}
            placeholder="Alexandra Sterling"
            className="h-11 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={personalInfo.title}
            onChange={e => updatePersonalInfo('title', e.target.value)}
            placeholder="Senior Product Designer"
            className="h-11 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={e => updatePersonalInfo('email', e.target.value)}
            placeholder="alex@email.com"
            className="h-11 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={e => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 234-5678"
            className="h-11 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={e => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="h-11 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={e => updatePersonalInfo('website', e.target.value)}
            placeholder="alexsterling.design"
            className="h-11 text-base"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={personalInfo.linkedin}
          onChange={e => updatePersonalInfo('linkedin', e.target.value)}
          placeholder="linkedin.com/in/alexsterling"
          className="h-11 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={e => updatePersonalInfo('summary', e.target.value)}
          placeholder="A brief overview of your professional background, key achievements, and career objectives..."
          rows={5}
          maxLength={500}
          className="text-base min-h-[140px] resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
          {personalInfo.summary.length}/500
        </p>
      </div>
    </div>
  );
}

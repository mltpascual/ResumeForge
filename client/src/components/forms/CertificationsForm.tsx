import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MonthPicker from '@/components/MonthPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Certifications</h3>
        <p className="text-sm text-muted-foreground mb-6">Add professional certifications and licenses.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-4">
              <CardContent className="pt-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-accent text-muted-foreground uppercase tracking-wider">
                    Certification {String(index + 1).padStart(2, '0')}
                  </span>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeCertification(cert.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Certification Name</Label>
                    <Input value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" className="h-11 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" className="h-11 text-base" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <MonthPicker
                      value={cert.date}
                      onChange={(val) => updateCertification(cert.id, 'date', val)}
                      placeholder="Select month"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link (optional)</Label>
                    <Input value={cert.link} onChange={e => updateCertification(cert.id, 'link', e.target.value)} placeholder="https://credential.net/..." className="h-11 text-base" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.certifications.length === 0 && (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No certifications added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addCertification} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Certification
      </Button>
    </div>
  );
}

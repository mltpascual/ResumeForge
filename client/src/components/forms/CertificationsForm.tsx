import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {resumeData.certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/50 border border-border rounded-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-warm-gray" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
                  Certification {index + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="Google UX Design Certificate"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Issuing Organization</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Google"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Date</Label>
                <Input
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="2022"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Link (Optional)</Label>
                <Input
                  value={cert.link}
                  onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                  placeholder="https://..."
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.certifications.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Award className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No certifications added yet</p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={addCertification}
        className="w-full border-dashed border-terracotta/30 text-terracotta hover:bg-terracotta/5 hover:border-terracotta/50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}

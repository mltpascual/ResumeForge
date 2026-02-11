import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Projects</h3>
        <p className="text-sm text-muted-foreground mb-6">Showcase your notable projects and side work.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.projects.map((proj, index) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-4">
              <CardContent className="pt-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-accent text-muted-foreground uppercase tracking-wider">
                    Project {String(index + 1).padStart(2, '0')}
                  </span>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeProject(proj.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="Design System Framework" className="h-11 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label>Link (optional)</Label>
                    <Input value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} placeholder="https://github.com/..." className="h-11 text-base" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} placeholder="React, TypeScript, Tailwind CSS" className="h-11 text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="What the project does and your role..." rows={3} className="text-base min-h-[100px] resize-none" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.projects.length === 0 && (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No projects added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addProject} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Project
      </Button>
    </div>
  );
}

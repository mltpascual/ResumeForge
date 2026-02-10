import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {resumeData.projects.map((proj, index) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/50 border border-border rounded-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-warm-gray" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
                  Project {index + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(proj.id)}
                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Project Name</Label>
                <Input
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  placeholder="Design System"
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Link (Optional)</Label>
                <Input
                  value={proj.link}
                  onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                  placeholder="https://..."
                  className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Technologies</Label>
              <Input
                value={proj.technologies}
                onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                placeholder="React, TypeScript, Figma"
                className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs tracking-wide uppercase text-warm-gray" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Description</Label>
              <Textarea
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                placeholder="Describe the project and your contributions..."
                rows={2}
                className="bg-white/60 border-border focus:border-terracotta focus:ring-terracotta/20 resize-none"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FolderOpen className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No projects added yet</p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={addProject}
        className="w-full border-dashed border-terracotta/30 text-terracotta hover:bg-terracotta/5 hover:border-terracotta/50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}

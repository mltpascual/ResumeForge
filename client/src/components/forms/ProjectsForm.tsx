import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BulletPointEditor from '@/components/BulletPointEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Plus, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Project } from '@/types/resume';

interface SortableProjectCardProps {
  proj: Project;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: string) => void;
}

function SortableProjectCard({ proj, index, onRemove, onUpdate }: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: proj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className={`mb-4 ${isDragging ? 'opacity-80' : ''}`}>
      <Card className={`transition-shadow ${isDragging ? 'shadow-lg ring-2 ring-[var(--md3-primary)]/20' : ''}`}>
        <CardContent className="pt-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 touch-none"
                    {...attributes}
                    {...listeners}
                  >
                    <GripVertical className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Drag to reorder</TooltipContent>
              </Tooltip>
              <span className="text-xs font-mono-accent text-muted-foreground uppercase tracking-wider">
                Project {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => onRemove(proj.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove entry</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input value={proj.name} onChange={e => onUpdate(proj.id, 'name', e.target.value)} placeholder="Design System Framework" className="h-11 text-base" />
            </div>
            <div className="space-y-2">
              <Label>Link (optional)</Label>
              <Input value={proj.link} onChange={e => onUpdate(proj.id, 'link', e.target.value)} placeholder="https://github.com/..." className="h-11 text-base" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Technologies</Label>
            <Input value={proj.technologies} onChange={e => onUpdate(proj.id, 'technologies', e.target.value)} placeholder="React, TypeScript, Tailwind CSS" className="h-11 text-base" />
          </div>
          <BulletPointEditor
            value={proj.description}
            onChange={(val) => onUpdate(proj.id, 'description', val)}
            placeholder="What the project does and your role..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject, reorderProjects } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = resumeData.projects.findIndex(p => p.id === active.id);
      const newIndex = resumeData.projects.findIndex(p => p.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderProjects(oldIndex, newIndex);
      }
    }
  }

  const projectIds = resumeData.projects.map(p => p.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Projects</h3>
        <p className="text-sm text-muted-foreground mb-6">Showcase your notable projects and side work. Drag to reorder.</p>
      </div>

      {resumeData.projects.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
            {resumeData.projects.map((proj, index) => (
              <SortableProjectCard
                key={proj.id}
                proj={proj}
                index={index}
                onRemove={removeProject}
                onUpdate={updateProject}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
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

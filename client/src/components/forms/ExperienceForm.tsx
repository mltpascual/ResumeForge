import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BulletPointEditor from '@/components/BulletPointEditor';
import MonthPicker from '@/components/MonthPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Plus, X, Copy, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
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
import type { Experience } from '@/types/resume';

interface SortableExperienceCardProps {
  exp: Experience;
  index: number;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
}

function SortableExperienceCard({ exp, index, onDuplicate, onRemove, onUpdate }: SortableExperienceCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id });

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
                Position {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDuplicate(exp.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate entry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => onRemove(exp.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove entry</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                value={exp.position}
                onChange={e => onUpdate(exp.id, 'position', e.target.value)}
                placeholder="Senior Product Designer"
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={e => onUpdate(exp.id, 'company', e.target.value)}
                placeholder="Meridian Technologies"
                className="h-11 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={exp.location}
                onChange={e => onUpdate(exp.id, 'location', e.target.value)}
                placeholder="San Francisco, CA"
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <MonthPicker
                value={exp.startDate}
                onChange={(val) => onUpdate(exp.id, 'startDate', val)}
                placeholder="Start month"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <MonthPicker
                value={exp.endDate}
                onChange={(val) => onUpdate(exp.id, 'endDate', val)}
                placeholder="End month"
                showPresent
                isPresent={exp.current}
                onPresentChange={(present) => onUpdate(exp.id, 'current', present)}
              />
            </div>
          </div>

          <BulletPointEditor
            value={exp.description}
            onChange={(val) => onUpdate(exp.id, 'description', val)}
            placeholder="Key achievement or responsibility..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ExperienceForm() {
  const { resumeData, addExperience, duplicateExperience, updateExperience, removeExperience, reorderExperiences } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = resumeData.experiences.findIndex(e => e.id === active.id);
      const newIndex = resumeData.experiences.findIndex(e => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderExperiences(oldIndex, newIndex);
      }
    }
  }

  const handleDuplicate = (id: string) => {
    duplicateExperience(id);
    toast.success('Experience entry duplicated');
  };

  const experienceIds = resumeData.experiences.map(e => e.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Work Experience</h3>
        <p className="text-sm text-muted-foreground mb-6">Add your professional experience, most recent first. Drag to reorder.</p>
      </div>

      {resumeData.experiences.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experienceIds} strategy={verticalListSortingStrategy}>
            {resumeData.experiences.map((exp, index) => (
              <SortableExperienceCard
                key={exp.id}
                exp={exp}
                index={index}
                onDuplicate={handleDuplicate}
                onRemove={removeExperience}
                onUpdate={updateExperience}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No experience added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addExperience} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Experience
      </Button>
    </div>
  );
}

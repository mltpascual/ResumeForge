import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import type { Education } from '@/types/resume';

interface SortableEducationCardProps {
  edu: Education;
  index: number;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: string) => void;
}

function SortableEducationCard({ edu, index, onDuplicate, onRemove, onUpdate }: SortableEducationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edu.id });

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
                Education {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDuplicate(edu.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate entry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => onRemove(edu.id)} className="text-muted-foreground hover:text-destructive">
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
              <Label>Institution</Label>
              <Input value={edu.institution} onChange={e => onUpdate(edu.id, 'institution', e.target.value)} placeholder="Stanford University" className="h-11 text-base" />
            </div>
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input value={edu.degree} onChange={e => onUpdate(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" className="h-11 text-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input value={edu.field} onChange={e => onUpdate(edu.id, 'field', e.target.value)} placeholder="Computer Science" className="h-11 text-base" />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <MonthPicker
                value={edu.startDate}
                onChange={(val) => onUpdate(edu.id, 'startDate', val)}
                placeholder="Start month"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <MonthPicker
                value={edu.endDate}
                onChange={(val) => onUpdate(edu.id, 'endDate', val)}
                placeholder="End month"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>GPA (optional)</Label>
            <Input value={edu.gpa} onChange={e => onUpdate(edu.id, 'gpa', e.target.value)} placeholder="3.9/4.0" className="h-11 text-base max-w-[200px]" />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea value={edu.description} onChange={e => onUpdate(edu.id, 'description', e.target.value)} placeholder="Relevant coursework, honors, activities..." rows={3} className="text-base min-h-[100px] resize-none" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EducationForm() {
  const { resumeData, addEducation, duplicateEducation, updateEducation, removeEducation, reorderEducation } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = resumeData.education.findIndex(e => e.id === active.id);
      const newIndex = resumeData.education.findIndex(e => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderEducation(oldIndex, newIndex);
      }
    }
  }

  const handleDuplicate = (id: string) => {
    duplicateEducation(id);
    toast.success('Education entry duplicated');
  };

  const educationIds = resumeData.education.map(e => e.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Education</h3>
        <p className="text-sm text-muted-foreground mb-6">Add your educational background. Drag to reorder.</p>
      </div>

      {resumeData.education.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={educationIds} strategy={verticalListSortingStrategy}>
            {resumeData.education.map((edu, index) => (
              <SortableEducationCard
                key={edu.id}
                edu={edu}
                index={index}
                onDuplicate={handleDuplicate}
                onRemove={removeEducation}
                onUpdate={updateEducation}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div className="py-16 text-center border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">No education added yet</p>
        </div>
      )}

      <Button variant="outline" onClick={addEducation} className="w-full h-12 gap-2 text-base border-dashed">
        <Plus className="size-5" />
        Add Education
      </Button>
    </div>
  );
}

import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MonthPicker from '@/components/MonthPicker';
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
import type { Certification } from '@/types/resume';

interface SortableCertCardProps {
  cert: Certification;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: string) => void;
}

function SortableCertCard({ cert, index, onRemove, onUpdate }: SortableCertCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert.id });

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
                Certification {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => onRemove(cert.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove entry</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Certification Name</Label>
              <Input value={cert.name} onChange={e => onUpdate(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" className="h-11 text-base" />
            </div>
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input value={cert.issuer} onChange={e => onUpdate(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" className="h-11 text-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Date</Label>
              <MonthPicker
                value={cert.date}
                onChange={(val) => onUpdate(cert.id, 'date', val)}
                placeholder="Select month"
              />
            </div>
            <div className="space-y-2">
              <Label>Link (optional)</Label>
              <Input value={cert.link} onChange={e => onUpdate(cert.id, 'link', e.target.value)} placeholder="https://credential.net/..." className="h-11 text-base" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CertificationsForm() {
  const { resumeData, addCertification, updateCertification, removeCertification, reorderCertifications } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = resumeData.certifications.findIndex(c => c.id === active.id);
      const newIndex = resumeData.certifications.findIndex(c => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCertifications(oldIndex, newIndex);
      }
    }
  }

  const certIds = resumeData.certifications.map(c => c.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">Certifications</h3>
        <p className="text-sm text-muted-foreground mb-6">Add professional certifications and licenses. Drag to reorder.</p>
      </div>

      {resumeData.certifications.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={certIds} strategy={verticalListSortingStrategy}>
            {resumeData.certifications.map((cert, index) => (
              <SortableCertCard
                key={cert.id}
                cert={cert}
                index={index}
                onRemove={removeCertification}
                onUpdate={updateCertification}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
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

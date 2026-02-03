'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { BlockConfig, BlockType, BLOCK_VARIANTS } from '@/types';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/utils';

const BLOCK_LABELS: Record<BlockType, string> = {
  intro: 'Заставка',
  hero: 'Главный экран',
  greeting: 'Приветствие',
  details: 'Детали',
  countdown: 'Обратный отсчёт',
  program: 'Программа',
  location: 'Место проведения',
  gallery: 'Галерея',
  rsvp: 'RSVP',
  story: 'История',
  wishes: 'Пожелания',
  dresscode: 'Дресс-код',
  'baby-info': 'Информация о ребёнке',
  footer: 'Футер',
};

interface SortableBlockItemProps {
  block: BlockConfig;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

function SortableBlockItem({ block, index, isSelected, onSelect, onToggle }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `block-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg transition-colors',
        isDragging ? 'opacity-50' : '',
        isSelected ? 'bg-accent/10 border border-accent' : 'bg-white border border-muted-foreground/20',
        !block.enabled && 'opacity-60'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted hover:text-foreground"
      >
        <GripVertical size={18} />
      </button>

      <button
        onClick={onSelect}
        className="flex-1 text-left text-sm font-medium"
      >
        {BLOCK_LABELS[block.type] || block.type}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={cn(
          'p-1 rounded transition-colors',
          block.enabled ? 'text-accent' : 'text-muted'
        )}
      >
        {block.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
}

export function BlocksPanel() {
  const { event, selectedBlockIndex, reorderBlocks, toggleBlock, selectBlock, setBlockVariant } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!event) return null;

  const { blocks } = event;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(String(active.id).replace('block-', ''));
      const newIndex = parseInt(String(over.id).replace('block-', ''));
      reorderBlocks(oldIndex, newIndex);
    }
  };

  const selectedBlock = selectedBlockIndex !== null ? blocks[selectedBlockIndex] : null;
  const variants = selectedBlock ? BLOCK_VARIANTS[selectedBlock.type] : [];

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((_, i) => `block-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <SortableBlockItem
                key={`block-${index}`}
                block={block}
                index={index}
                isSelected={selectedBlockIndex === index}
                onSelect={() => selectBlock(selectedBlockIndex === index ? null : index)}
                onToggle={() => toggleBlock(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Variant selector */}
      {selectedBlock && variants.length > 0 && (
        <div className="pt-4 border-t border-muted-foreground/10">
          <h4 className="text-sm font-medium text-muted mb-3">Вариант отображения</h4>
          <div className="space-y-2">
            {variants.map((variant) => (
              <button
                key={variant.value}
                onClick={() => setBlockVariant(selectedBlockIndex!, variant.value)}
                className={cn(
                  'w-full p-3 rounded-lg text-left text-sm transition-colors',
                  selectedBlock.variant === variant.value
                    ? 'bg-accent text-white'
                    : 'bg-muted-foreground/10 hover:bg-muted-foreground/20'
                )}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

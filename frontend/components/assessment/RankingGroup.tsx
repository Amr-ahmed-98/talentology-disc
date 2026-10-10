"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PublicWord } from "@/lib/types";

interface RankingGroupProps {
  words: PublicWord[];
  onChange: (words: PublicWord[]) => void;
}

export function RankingGroup({ words, onChange }: RankingGroupProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = words.findIndex((word) => word.id === active.id);
    const to = words.findIndex((word) => word.id === over.id);
    onChange(arrayMove(words, from, to));
  }

  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        Most like me
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={words.map((word) => word.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {words.map((word) => (
              <SortableWord key={word.id} word={word} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        Least like me
      </p>
    </div>
  );
}

function SortableWord({ word }: { word: PublicWord }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: word.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-4 rounded-xl border bg-white px-4 py-3 shadow-sm ${
        isDragging ? "relative z-10 border-indigo-400 shadow-lg" : "border-slate-200"
      }`}
    >
      <span className="flex-1 font-medium">{word.text}</span>
      <span lang="ar" dir="rtl" className="text-slate-500">
        {word.textAr}
      </span>
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${word.text}`}
        className="cursor-grab touch-none rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
      >
        <span aria-hidden>⠿</span>
      </button>
    </li>
  );
}
"use client";
import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { FiRotateCcw, FiMove } from "react-icons/fi";
import BentoCard from "./BentoCard";
import { CARD_BY_ID, DEFAULT_ORDER } from "./registry";
import { useBentoLayout } from "../../hooks/useBentoLayout";

export default function BentoGrid() {
  const { order, persist, reset, isCustomized } = useBentoLayout(DEFAULT_ORDER);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const sensors = useSensors(
    // A small drag threshold keeps ordinary clicks on links and buttons working.
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // A hold delay on touch means vertical scrolling still wins over dragging.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveLabel(null);
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    persist(arrayMove(order, oldIndex, newIndex));
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${CARD_BY_ID[String(active.id)]?.label ?? "card"}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${CARD_BY_ID[String(active.id)]?.label ?? "Card"} moved over ${CARD_BY_ID[String(over.id)]?.label ?? "another card"}.`
        : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${CARD_BY_ID[String(active.id)]?.label ?? "Card"} placed at position ${order.indexOf(String(over.id)) + 1}.`
        : `${CARD_BY_ID[String(active.id)]?.label ?? "Card"} returned to its original position.`,
    onDragCancel: ({ active }) =>
      `Dragging cancelled. ${CARD_BY_ID[String(active.id)]?.label ?? "Card"} returned to its original position.`,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-end gap-4 mb-5 px-1">

        {isCustomized && (
          <button
            onClick={reset}
            className="flex items-center gap-2 shrink-0 text-xs font-bold text-white/60 hover:text-accent-light
                       px-3 py-2 rounded-xl border border-border hover:border-accent/40 transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <FiRotateCcw aria-hidden="true" /> Reset layout
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
        accessibility={{ announcements }}
        onDragStart={({ active }) => setActiveLabel(CARD_BY_ID[String(active.id)]?.label ?? null)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveLabel(null)}
      >
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-auto lg:auto-rows-[280px]">
            {order.map((id) => {
              const card = CARD_BY_ID[id];
              if (!card) return null;
              const { Component, label, colSpan, rowSpan } = card;

              return (
                <BentoCard key={id} id={id} colSpan={colSpan} rowSpan={rowSpan} label={label}>
                  <Component />
                </BentoCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Live region so the current drag is announced even outside dnd-kit's own output. */}
      <span className="sr-only" aria-live="polite">
        {activeLabel ? `Dragging ${activeLabel}` : ""}
      </span>
    </div>
  );
}

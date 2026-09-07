"use client";
import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMove } from "react-icons/fi";

const COL_SPAN_CLASS: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

const ROW_SPAN_CLASS: Record<number, string> = {
  1: "",
  2: "lg:row-span-2",
};

interface BentoCardProps {
  id: string;
  /** Columns to span on the 4-column desktop grid. */
  colSpan: number;
  /** Rows to span on the desktop grid — lets a card sit tall beside shorter neighbors. */
  rowSpan?: number;
  /** Human-readable name announced to screen readers on the drag handle. */
  label: string;
  children: ReactNode;
}

export default function BentoCard({ id, colSpan, rowSpan = 1, label, children }: BentoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      id={id}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`group/card relative col-span-1 scroll-mt-24 cursor-pointer active:cursor-grabbing ${COL_SPAN_CLASS[colSpan] ?? "sm:col-span-1"} ${ROW_SPAN_CLASS[rowSpan] ?? ""
        } ${isDragging ? "z-50 opacity-80" : "z-0"}`}
    >
      <div
        className={`card-dark card-dark-hover h-full rounded-3xl overflow-hidden transition-shadow duration-200 ${isDragging ? "shadow-2xl shadow-black/50 ring-2 ring-accent/50" : ""
          }`}
      >
        {children}
      </div>


    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import api from "@/lib/axios";
import AddProjectForm from "./AddProjectForm";
import EditProjectForm from "./EditProjectForm";
import ProjectCard, { Project } from "./ProjectCard";

interface AdminProjectsProps {
  projects: Project[];
  isAdding: boolean;
  setIsAdding: (v: boolean) => void;
  onRefresh: () => void;
}

export default function AdminProjects({ projects, isAdding, setIsAdding, onRefresh }: AdminProjectsProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [ordered, setOrdered] = useState<Project[]>(projects);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setOrdered(projects), [projects]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const previous = ordered;
    const oldIndex = previous.findIndex((p) => p.id === active.id);
    const newIndex = previous.findIndex((p) => p.id === over.id);
    const next = arrayMove(previous, oldIndex, newIndex);

    setOrdered(next);
    setIsSaving(true);
    try {
      await api.patch("/admin/projects/reorder", { ids: next.map((p) => p.id) });
      onRefresh();
    } catch {
      setOrdered(previous);
      alert("Failed to save the new order.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAdding(false);
  };

  const handleCancelEdit = () => setEditingProject(null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {projects.length} {projects.length === 1 ? "entry" : "entries"} in your portfolio
            {" · "}
            {isSaving ? "Saving order…" : "Drag cards to set the order visitors see"}
          </p>
        </div>
        <button
          onClick={() => { setIsAdding(!isAdding); setEditingProject(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          <FiPlus className={`transition-transform duration-200 ${isAdding ? "rotate-45" : ""}`} />
          {isAdding ? "Cancel" : "New Build"}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <AddProjectForm onRefresh={onRefresh} onCancel={() => setIsAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <EditProjectForm project={editingProject} onRefresh={onRefresh} onCancel={handleCancelEdit} />
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length === 0 && !isAdding && (
        <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
          No_Projects_Found
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ordered.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ordered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                position={index + 1}
                onRefresh={onRefresh}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
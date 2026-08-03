"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@prisma/client";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { updateTaskStatus } from "@/app/actions/tasks";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "IN_REVIEW", title: "In Review" },
  { id: "DONE", title: "Done" },
];

export function Board({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const currentTask = tasks.find((t) => t.id === activeId);
    if (!currentTask) return;

    // Determine the target status
    let newStatus: TaskStatus = currentTask.status;

    const overColumn = COLUMNS.find((col) => col.id === overId);
    if (overColumn) {
      newStatus = overColumn.id;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus === currentTask.status) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, status: newStatus, completed: newStatus === "DONE" }
          : t
      )
    );

    try {
      await updateTaskStatus(activeId, newStatus);
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert
      setTasks(initialTasks);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter((t) => t.status === column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
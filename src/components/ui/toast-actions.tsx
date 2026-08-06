"use client";

import { toast } from "sonner";
import {
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "@/app/actions/tasks";
import { createProject, deleteProject } from "@/app/actions/projects";

export async function createTaskWithToast(formData: FormData) {
  try {
    await createTask(formData);
    toast.success("Task created");
  } catch {
    toast.error("Failed to create task");
  }
}

export async function updateTaskWithToast(formData: FormData) {
  try {
    await updateTask(formData);
    toast.success("Task updated");
  } catch {
    toast.error("Failed to update task");
  }
}

export async function deleteTaskWithToast(taskId: string) {
  try {
    await deleteTask(taskId);
    toast.success("Task deleted");
  } catch {
    toast.error("Failed to delete task");
  }
}

export async function toggleTaskWithToast(taskId: string) {
  try {
    await toggleTask(taskId);
  } catch {
    toast.error("Failed to update task");
  }
}

export async function createProjectWithToast(formData: FormData) {
  try {
    await createProject(formData);
    toast.success("Project created");
  } catch {
    toast.error("Failed to create project");
  }
}

export async function deleteProjectWithToast(projectId: string) {
  try {
    await deleteProject(projectId);
    toast.success("Project deleted");
  } catch {
    toast.error("Failed to delete project");
  }
}
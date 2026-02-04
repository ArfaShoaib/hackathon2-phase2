'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { formatDate, formatDateCountdown, isOverdue } from '@/lib/utils';
import {
  Calendar,
  Flag,
  Clock,
  User,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskDetail({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}: TaskDetailProps) {
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleEdit = () => {
    onEdit(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  // Determine priority color
  const priorityColors = {
    low: 'text-[hsl(160,80%,64%)] bg-[hsl(160,80%,64%,0.1)]', // mint fresh (success)
    medium: 'text-[hsl(0,0%,72%)] bg-[hsl(0,0%,72%,0.1)]', // text secondary
    high: 'text-[hsl(38,92%,65%)] bg-[hsl(38,92%,65%,0.1)]' // soft gold (warning)
  };

  const priorityColor = priorityColors[task.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <h1 className={cn(
          "text-2xl font-bold text-[hsl(0,0%,98.5%)] mb-2",
          task.isCompleted && "line-through opacity-70"
        )}>
          {task.title}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-9 w-9 p-0 hover:bg-[hsl(25,30,70,0.2)]"
            aria-label="Edit task"
          >
            <Edit3 className="h-4 w-4 text-[hsl(0,0%,72%)]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-9 w-9 p-0 hover:bg-[hsl(346,85%,64%,0.2)]"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4 text-[hsl(346,85%,64%)]" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleToggleComplete}
              variant="outline"
              className={cn(
                "flex items-center gap-2",
                task.isCompleted
                  ? "bg-[hsl(160,80%,64%,0.2)] text-[hsl(160,80%,64%)] border-[hsl(160,80%,64%,0.3)]"
                  : "text-[hsl(0,0%,72%)] border-[hsl(120,190,255,0.18)]"
              )}
            >
              {task.isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Completed
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" /> Mark Complete
                </>
              )}
            </Button>

            {task.isImportant && (
              <Badge className="bg-[hsl(38,92%,65%,0.2)] text-[hsl(38,92%,65%)] border-[hsl(38,92%,65%,0.3)]">
                <Flag className="h-3 w-3 mr-1" /> Important
              </Badge>
            )}
          </div>

          <Badge className={cn("px-3 py-1", priorityColor)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <div className="pt-4 border-t border-[hsl(120,190,255,0.1)]">
            <h3 className="text-sm font-medium text-[hsl(0,0%,72%)] mb-2">Description</h3>
            <p className="text-[hsl(0,0%,98.5%)] leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[hsl(120,190,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(25,30,70,0.1)]">
              <Calendar className="h-4 w-4 text-[hsl(190,92%,65%)]" />
            </div>
            <div>
              <p className="text-xs text-[hsl(0,0%,72%)]">Due Date</p>
              {task.dueDate ? (
                <p className={cn(
                  "font-medium",
                  isOverdue(task.dueDate) ? "text-[hsl(346,85%,64%)]" : "text-[hsl(0,0%,98.5%)]"
                )}>
                  {formatDate(task.dueDate)} ({formatDateCountdown(task.dueDate)})
                  {isOverdue(task.dueDate) && " (Overdue)"}
                </p>
              ) : (
                <p className="text-[hsl(0,0%,72%)] italic">No due date</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(25,30,70,0.1)]">
              <Clock className="h-4 w-4 text-[hsl(190,92%,65%)]" />
            </div>
            <div>
              <p className="text-xs text-[hsl(0,0%,72%)]">Created</p>
              <p className="font-medium text-[hsl(0,0%,98.5%)]">{formatDate(task.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(25,30,70,0.1)]">
              <Clock className="h-4 w-4 text-[hsl(190,92%,65%)]" />
            </div>
            <div>
              <p className="text-xs text-[hsl(0,0%,72%)]">Last Updated</p>
              <p className="font-medium text-[hsl(0,0%,98.5%)]">{formatDate(task.updatedAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(25,30,70,0.1)]">
              <User className="h-4 w-4 text-[hsl(190,92%,65%)]" />
            </div>
            <div>
              <p className="text-xs text-[hsl(0,0%,72%)]">Assigned To</p>
              <p className="font-medium text-[hsl(0,0%,98.5%)]">You</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
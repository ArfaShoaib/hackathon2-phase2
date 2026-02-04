'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { formatDate, formatDateCountdown, isOverdue } from '@/lib/utils';
import {
  Calendar,
  Flag,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  delay = 0
}: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleToggleComplete = () => {
    if (!task.isCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: delay * 0.07
      }}
      className={cn(
        "glass-card p-4 mb-3 relative group",
        task.isCompleted ? "opacity-70" : "opacity-100"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Celebration animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Sparkles className="h-12 w-12 text-[hsl(160,80%,64%)] animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Checkbox with animation */}
        <div className="mt-1">
          <button
            onClick={handleToggleComplete}
            className="p-1 rounded-full hover:bg-[hsl(25,30,70,0.2)] transition-colors"
            aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-[hsl(160,80%,64%)]" />
            ) : (
              <Circle className="h-5 w-5 text-[hsl(0,0%,72%)]" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={cn(
            "font-medium text-[hsl(0,0%,98.5%)] mb-1",
            task.isCompleted && "line-through"
          )}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-[hsl(0,0%,72%)] mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Task metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority badge */}
            <Badge variant="secondary" className={cn("text-xs px-2 py-1", priorityColor)}>
              {task.priority}
            </Badge>

            {/* Important flag */}
            {task.isImportant && (
              <div className="flex items-center gap-1 text-[hsl(38,92%,65%)]">
                <Flag className="h-3 w-3" />
                <span className="text-xs">Important</span>
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue(task.dueDate) ? "text-[hsl(346,85%,64%)]" : "text-[hsl(0,0%,72%)]"
              )}>
                <Calendar className="h-3 w-3" />
                <span>{formatDateCountdown(task.dueDate)}</span>
                {isOverdue(task.dueDate) && <span>(Overdue)</span>}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons - only show on hover */}
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity duration-200",
            showActions ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 hover:bg-[hsl(25,30,70,0.2)]"
            aria-label="Edit task"
          >
            <Edit3 className="h-4 w-4 text-[hsl(0,0%,72%)]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-[hsl(346,85%,64%,0.2)]"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4 text-[hsl(346,85%,64%)]" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
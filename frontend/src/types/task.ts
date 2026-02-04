export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string format
  isCompleted: boolean;
  isImportant: boolean;
  priority: 'low' | 'medium' | 'high'; // Default: 'medium'
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  userId: string;
}

// Interface for creating a new task (without id and timestamps)
export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted?: boolean;
  isImportant?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

// Interface for updating a task
export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  isCompleted?: boolean;
  isImportant?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

// Interface for task filters
export interface TaskFilters {
  completed?: boolean;
  important?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  search?: string;
}
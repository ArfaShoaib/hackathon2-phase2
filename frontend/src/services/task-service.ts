import apiClient from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

// Define TypeScript interfaces for task data (frontend format)
export type { Task, CreateTaskData, UpdateTaskData };

// Helper functions for format conversion
const toFrontendFormat = (backendTask: any): Task => {
  if (!backendTask) {
    throw new Error('Backend task is undefined or null');
  }

  // Extract and validate the ID
  let id = backendTask.id?.toString();
  if (!id || id.trim() === '') {
    // This shouldn't normally happen for tasks from the backend, but we'll handle it
    console.warn('Task has no ID, generating temporary ID', backendTask);
    // Use a combination of timestamp and random number as fallback
    id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return {
    id: id,
    title: backendTask.title || '',
    description: backendTask.description || null,
    dueDate: undefined, // Backend doesn't have due_date field
    isCompleted: Boolean(backendTask.completed),
    isImportant: false, // Backend doesn't have is_important field - default to false
    priority: 'medium', // Backend doesn't have priority field - default to medium
    createdAt: backendTask.created_at || new Date().toISOString(),
    updatedAt: backendTask.updated_at || new Date().toISOString(),
    userId: backendTask.user_id?.toString() || ''
  };
};

const toBackendDataFormat = (data: CreateTaskData | UpdateTaskData): any => {
  // Map frontend fields to backend fields
  const result: any = {
    title: data.title,
    description: data.description,
    completed: data.isCompleted ?? false,
  };

  // Only include fields that exist in the backend schema
  return result;
};

// Task service functions using the centralized API client
export const taskService = {

  // Get all tasks for a specific user
  async getAllTasks(userId: string): Promise<Task[]> {
    try {
      // Remove trailing slash from the API endpoint to match backend
      const response = await apiClient.get<any>(`/api/${userId}/tasks`);

      // Check if response is an array, if not, try to extract the array from a property
      let backendTasks: any[];
      if (Array.isArray(response)) {
        backendTasks = response;
      } else if (response && typeof response === 'object' && Array.isArray(response.tasks)) {
        // If response has a 'tasks' property that is an array, use that
        backendTasks = response.tasks;
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        // If response has a 'data' property that is an array, use that
        backendTasks = response.data;
      } else {
        // If response is not an array and doesn't have expected properties, treat the single item as an array
        backendTasks = [response];
      }

      // Filter out tasks with empty or invalid IDs before processing
      const validBackendTasks = backendTasks.filter(task => {
        if (!task) return false;
        const id = task.id?.toString();
        return id && id.trim() !== '';
      });

      return validBackendTasks.map(task => toFrontendFormat(task));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get a specific task by ID
  async getTaskById(userId: string, taskId: string): Promise<Task> {
    try {
      // Remove trailing slash from the API endpoint to match backend
      const backendTask = await apiClient.get<any>(`/api/${userId}/tasks/${taskId}`);

      if (!backendTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      return toFrontendFormat(backendTask);
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  },

  // Create a new task
  async createTask(userId: string, data: CreateTaskData): Promise<Task> {
    try {
      const backendData = toBackendDataFormat(data);
      // Remove trailing slash from the API endpoint to match backend
      const backendTask = await apiClient.post<any>(`/api/${userId}/tasks`, backendData);

      if (!backendTask) {
        throw new Error('Task creation failed: no response received from server');
      }

      return toFrontendFormat(backendTask);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update an existing task
  async updateTask(userId: string, taskId: string, data: UpdateTaskData): Promise<Task> {
    if (!taskId) {
      throw new Error('Task ID is required to update a task');
    }

    try {
      const backendData = toBackendDataFormat(data);
      // Remove trailing slash from the API endpoint to match backend
      const backendTask = await apiClient.put<any>(`/api/${userId}/tasks/${taskId}`, backendData);

      if (!backendTask) {
        throw new Error(`Failed to update task with ID ${taskId}`);
      }

      return toFrontendFormat(backendTask);
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(userId: string, taskId: string): Promise<void> {
    if (!taskId) {
      throw new Error('Task ID is required to delete a task');
    }

    try {
      // Remove trailing slash from the API endpoint to match backend
      await apiClient.delete<void>(`/api/${userId}/tasks/${taskId}`);
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  // Toggle task completion status
  async toggleComplete(userId: string, taskId: string): Promise<Task> {
    try {
      if (!taskId) {
        throw new Error('Task ID is required to toggle completion status');
      }

      // Get current task to check its status
      const backendCurrentTask = await apiClient.get<any>(`/api/${userId}/tasks/${taskId}`);

      if (!backendCurrentTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      // Use the PATCH endpoint for updating completion status as per backend API
      const backendTask = await apiClient.patch<any>(`/api/${userId}/tasks/${taskId}/complete`, {
        completed: !backendCurrentTask.completed
      });

      if (!backendTask) {
        throw new Error(`Failed to update completion status for task with ID ${taskId}`);
      }

      return toFrontendFormat(backendTask);
    } catch (error) {
      console.error(`Error toggling task completion for ${taskId}:`, error);
      throw error;
    }
  }
};

// Hook that combines authentication and task service
export const useTaskService = () => {
  const { getCurrentUserId } = useAuth(); // This function exists in our updated auth system

  const getUserTasks = async (): Promise<Task[]> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return taskService.getAllTasks(userId);
  };

  const createUserTask = async (data: CreateTaskData): Promise<Task> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return taskService.createTask(userId, data);
  };

  const updateUserTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return taskService.updateTask(userId, taskId, data);
  };

  const deleteUserTask = async (taskId: string): Promise<void> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return taskService.deleteTask(userId, taskId);
  };

  const toggleTaskComplete = async (taskId: string): Promise<Task> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return taskService.toggleComplete(userId, taskId);
  };

  return {
    getUserTasks,
    createUserTask,
    updateUserTask,
    deleteUserTask,
    toggleTaskComplete
  };
};
// Mock API functions for authentication and tasks
// These will be replaced with real API calls when backend is implemented

// Types
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  isImportant: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Mock storage
let mockUsers: User[] = [];
let mockTasks: Task[] = [];
let currentUser: User | null = null;

// Authentication functions
export const mockAuthAPI = {
  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    currentUser = newUser;

    // Return user and mock token
    return {
      user: newUser,
      token: `mock_token_${newUser.id}`
    };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    currentUser = user;

    return {
      user,
      token: `mock_token_${user.id}`
    };
  },

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    currentUser = null;
  },

  getCurrentUser(): User | null {
    return currentUser;
  },

  isAuthenticated(): boolean {
    return currentUser !== null;
  }
};

// Task functions
export const mockTaskAPI = {
  async getAllTasks(userId: string): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockTasks.filter(task => task.userId === userId);
  },

  async getTaskById(taskId: string, userId: string): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const task = mockTasks.find(task => task.id === taskId && task.userId === userId);
    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, userId: string): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newTask: Task = {
      id: `task_${Date.now()}`,
      ...taskData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: taskData.isCompleted || false,
      isImportant: taskData.isImportant || false,
      priority: taskData.priority || 'medium'
    };

    mockTasks.push(newTask);

    return newTask;
  },

  async updateTask(taskId: string, taskData: Partial<Task>, userId: string): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const taskIndex = mockTasks.findIndex(task => task.id === taskId && task.userId === userId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask = {
      ...mockTasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    mockTasks[taskIndex] = updatedTask;

    return updatedTask;
  },

  async deleteTask(taskId: string, userId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const taskIndex = mockTasks.findIndex(task => task.id === taskId && task.userId === userId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    mockTasks.splice(taskIndex, 1);
  },

  async toggleTaskCompletion(taskId: string, userId: string): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const taskIndex = mockTasks.findIndex(task => task.id === taskId && task.userId === userId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const task = mockTasks[taskIndex];
    const updatedTask = {
      ...task,
      isCompleted: !task.isCompleted,
      updatedAt: new Date().toISOString()
    };

    mockTasks[taskIndex] = updatedTask;

    return updatedTask;
  },

  async getFilteredTasks(
    userId: string,
    filters: {
      completed?: boolean;
      important?: boolean;
      priority?: 'low' | 'medium' | 'high';
      dueDate?: string;
    } = {}
  ): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockTasks.filter(task => {
      if (task.userId !== userId) return false;
      if (filters.completed !== undefined && task.isCompleted !== filters.completed) return false;
      if (filters.important !== undefined && task.isImportant !== filters.important) return false;
      if (filters.priority !== undefined && task.priority !== filters.priority) return false;
      if (filters.dueDate !== undefined && task.dueDate !== filters.dueDate) return false;

      return true;
    });
  }
};
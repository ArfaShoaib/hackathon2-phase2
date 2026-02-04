'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Task, CreateTaskData } from '@/types/task';
import TaskCard from '@/components/task/TaskCard';
import CreateTaskModal from '@/components/task/CreateTaskModal';
import EditTaskModal from '@/components/task/EditTaskModal';
import { useTaskService } from '@/services/task-service';
import { useAuth } from '@/hooks/useAuth';
import { useUserId } from '@/hooks/useUserId';
import { Plus, Filter, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { ClientOnly } from '@/components/common/client-only-wrapper';

export default function DashboardPage() {
  return (
    <ClientOnly>
      <DashboardPageContent />
    </ClientOnly>
  );
}

function DashboardPageContent() {
  const { user, signOut } = useAuth();
  const { userId } = useUserId();
  const {
    getUserTasks,
    createUserTask,
    updateUserTask,
    deleteUserTask,
    toggleTaskComplete
  } = useTaskService();

  const handleLogout = async () => {
    try {
      await signOut();
      // Optionally redirect to login page after logout
      window.location.href = '/login'; // or '/' for home page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load tasks when component mounts
  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  // Filter tasks based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchTerm, tasks]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTasks = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const userTasks = await getUserTasks();
      setTasks(userTasks);
      setFilteredTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setErrorMessage('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    if (!userId) return;

    try {
      const newTask = await createUserTask({
        title: taskData.title,
        description: taskData.description,
        isCompleted: taskData.isCompleted ?? false,
      });
      setTasks([...tasks, newTask]);
      setFilteredTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    if (!userId) return;

    try {
      const updatedTask = await updateUserTask(taskId, {
        title: taskData.title,
        description: taskData.description,
        isCompleted: taskData.isCompleted,
      });
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    if (!userId) return;

    // Validate that taskId is provided
    if (!taskId) {
      console.error('Task ID is required to toggle completion status');
      return;
    }

    try {
      const updatedTask = await toggleTaskComplete(taskId);
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowEditModal(true);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!userId) return;

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteUserTask(taskId);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05040f]">
        <div className="text-[hsl(0,0%,98.5%)]">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05040f]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-[hsl(0,0%,72%)] mt-1">Manage your premium task experience</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="glass-button"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(0,0%,72%)]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-button text-[hsl(0,0%,98.5%)] placeholder-[hsl(0,0%,72%)] focus:outline-none focus:ring-2 focus:ring-[hsl(190,92%,65%)]"
            />
          </div>

          <Button variant="outline" className="glass-button flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {errorMessage && (
          <div className="glass-card p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(346,85%,64%,0.2)]">
                <AlertTriangle className="h-5 w-5 text-[hsl(346,85%,64%)]" />
              </div>
              <span className="text-[hsl(346,85%,64%)]">{errorMessage}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadTasks()}
              className="h-8 w-8 p-0 hover:bg-[hsl(25,30,70,0.2)]"
            >
              <RefreshCw className="h-4 w-4 text-[hsl(0,0%,72%)]" />
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4">
            <p className="text-[hsl(0,0%,72%)] text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-[hsl(0,0%,98.5%)]">{tasks.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[hsl(0,0%,72%)] text-sm">Completed</p>
            <p className="text-2xl font-bold text-[hsl(160,80%,64%)]">{tasks.filter(t => t.isCompleted).length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[hsl(0,0%,72%)] text-sm">Pending</p>
            <p className="text-2xl font-bold text-[hsl(190,92%,65%)]">{tasks.filter(t => !t.isCompleted).length}</p>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="glass-card p-4 mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-lg" />
                      <Skeleton className="h-6 w-20 rounded-lg" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <h3 className="text-xl font-medium text-[hsl(0,0%,98.5%)] mb-2">No tasks yet</h3>
            <p className="text-[hsl(0,0%,72%)] mb-4">Create your first task to get started</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="outline"
              className="glass-button"
            >
              Create Task
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                delay={index}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}
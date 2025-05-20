import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../lib/api';
import { Task, TaskCompletion } from '../types';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Fetch tasks when user changes
  useEffect(() => {
    fetchTasks();
    
    if (user) {
      fetchCompletedTasks();
    }
  }, [user]);
  
  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await tasksAPI.getAllTasks();
      
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch completed tasks
  const fetchCompletedTasks = async () => {
    if (!user) return;
    
    try {
      const response = await tasksAPI.getCompletedTasks();
      
      if (response.data.success) {
        setCompletedTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  };
  
  // Complete a task
  const completeTask = async (taskId: string) => {
    if (!user) return { success: false, error: '請先登入' };
    
    try {
      setIsCompleting(true);
      const response = await tasksAPI.completeTask(taskId);
      
      if (response.data.success) {
        // Refresh tasks and completed tasks
        await fetchTasks();
        await fetchCompletedTasks();
        
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: response.data.error
        };
      }
    } catch (error: any) {
      console.error('Error completing task:', error);
      return {
        success: false,
        error: error.response?.data?.error || '完成任務時發生錯誤'
      };
    } finally {
      setIsCompleting(false);
    }
  };
  
  return {
    tasks,
    completedTasks,
    isLoading,
    isCompleting,
    completeTask,
    refreshTasks: fetchTasks,
    refreshCompletedTasks: fetchCompletedTasks
  };
}

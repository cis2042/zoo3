import { Request, Response } from 'express';
import { taskService } from '../services/taskService';

export const taskController = {
  // Get all tasks
  async getAllTasks(req: Request, res: Response) {
    try {
      // If user is authenticated, get tasks with completion status
      if (req.user) {
        const tasks = await taskService.getTasksWithCompletionStatus(req.user.id);
        
        return res.status(200).json({
          success: true,
          data: tasks
        });
      }
      
      // Otherwise, just get all tasks
      const tasks = await taskService.getAllTasks();
      
      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Get all tasks error:', error);
      res.status(500).json({
        success: false,
        error: '獲取任務列表時發生錯誤'
      });
    }
  },
  
  // Get task by ID
  async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          error: '找不到任務'
        });
      }
      
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Get task by ID error:', error);
      res.status(500).json({
        success: false,
        error: '獲取任務詳情時發生錯誤'
      });
    }
  },
  
  // Complete a task
  async completeTask(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const { taskId } = req.params;
      
      try {
        const completion = await taskService.completeTask(req.user.id, taskId);
        
        res.status(200).json({
          success: true,
          data: completion,
          message: '任務完成，獎勵已發放'
        });
      } catch (error: any) {
        // Handle specific errors
        if (error.message === '任務不存在') {
          return res.status(404).json({
            success: false,
            error: '找不到任務'
          });
        }
        
        if (error.message === '任務已完成') {
          return res.status(400).json({
            success: false,
            error: '您已經完成了這個任務'
          });
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Complete task error:', error);
      res.status(500).json({
        success: false,
        error: '完成任務時發生錯誤'
      });
    }
  },
  
  // Get completed tasks for current user
  async getCompletedTasks(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const completedTasks = await taskService.getCompletedTasks(req.user.id);
      
      res.status(200).json({
        success: true,
        data: completedTasks
      });
    } catch (error) {
      console.error('Get completed tasks error:', error);
      res.status(500).json({
        success: false,
        error: '獲取已完成任務時發生錯誤'
      });
    }
  }
};

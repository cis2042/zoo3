import pool from '../db';
import { Task, TaskCompletion } from '../types';

export const taskService = {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  },
  
  // Get task by ID
  async getTaskById(taskId: string): Promise<Task | null> {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  // Get tasks with completion status for a user
  async getTasksWithCompletionStatus(userId: string): Promise<(Task & { completed: boolean })[]> {
    const result = await pool.query(
      `SELECT t.*, 
        CASE WHEN tc.id IS NOT NULL THEN true ELSE false END as completed
       FROM tasks t
       LEFT JOIN task_completions tc ON t.id = tc.task_id AND tc.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  },
  
  // Complete a task
  async completeTask(userId: string, taskId: string): Promise<TaskCompletion | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if task exists
      const taskResult = await client.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
      
      if (taskResult.rows.length === 0) {
        throw new Error('任務不存在');
      }
      
      const task = taskResult.rows[0];
      
      // Check if task is already completed
      const completionCheckResult = await client.query(
        'SELECT * FROM task_completions WHERE user_id = $1 AND task_id = $2',
        [userId, taskId]
      );
      
      if (completionCheckResult.rows.length > 0) {
        throw new Error('任務已完成');
      }
      
      // Record task completion
      const completionResult = await client.query(
        `INSERT INTO task_completions (user_id, task_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [userId, taskId]
      );
      
      // Add transaction record
      await client.query(
        `INSERT INTO transactions (user_id, amount, token, transaction_type, reference_id, description) 
         VALUES ($1, $2, $3, 'task_reward', $4, $5)`,
        [userId, task.reward_amount, task.reward_token, taskId, `完成任務: ${task.title}`]
      );
      
      // Update user profile balances
      if (task.reward_token === 'KAIA') {
        await client.query(
          `UPDATE user_profiles 
           SET total_kaia = total_kaia + $1, 
               total_tasks_completed = total_tasks_completed + 1
           WHERE user_id = $2`,
          [task.reward_amount, userId]
        );
      } else if (task.reward_token === 'ZOO') {
        await client.query(
          `UPDATE user_profiles 
           SET total_zoo = total_zoo + $1, 
               total_tasks_completed = total_tasks_completed + 1
           WHERE user_id = $2`,
          [task.reward_amount, userId]
        );
      } else if (task.reward_token === 'WBTC') {
        await client.query(
          `UPDATE user_profiles 
           SET total_wbtc = total_wbtc + $1, 
               total_tasks_completed = total_tasks_completed + 1
           WHERE user_id = $2`,
          [task.reward_amount, userId]
        );
      }
      
      await client.query('COMMIT');
      
      return completionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Get completed tasks for a user
  async getCompletedTasks(userId: string): Promise<TaskCompletion[]> {
    const result = await pool.query(
      `SELECT tc.*, t.title, t.description, t.reward_amount, t.reward_token
       FROM task_completions tc
       JOIN tasks t ON tc.task_id = t.id
       WHERE tc.user_id = $1
       ORDER BY tc.completed_at DESC`,
      [userId]
    );
    
    return result.rows;
  }
};

import express, { Request, Response } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Get all tasks (with completion status if authenticated)
router.get('/', optionalAuth, (req: Request, res: Response) => taskController.getAllTasks(req, res));

// Get task by ID
router.get('/:id', (req: Request, res: Response) => taskController.getTaskById(req, res));

// Complete a task
router.post('/:taskId/complete', authenticate, (req: Request, res: Response) => taskController.completeTask(req, res));

// Get completed tasks for current user
router.get('/user/completed', authenticate, (req: Request, res: Response) => taskController.getCompletedTasks(req, res));

export default router;

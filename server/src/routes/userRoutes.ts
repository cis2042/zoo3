import express, { Request, Response } from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, (req: Request, res: Response) => userController.getUserProfile(req, res));

// Update user profile
router.put('/profile', authenticate, (req: Request, res: Response) => userController.updateUserProfile(req, res));

export default router;

import express, { Request, Response } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Register a new user
router.post('/register', (req: Request, res: Response) => authController.register(req, res));

// Login user
router.post('/login', (req: Request, res: Response) => authController.login(req, res));

// Get current user
router.get('/me', authenticate, (req: Request, res: Response) => authController.getCurrentUser(req, res));

export default router;

import express, { Request, Response } from 'express';
import { rewardController } from '../controllers/rewardController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get login streak for current user
router.get('/login-streak', authenticate, (req: Request, res: Response) => rewardController.getLoginStreak(req, res));

// Claim daily reward
router.post('/claim-daily', authenticate, (req: Request, res: Response) => rewardController.claimDailyReward(req, res));

// Get user transactions
router.get('/transactions', authenticate, (req: Request, res: Response) => rewardController.getUserTransactions(req, res));

export default router;

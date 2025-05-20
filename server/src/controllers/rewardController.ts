import { Request, Response } from 'express';
import { rewardService } from '../services/rewardService';

export const rewardController = {
  // Get login streak for current user
  async getLoginStreak(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const streak = await rewardService.getLoginStreak(req.user.id);
      
      if (!streak) {
        return res.status(404).json({
          success: false,
          error: '找不到登入紀錄'
        });
      }
      
      // Format the response to match the frontend expectations
      const formattedStreak = {
        id: streak.id,
        userId: streak.user_id,
        streakDays: streak.streak_days,
        currentDay: streak.current_day,
        lastClaimedAt: streak.last_claimed_at,
        daysCompleted: streak.days_completed,
        days: [0, 1, 2, 3, 4, 5, 6].map(day => ({
          day: day + 1,
          completed: streak.days_completed.includes(day.toString())
        }))
      };
      
      // Check if today's reward is already claimed
      const today = new Date();
      const lastClaimed = streak.last_claimed_at ? new Date(streak.last_claimed_at) : null;
      
      const todaysClaimed = !!(lastClaimed && 
        lastClaimed.getDate() === today.getDate() && 
        lastClaimed.getMonth() === today.getMonth() && 
        lastClaimed.getFullYear() === today.getFullYear());
      
      res.status(200).json({
        success: true,
        data: {
          streak: formattedStreak,
          todaysClaimed
        }
      });
    } catch (error) {
      console.error('Get login streak error:', error);
      res.status(500).json({
        success: false,
        error: '獲取登入紀錄時發生錯誤'
      });
    }
  },
  
  // Claim daily reward
  async claimDailyReward(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const result = await rewardService.claimDailyReward(req.user.id);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.message
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          reward: result.reward
        },
        message: result.message
      });
    } catch (error) {
      console.error('Claim daily reward error:', error);
      res.status(500).json({
        success: false,
        error: '領取每日獎勵時發生錯誤'
      });
    }
  },
  
  // Get user transactions
  async getUserTransactions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const transactions = await rewardService.getUserTransactions(req.user.id);
      
      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      console.error('Get user transactions error:', error);
      res.status(500).json({
        success: false,
        error: '獲取交易紀錄時發生錯誤'
      });
    }
  }
};

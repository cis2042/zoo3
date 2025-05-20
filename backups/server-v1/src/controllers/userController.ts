import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
  // Get user profile
  async getUserProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const profile = await userService.getUserProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: '找不到用戶資料'
        });
      }
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        error: '獲取用戶資料時發生錯誤'
      });
    }
  },
  
  // Update user profile
  async updateUserProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      const { display_name, avatar_url } = req.body;
      
      const updatedProfile = await userService.updateUserProfile(req.user.id, {
        display_name,
        avatar_url
      });
      
      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          error: '找不到用戶資料'
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: '用戶資料已更新'
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        error: '更新用戶資料時發生錯誤'
      });
    }
  }
};

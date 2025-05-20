import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authController = {
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const { email, password, displayName } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: '請提供電子郵件和密碼'
        });
      }
      
      // Check if user already exists
      const existingUser = await userService.verifyUser(email, '');
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: '此電子郵件已被註冊'
        });
      }
      
      // Create user
      const user = await userService.createUser(email, password, displayName);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      // Get user profile
      const profile = await userService.getUserProfile(user.id);
      
      res.status(201).json({
        success: true,
        data: {
          user,
          profile,
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: '註冊過程中發生錯誤'
      });
    }
  },
  
  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: '請提供電子郵件和密碼'
        });
      }
      
      // Verify user credentials
      const user = await userService.verifyUser(email, password);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: '電子郵件或密碼不正確'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      // Get user profile
      const profile = await userService.getUserProfile(user.id);
      
      res.status(200).json({
        success: true,
        data: {
          user,
          profile,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: '登入過程中發生錯誤'
      });
    }
  },
  
  // Get current user
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: '未授權'
        });
      }
      
      // Get user details
      const user = await userService.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: '找不到用戶'
        });
      }
      
      // Get user profile
      const profile = await userService.getUserProfile(user.id);
      
      res.status(200).json({
        success: true,
        data: {
          user,
          profile
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: '獲取用戶資訊時發生錯誤'
      });
    }
  }
};

import pool from '../db';
import bcrypt from 'bcrypt';
import { User, UserProfile } from '../types';

export const userService = {
  // Create a new user
  async createUser(email: string, password: string, displayName?: string): Promise<User> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password, display_name) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, display_name, created_at, updated_at`,
        [email, hashedPassword, displayName || email.split('@')[0]]
      );
      
      const user = userResult.rows[0];
      
      // Generate a random referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create user profile
      await client.query(
        `INSERT INTO user_profiles (user_id, display_name, referral_code) 
         VALUES ($1, $2, $3)`,
        [user.id, user.display_name, referralCode]
      );
      
      // Initialize login streak
      await client.query(
        `INSERT INTO login_streaks (user_id, streak_days, current_day) 
         VALUES ($1, 0, 0)`,
        [user.id]
      );
      
      await client.query('COMMIT');
      
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Verify user credentials
  async verifyUser(email: string, password: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, password, display_name, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Don't return the password
    delete user.password;
    
    return user;
  },
  
  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, display_name, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const result = await pool.query(
      `SELECT up.*, 
        (SELECT COUNT(*) FROM referrals WHERE referrer_id = $1) as referral_count
       FROM user_profiles up
       WHERE up.user_id = $1`,
      [userId]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  // Update user profile
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const { display_name, avatar_url } = profileData;
    
    const result = await pool.query(
      `UPDATE user_profiles 
       SET display_name = COALESCE($2, display_name),
           avatar_url = COALESCE($3, avatar_url),
           updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [userId, display_name, avatar_url]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }
};

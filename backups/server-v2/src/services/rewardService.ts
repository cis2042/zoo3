import pool from '../db';
import { LoginStreak, Transaction } from '../types';

export const rewardService = {
  // Get login streak for a user
  async getLoginStreak(userId: string): Promise<LoginStreak | null> {
    const result = await pool.query(
      'SELECT * FROM login_streaks WHERE user_id = $1',
      [userId]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  // Claim daily reward
  async claimDailyReward(userId: string): Promise<{ success: boolean; message: string; reward?: number }> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get user's login streak
      const streakResult = await client.query(
        'SELECT * FROM login_streaks WHERE user_id = $1',
        [userId]
      );
      
      if (streakResult.rows.length === 0) {
        // Create login streak record if it doesn't exist
        await client.query(
          `INSERT INTO login_streaks (user_id, streak_days, current_day, days_completed) 
           VALUES ($1, 0, 0, '{}')`,
          [userId]
        );
        
        await client.query('COMMIT');
        
        // Recursive call now that the record exists
        return this.claimDailyReward(userId);
      }
      
      const streak = streakResult.rows[0];
      const today = new Date();
      const lastClaimed = streak.last_claimed_at ? new Date(streak.last_claimed_at) : null;
      
      // Check if already claimed today
      if (lastClaimed && 
          lastClaimed.getDate() === today.getDate() && 
          lastClaimed.getMonth() === today.getMonth() && 
          lastClaimed.getFullYear() === today.getFullYear()) {
        return { success: false, message: '今日獎勵已領取' };
      }
      
      // Calculate streak
      let newStreakDays = streak.streak_days;
      let newCurrentDay = streak.current_day;
      let daysCompleted = streak.days_completed || [];
      
      // Check if streak is broken (more than 1 day since last claim)
      if (lastClaimed) {
        const daysSinceLastClaim = Math.floor((today.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastClaim > 1) {
          // Reset streak
          newStreakDays = 0;
          newCurrentDay = 0;
          daysCompleted = [];
        }
      }
      
      // Increment streak
      newStreakDays++;
      
      // Update current day (cycles 0-6)
      newCurrentDay = (newCurrentDay + 1) % 7;
      
      // Add current day to completed days
      daysCompleted.push(newCurrentDay.toString());
      
      // Determine reward amount (1 KAIA for regular days, 3 KAIA for day 7)
      const rewardAmount = newCurrentDay === 6 ? 3 : 1;
      
      // Update login streak
      await client.query(
        `UPDATE login_streaks 
         SET streak_days = $1, 
             current_day = $2, 
             last_claimed_at = NOW(),
             days_completed = $3
         WHERE user_id = $4`,
        [newStreakDays, newCurrentDay, daysCompleted, userId]
      );
      
      // Add transaction record
      await client.query(
        `INSERT INTO transactions (user_id, amount, token, transaction_type, description) 
         VALUES ($1, $2, 'KAIA', 'daily_reward', '每日簽到獎勵')`,
        [userId, rewardAmount]
      );
      
      // Update user balance
      await client.query(
        `UPDATE user_profiles 
         SET total_kaia = total_kaia + $1,
             last_login_date = NOW(),
             login_streak = $2
         WHERE user_id = $3`,
        [rewardAmount, newStreakDays, userId]
      );
      
      await client.query('COMMIT');
      
      return { 
        success: true, 
        message: '成功領取每日獎勵', 
        reward: rewardAmount 
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Get user transactions
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    return result.rows;
  }
};

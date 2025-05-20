import fs from 'fs';
import path from 'path';
import pool from './index';

async function setupDatabase() {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Connect to the database
    const client = await pool.connect();
    
    try {
      // Execute the SQL commands
      await client.query(sql);
      console.log('Database setup completed successfully');
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;

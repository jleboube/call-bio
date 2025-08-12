const fs = require('fs');
const path = require('path');
const { query } = require('../db/database');
require('dotenv').config();

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = initSql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await query(statement.trim());
        } catch (error) {
          // Log but don't fail on errors like "already exists"
          if (error.code === '42710' || error.code === '42P07' || error.code === '42P16') {
            console.log('Skipping already existing object:', error.message);
          } else {
            console.warn('Migration warning:', error.message);
          }
        }
      }
    }
    
    console.log('Database migrations completed successfully!');
    
    // Only exit if this is run directly, not when imported
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
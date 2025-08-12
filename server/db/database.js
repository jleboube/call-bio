const { Pool } = require('pg');

// Configure PostgreSQL connection with security limits
const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  max: 20,                     // maximum number of connections
  idleTimeoutMillis: 30000,    // close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // timeout connection attempts after 2 seconds
  query_timeout: 30000,        // timeout queries after 30 seconds
  statement_timeout: 30000     // timeout statements after 30 seconds
};

// Enable SSL only for external services (not local Docker containers)
if (process.env.DATABASE_URL && (
  process.env.DATABASE_URL.includes('amazonaws.com') || 
  process.env.DATABASE_URL.includes('heroku') ||
  process.env.DATABASE_URL.includes('render.com') ||
  process.env.DATABASE_URL.includes('planetscale') ||
  process.env.DATABASE_URL.includes('neon.tech')
)) {
  connectionConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(connectionConfig);

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Database query helper with security monitoring
const query = async (text, params, req = null) => {
  const start = Date.now();
  
  // Security monitoring for dangerous operations
  const lowercaseText = text.toLowerCase();
  const suspiciousPatterns = ['drop table', 'delete from users', 'truncate', 'alter table users', 'grant all'];
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => lowercaseText.includes(pattern));
  
  if (hasSuspiciousPattern) {
    const userInfo = req?.user ? `User: ${req.user.email} (${req.user.userId})` : 'No user context';
    console.warn('SECURITY ALERT: Potentially dangerous query detected', { 
      query: text, 
      user: userInfo,
      timestamp: new Date().toISOString(),
      ip: req?.ip || 'unknown'
    });
  }

  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn('SLOW QUERY DETECTED', { text, duration, rows: res.rowCount });
    } else {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  query,
  pool
};
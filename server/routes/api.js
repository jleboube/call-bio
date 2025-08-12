const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../db/database');

const router = express.Router();

// API endpoint for bio lookup by email addresses
router.post('/bios/lookup', [
  body('emails').isArray({ min: 1 }).withMessage('Emails array is required'),
  body('emails.*').isEmail().withMessage('All emails must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emails } = req.body;

    if (emails.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 emails allowed per request' });
    }

    // Normalize emails
    const normalizedEmails = emails.map(email => email.toLowerCase().trim());

    // Query for users with bios
    const result = await query(
      `SELECT 
        u.email, 
        b.user_id,
        CASE 
          WHEN b.is_public = true THEN CONCAT($1, '/bio/', b.user_id)
          ELSE NULL 
        END as bio_url
      FROM users u 
      LEFT JOIN bios b ON u.id = b.user_id 
      WHERE u.email = ANY($2::text[])`,
      [req.get('host') ? `${req.protocol}://${req.get('host')}` : 'https://call-bio.com', normalizedEmails]
    );

    // Format response
    const bioLookup = {};
    
    for (const email of normalizedEmails) {
      const userBio = result.rows.find(row => row.email === email);
      bioLookup[email] = userBio && userBio.bio_url ? {
        bio_url: userBio.bio_url,
        has_bio: true
      } : {
        bio_url: null,
        has_bio: false
      };
    }

    res.json({
      lookup: bioLookup,
      total_requested: emails.length,
      total_found: result.rows.filter(row => row.bio_url).length
    });

  } catch (error) {
    console.error('Bio lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public bio page endpoint (HTML response)
router.get('/bio/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      'SELECT * FROM bios WHERE user_id = $1 AND is_public = true',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bio Not Found</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bio Not Found</h1>
            <p>The requested bio could not be found or is not public.</p>
          </div>
        </body>
        </html>
      `);
    }

    const bio = result.rows[0];
    const profileImageUrl = bio.profile_photo 
      ? `${req.protocol}://${req.get('host')}/uploads/${bio.profile_photo}`
      : null;

    // Return HTML bio page
    const bioHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${bio.first_name} ${bio.last_name} - Professional Bio</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .bio-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 20px 0;
          }
          .bio-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }
          .profile-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 30px;
            border: 4px solid #e9ecef;
          }
          .bio-info h1 {
            margin: 0;
            font-size: 2.2em;
            color: #2c3e50;
          }
          .bio-info .role {
            font-size: 1.3em;
            color: #3498db;
            margin: 5px 0;
            font-weight: 500;
          }
          .bio-info .company {
            font-size: 1.1em;
            color: #7f8c8d;
            margin: 3px 0;
            font-weight: 400;
          }
          .bio-info .linkedin {
            margin: 8px 0;
          }
          .bio-info .linkedin a {
            color: #0077b5;
            text-decoration: none;
            font-size: 0.95em;
            font-weight: 500;
            transition: color 0.2s;
          }
          .bio-info .linkedin a:hover {
            color: #005885;
            text-decoration: underline;
          }
          .role-description {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3498db;
          }
          .short-bio {
            font-size: 1.1em;
            line-height: 1.7;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #6c757d;
            font-size: 0.9em;
          }
          @media (max-width: 600px) {
            .bio-card { padding: 20px; }
            .bio-header { flex-direction: column; text-align: center; }
            .profile-photo { margin-right: 0; margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="bio-card">
          <div class="bio-header">
            ${profileImageUrl ? `<img src="${profileImageUrl}" alt="${bio.first_name} ${bio.last_name}" class="profile-photo">` : ''}
            <div class="bio-info">
              <h1>${bio.first_name} ${bio.last_name}</h1>
              ${bio.job_title ? `<div class="role">${bio.job_title}</div>` : ''}
              ${bio.company ? `<div class="company">${bio.company}</div>` : ''}
              ${bio.linkedin_url ? `<div class="linkedin"><a href="${bio.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn Profile →</a></div>` : ''}
            </div>
          </div>
          
          ${bio.role_description ? `
            <div class="role-description">
              <h3>Role Description</h3>
              <p>${bio.role_description}</p>
            </div>
          ` : ''}
          
          ${bio.short_bio ? `
            <div class="short-bio">
              <h3>About</h3>
              <p>${bio.short_bio}</p>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Powered by Conference Call Bio Service</p>
        </div>
      </body>
      </html>
    `;

    res.send(bioHtml);

  } catch (error) {
    console.error('Public bio error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
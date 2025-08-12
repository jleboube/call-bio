const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { query } = require('../db/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get user's bio
router.get('/my-bio', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM bios WHERE user_id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ bio: null });
    }

    res.json({ bio: result.rows[0] });

  } catch (error) {
    console.error('Get bio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update user's bio  
router.post('/my-bio', authenticate, upload.single('profile_photo'), [
  body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('job_title').optional().trim(),
  body('company').optional().trim(),
  body('linkedin_url').optional().isURL().withMessage('LinkedIn URL must be a valid URL'),
  body('role_description').optional().trim(),
  body('short_bio').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, job_title, company, linkedin_url, role_description, short_bio } = req.body;
    const profile_photo = req.file ? req.file.filename : null;

    // Check if bio exists
    const existingBio = await query('SELECT id, profile_photo FROM bios WHERE user_id = $1', [req.user.userId]);

    if (existingBio.rows.length > 0) {
      // Update existing bio
      const updateFields = [
        'first_name = $1',
        'last_name = $2', 
        'job_title = $3',
        'company = $4',
        'linkedin_url = $5',
        'role_description = $6',
        'short_bio = $7'
      ];
      const values = [first_name, last_name, job_title, company, linkedin_url, role_description, short_bio];

      if (profile_photo) {
        // Delete old photo if it exists
        const oldPhoto = existingBio.rows[0].profile_photo;
        if (oldPhoto) {
          const oldPhotoPath = path.join(__dirname, '../../uploads', oldPhoto);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        updateFields.push('profile_photo = $8');
        values.push(profile_photo);
      }

      values.push(req.user.userId);
      
      const result = await query(
        `UPDATE bios SET ${updateFields.join(', ')} WHERE user_id = $${values.length} RETURNING *`,
        values
      );

      res.json({ bio: result.rows[0], message: 'Bio updated successfully' });

    } else {
      // Create new bio
      const result = await query(
        'INSERT INTO bios (user_id, first_name, last_name, job_title, company, linkedin_url, role_description, short_bio, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [req.user.userId, first_name, last_name, job_title, company, linkedin_url, role_description, short_bio, profile_photo]
      );

      res.status(201).json({ bio: result.rows[0], message: 'Bio created successfully' });
    }

  } catch (error) {
    console.error('Bio save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get public bio by user ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      'SELECT b.*, u.email FROM bios b JOIN users u ON b.user_id = u.id WHERE b.user_id = $1 AND b.is_public = true',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bio not found' });
    }

    const bio = result.rows[0];
    // Don't return email in public view
    delete bio.email;

    res.json({ bio });

  } catch (error) {
    console.error('Get public bio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
// server/routes/zoom.js
const express = require('express');
const router = express.Router();
const zoomClient = require('../zoom-client');
const { query } = require('../db/database'); // Match your existing pattern

// Get meeting attendees
router.get('/meetings/:meetingId/attendees', async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    if (!meetingId) {
      return res.status(400).json({
        error: 'Meeting ID is required'
      });
    }

    console.log(`Fetching attendees for meeting: ${meetingId}`);
    
    // Get meeting participants from Zoom
    const participants = await zoomClient.getMeetingParticipants(meetingId);
    
    // Transform the response to match call-bio's clean API pattern
    const attendees = participants.participants?.map(participant => ({
      id: participant.id,
      user_id: participant.user_id,
      name: participant.name,
      user_email: participant.user_email,
      join_time: participant.join_time,
      leave_time: participant.leave_time,
      duration: participant.duration,
      attentiveness_score: participant.attentiveness_score
    })) || [];

    res.json({
      meeting_id: meetingId,
      total_attendees: attendees.length,
      attendees: attendees
    });

  } catch (error) {
    console.error('Error fetching meeting attendees:', error);
    res.status(500).json({
      error: 'Failed to fetch meeting attendees',
      message: error.message
    });
  }
});

// Get meeting details
router.get('/meetings/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    if (!meetingId) {
      return res.status(400).json({
        error: 'Meeting ID is required'
      });
    }

    console.log(`Fetching details for meeting: ${meetingId}`);
    
    const meeting = await zoomClient.getMeetingDetails(meetingId);
    
    // Return essential meeting info
    res.json({
      id: meeting.id,
      topic: meeting.topic,
      type: meeting.type,
      status: meeting.status,
      start_time: meeting.start_time,
      duration: meeting.duration,
      timezone: meeting.timezone,
      host_id: meeting.host_id,
      host_email: meeting.host_email
    });

  } catch (error) {
    console.error('Error fetching meeting details:', error);
    res.status(500).json({
      error: 'Failed to fetch meeting details',
      message: error.message
    });
  }
});

// Get attendees with bio information (integrating with call-bio's existing bio lookup)
router.get('/meetings/:meetingId/attendees-with-bios', async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    console.log(`Fetching attendees with bios for meeting: ${meetingId}`);
    
    // Get meeting participants from Zoom
    const participants = await zoomClient.getMeetingParticipants(meetingId);
    const attendees = participants.participants || [];
    
    // Extract email addresses for bio lookup
    const emails = attendees
      .map(p => p.user_email)
      .filter(email => email && email.includes('@'));

    // Bio lookup using your existing database query pattern
    let bioLookup = {};
    if (emails.length > 0) {
      try {
        // Query to match call-bio's database schema using your existing query function
        const placeholders = emails.map((_, index) => `$${index + 1}`).join(',');
        const queryText = `
          SELECT u.id as user_id, u.email, b.bio_text, b.title, b.company
          FROM users u
          INNER JOIN bios b ON u.id = b.user_id
          WHERE u.email IN (${placeholders})
          AND b.bio_text IS NOT NULL
          AND b.bio_text != ''
        `;
        
        const result = await query(queryText, emails, req);
        
        // Transform to match existing API format
        bioLookup = result.rows.reduce((lookup, bio) => {
          lookup[bio.email] = {
            bio_url: `${req.protocol}://${req.get('host')}/bio/${bio.user_id}`,
            has_bio: true
          };
          return lookup;
        }, {});

        // Add entries for emails without bios
        emails.forEach(email => {
          if (!bioLookup[email]) {
            bioLookup[email] = {
              bio_url: null,
              has_bio: false
            };
          }
        });
        
      } catch (bioError) {
        console.error('Error looking up bios:', bioError);
        // Continue without bio data if lookup fails
        emails.forEach(email => {
          bioLookup[email] = {
            bio_url: null,
            has_bio: false
          };
        });
      }
    }

    // Combine attendee data with bio information
    const attendeesWithBios = attendees.map(attendee => ({
      id: attendee.id,
      user_id: attendee.user_id,
      name: attendee.name,
      user_email: attendee.user_email,
      join_time: attendee.join_time,
      leave_time: attendee.leave_time,
      duration: attendee.duration,
      attentiveness_score: attendee.attentiveness_score,
      bio_url: bioLookup[attendee.user_email]?.bio_url || null,
      has_bio: bioLookup[attendee.user_email]?.has_bio || false
    }));

    res.json({
      meeting_id: meetingId,
      total_attendees: attendeesWithBios.length,
      attendees: attendeesWithBios,
      lookup: bioLookup,
      total_requested: emails.length,
      total_found: Object.values(bioLookup).filter(bio => bio.has_bio).length
    });

  } catch (error) {
    console.error('Error fetching attendees with bios:', error);
    res.status(500).json({
      error: 'Failed to fetch attendees with bio information',
      message: error.message
    });
  }
});

module.exports = router;
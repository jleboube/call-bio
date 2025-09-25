const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { query } = require('../db/database');
const verifyZoomWebhook = require('../middleware/zoomWebhook');
const bioSharingService = require('../services/bioSharingService');

// Zoom webhook event handlers
const eventHandlers = {
  'meeting.started': async (payload) => {
    console.log('Meeting started:', payload.object.id);

    const meeting = payload.object;

    // Insert or update meeting record
    await query(`
      INSERT INTO zoom_meetings (
        zoom_meeting_id, zoom_meeting_uuid, host_id, host_email,
        topic, start_time, timezone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (zoom_meeting_id)
      DO UPDATE SET
        start_time = EXCLUDED.start_time,
        updated_at = CURRENT_TIMESTAMP
    `, [
      meeting.id,
      meeting.uuid,
      meeting.host_id,
      payload.operator || null,
      meeting.topic,
      new Date(meeting.start_time),
      meeting.timezone
    ]);

    return { success: true, message: 'Meeting started event processed' };
  },

  'meeting.ended': async (payload) => {
    console.log('Meeting ended:', payload.object.id);

    const meeting = payload.object;

    // Update meeting end time and duration
    await query(`
      UPDATE zoom_meetings
      SET
        end_time = $1,
        duration = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE zoom_meeting_id = $3
    `, [
      new Date(meeting.end_time),
      meeting.duration,
      meeting.id
    ]);

    return { success: true, message: 'Meeting ended event processed' };
  },

  'meeting.participant_joined': async (payload) => {
    console.log('Participant joined:', payload.object.participant.user_name);

    const participant = payload.object.participant;
    const meetingId = payload.object.id;

    // Get meeting record
    const meetingResult = await query(
      'SELECT id FROM zoom_meetings WHERE zoom_meeting_id = $1',
      [meetingId]
    );

    if (meetingResult.rows.length === 0) {
      console.error('Meeting not found for participant join:', meetingId);
      return { success: false, message: 'Meeting not found' };
    }

    const dbMeetingId = meetingResult.rows[0].id;

    // Check if user has a bio
    let hasBio = false;
    let bioUrl = null;

    if (participant.email) {
      const bioResult = await query(`
        SELECT u.id as user_id
        FROM users u
        INNER JOIN bios b ON u.id = b.user_id
        WHERE u.email = $1
        AND b.short_bio IS NOT NULL
        AND b.short_bio != ''
      `, [participant.email]);

      if (bioResult.rows.length > 0) {
        hasBio = true;
        bioUrl = `https://call-bio.com/bio/${bioResult.rows[0].user_id}`;
      }
    }

    // Insert participant record
    await query(`
      INSERT INTO meeting_participants (
        meeting_id, zoom_participant_id, participant_email,
        participant_name, join_time, has_bio, bio_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (meeting_id, zoom_participant_id)
      DO UPDATE SET
        join_time = EXCLUDED.join_time,
        updated_at = CURRENT_TIMESTAMP
    `, [
      dbMeetingId,
      participant.id,
      participant.email,
      participant.user_name,
      new Date(participant.join_time),
      hasBio,
      bioUrl
    ]);

    // Update participant count
    await query(`
      UPDATE zoom_meetings
      SET participant_count = (
        SELECT COUNT(DISTINCT zoom_participant_id)
        FROM meeting_participants
        WHERE meeting_id = $1
      )
      WHERE id = $1
    `, [dbMeetingId]);

    // Share bio in real-time if participant has one
    if (hasBio && bioUrl) {
      console.log(`Attempting to share bio for ${participant.user_name}`);

      const sharingResult = await bioSharingService.shareBioInMeeting(
        meetingId,
        participant.email,
        participant.user_name,
        bioUrl
      );

      console.log('Bio sharing result:', sharingResult);
    }

    return {
      success: true,
      message: 'Participant joined event processed',
      hasBio,
      bioUrl,
      bioShared: hasBio
    };
  },

  'meeting.participant_left': async (payload) => {
    console.log('Participant left:', payload.object.participant.user_name);

    const participant = payload.object.participant;
    const meetingId = payload.object.id;

    // Get meeting record
    const meetingResult = await query(
      'SELECT id FROM zoom_meetings WHERE zoom_meeting_id = $1',
      [meetingId]
    );

    if (meetingResult.rows.length === 0) {
      return { success: false, message: 'Meeting not found' };
    }

    const dbMeetingId = meetingResult.rows[0].id;

    // Update participant leave time and duration
    await query(`
      UPDATE meeting_participants
      SET
        leave_time = $1,
        duration = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE meeting_id = $3 AND zoom_participant_id = $4
    `, [
      new Date(participant.leave_time),
      participant.duration,
      dbMeetingId,
      participant.id
    ]);

    return { success: true, message: 'Participant left event processed' };
  }
};

// Main webhook endpoint
router.post('/zoom/events', verifyZoomWebhook, async (req, res) => {
  try {
    const { event, payload } = req.body;

    console.log(`Received Zoom webhook: ${event}`);

    // Log the webhook event for monitoring
    await query(`
      INSERT INTO zoom_webhook_events (event_type, zoom_meeting_id, payload)
      VALUES ($1, $2, $3)
    `, [
      event,
      payload?.object?.id || null,
      JSON.stringify(payload)
    ]);

    // Handle URL verification challenge
    if (event === 'endpoint.url_validation') {
      const { plainToken } = payload;
      const encryptedToken = crypto
        .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET)
        .update(plainToken)
        .digest('hex');

      return res.json({
        plainToken,
        encryptedToken
      });
    }

    // Route to appropriate event handler
    if (eventHandlers[event]) {
      const result = await eventHandlers[event](payload);

      // Mark event as processed
      await query(`
        UPDATE zoom_webhook_events
        SET processed = true
        WHERE event_type = $1
        AND zoom_meeting_id = $2
        AND processed = false
        AND received_at > NOW() - INTERVAL '1 minute'
      `, [event, payload?.object?.id]);

      console.log(`Processed ${event}:`, result);
      return res.json(result);
    } else {
      console.log(`Unhandled webhook event: ${event}`);
      return res.json({
        success: true,
        message: `Event ${event} received but not handled`
      });
    }

  } catch (error) {
    console.error('Zoom webhook error:', error);

    // Log error
    try {
      await query(`
        UPDATE zoom_webhook_events
        SET error_message = $1
        WHERE event_type = $2
        AND zoom_meeting_id = $3
        AND processed = false
        AND received_at > NOW() - INTERVAL '1 minute'
      `, [
        error.message,
        req.body?.event || 'unknown',
        req.body?.payload?.object?.id || null
      ]);
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    return res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message
    });
  }
});

// Webhook status endpoint for monitoring
router.get('/zoom/status', async (req, res) => {
  try {
    const stats = await query(`
      SELECT
        event_type,
        COUNT(*) as total,
        COUNT(CASE WHEN processed = true THEN 1 END) as processed,
        COUNT(CASE WHEN error_message IS NOT NULL THEN 1 END) as errors
      FROM zoom_webhook_events
      WHERE received_at > NOW() - INTERVAL '24 hours'
      GROUP BY event_type
      ORDER BY total DESC
    `);

    const recentMeetings = await query(`
      SELECT
        zoom_meeting_id,
        topic,
        start_time,
        end_time,
        participant_count,
        auto_bio_sharing
      FROM zoom_meetings
      WHERE created_at > NOW() - INTERVAL '24 hours'
      ORDER BY start_time DESC
      LIMIT 10
    `);

    res.json({
      webhook_stats: stats.rows,
      recent_meetings: recentMeetings.rows,
      status: 'healthy'
    });

  } catch (error) {
    console.error('Webhook status error:', error);
    res.status(500).json({
      error: 'Failed to get webhook status',
      message: error.message
    });
  }
});

// Meeting management endpoints
router.get('/meetings', async (req, res) => {
  try {
    const { host_email, status, limit = 50 } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (host_email) {
      whereClause += ` AND host_email = $${paramIndex}`;
      params.push(host_email);
      paramIndex++;
    }

    if (status === 'active') {
      whereClause += ` AND start_time IS NOT NULL AND end_time IS NULL`;
    } else if (status === 'completed') {
      whereClause += ` AND end_time IS NOT NULL`;
    }

    whereClause += ` ORDER BY start_time DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));

    const meetings = await query(`
      SELECT
        zoom_meeting_id,
        topic,
        host_email,
        start_time,
        end_time,
        duration,
        participant_count,
        auto_bio_sharing,
        bio_summary_sent,
        created_at
      FROM zoom_meetings
      ${whereClause}
    `, params);

    res.json({
      meetings: meetings.rows,
      total: meetings.rows.length
    });

  } catch (error) {
    console.error('Meeting list error:', error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

router.get('/meetings/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await query(`
      SELECT *
      FROM zoom_meetings
      WHERE zoom_meeting_id = $1
    `, [meetingId]);

    if (meeting.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const participants = await query(`
      SELECT
        participant_name,
        participant_email,
        join_time,
        leave_time,
        duration,
        has_bio,
        bio_url,
        bio_shared
      FROM meeting_participants
      WHERE meeting_id = $1
      ORDER BY join_time ASC
    `, [meeting.rows[0].id]);

    const summary = await bioSharingService.generateMeetingBioSummary(meetingId);

    res.json({
      meeting: meeting.rows[0],
      participants: participants.rows,
      bio_summary: summary
    });

  } catch (error) {
    console.error('Meeting detail error:', error);
    res.status(500).json({ error: 'Failed to fetch meeting details' });
  }
});

router.patch('/meetings/:meetingId/bio-sharing', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    const result = await bioSharingService.toggleAutoSharingForMeeting(meetingId, enabled);

    res.json({
      success: true,
      meeting_id: meetingId,
      auto_bio_sharing: enabled,
      message: `Bio sharing ${enabled ? 'enabled' : 'disabled'} for meeting`
    });

  } catch (error) {
    console.error('Toggle bio sharing error:', error);
    res.status(500).json({ error: 'Failed to toggle bio sharing' });
  }
});

router.get('/meetings/:meetingId/bio-summary', async (req, res) => {
  try {
    const { meetingId } = req.params;

    const summary = await bioSharingService.generateMeetingBioSummary(meetingId);

    res.json(summary);

  } catch (error) {
    console.error('Bio summary error:', error);
    res.status(500).json({ error: 'Failed to generate bio summary' });
  }
});

module.exports = router;
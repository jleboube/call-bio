const { query } = require('../db/database');
const zoomClient = require('../zoom-client');

class BioSharingService {
  async shareBioInMeeting(meetingId, participantEmail, participantName, bioUrl) {
    try {
      // Check if auto-sharing is enabled for this meeting
      const meetingResult = await query(`
        SELECT auto_bio_sharing
        FROM zoom_meetings
        WHERE zoom_meeting_id = $1
      `, [meetingId]);

      if (meetingResult.rows.length === 0 || !meetingResult.rows[0].auto_bio_sharing) {
        console.log(`Bio sharing disabled for meeting ${meetingId}`);
        return { success: false, reason: 'auto_sharing_disabled' };
      }

      // Create a friendly bio message
      const message = this.createBioMessage(participantName, bioUrl);

      // Send message to Zoom chat (if Zoom is configured)
      if (zoomClient.isConfigured) {
        try {
          await zoomClient.sendChatMessage(meetingId, message);
          console.log(`Bio shared in chat for ${participantEmail}`);

          // Mark bio as shared
          await this.markBioAsShared(meetingId, participantEmail);

          return { success: true, method: 'chat', message };
        } catch (chatError) {
          console.log('Chat sharing failed, trying alternative methods:', chatError.message);
        }
      } else {
        console.log('Zoom not configured, skipping chat sharing for', participantEmail);
      }

      // Fallback: Send email notification to host
      try {
        await this.sendBioEmailToHost(meetingId, participantName, participantEmail, bioUrl);

        // Mark bio as shared
        await this.markBioAsShared(meetingId, participantEmail);

        return { success: true, method: 'email', message };
      } catch (emailError) {
        console.error('All bio sharing methods failed:', emailError);
        return { success: false, reason: 'sharing_failed', error: emailError.message };
      }

    } catch (error) {
      console.error('Bio sharing service error:', error);
      return { success: false, reason: 'service_error', error: error.message };
    }
  }

  createBioMessage(participantName, bioUrl) {
    return `👋 ${participantName} has joined! Check out their bio: ${bioUrl} 🔗`;
  }

  async markBioAsShared(meetingId, participantEmail) {
    await query(`
      UPDATE meeting_participants mp
      SET bio_shared = true, updated_at = CURRENT_TIMESTAMP
      FROM zoom_meetings zm
      WHERE zm.zoom_meeting_id = $1
      AND mp.meeting_id = zm.id
      AND mp.participant_email = $2
    `, [meetingId, participantEmail]);
  }

  async sendBioEmailToHost(meetingId, participantName, participantEmail, bioUrl) {
    // Get meeting host email
    const hostResult = await query(`
      SELECT host_email, topic
      FROM zoom_meetings
      WHERE zoom_meeting_id = $1
    `, [meetingId]);

    if (hostResult.rows.length === 0 || !hostResult.rows[0].host_email) {
      throw new Error('Meeting host email not found');
    }

    const { host_email, topic } = hostResult.rows[0];

    // For now, just log the email (you can integrate with nodemailer later)
    const emailContent = {
      to: host_email,
      subject: `New Participant Bio Available - ${topic}`,
      body: `
        Hello!

        ${participantName} (${participantEmail}) has joined your meeting "${topic}" and has a bio available:

        👤 ${participantName}
        📧 ${participantEmail}
        🔗 Bio: ${bioUrl}

        Best regards,
        Conference Call Bio Service
      `
    };

    console.log('Bio email notification (would send):', emailContent);

    // TODO: Implement actual email sending with nodemailer
    // await emailService.send(emailContent);

    return true;
  }

  async generateMeetingBioSummary(meetingId) {
    try {
      const participants = await query(`
        SELECT
          mp.participant_name,
          mp.participant_email,
          mp.has_bio,
          mp.bio_url,
          mp.bio_shared,
          mp.join_time
        FROM meeting_participants mp
        JOIN zoom_meetings zm ON mp.meeting_id = zm.id
        WHERE zm.zoom_meeting_id = $1
        ORDER BY mp.join_time ASC
      `, [meetingId]);

      const summary = {
        meeting_id: meetingId,
        total_participants: participants.rows.length,
        participants_with_bios: participants.rows.filter(p => p.has_bio).length,
        bio_sharing_rate: 0,
        participants: participants.rows
      };

      if (summary.participants_with_bios > 0) {
        const sharedBios = participants.rows.filter(p => p.bio_shared).length;
        summary.bio_sharing_rate = Math.round((sharedBios / summary.participants_with_bios) * 100);
      }

      return summary;
    } catch (error) {
      console.error('Error generating bio summary:', error);
      throw error;
    }
  }

  async toggleAutoSharingForMeeting(meetingId, enabled) {
    await query(`
      UPDATE zoom_meetings
      SET auto_bio_sharing = $1, updated_at = CURRENT_TIMESTAMP
      WHERE zoom_meeting_id = $2
    `, [enabled, meetingId]);

    return { success: true, auto_bio_sharing: enabled };
  }
}

module.exports = new BioSharingService();
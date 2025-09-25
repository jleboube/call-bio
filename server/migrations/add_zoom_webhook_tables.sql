-- Create zoom_meetings table for tracking meetings
CREATE TABLE IF NOT EXISTS zoom_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoom_meeting_id VARCHAR(255) UNIQUE NOT NULL,
  zoom_meeting_uuid VARCHAR(255),
  host_id VARCHAR(255),
  host_email VARCHAR(255),
  topic VARCHAR(500),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  timezone VARCHAR(100),
  duration INTEGER,
  auto_bio_sharing BOOLEAN DEFAULT true,
  bio_summary_sent BOOLEAN DEFAULT false,
  participant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meeting_participants table for real-time tracking
CREATE TABLE IF NOT EXISTS meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES zoom_meetings(id) ON DELETE CASCADE,
  zoom_participant_id VARCHAR(255),
  participant_email VARCHAR(255),
  participant_name VARCHAR(255),
  join_time TIMESTAMP,
  leave_time TIMESTAMP,
  duration INTEGER,
  bio_shared BOOLEAN DEFAULT false,
  has_bio BOOLEAN DEFAULT false,
  bio_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create webhook_events table for debugging and monitoring
CREATE TABLE IF NOT EXISTS zoom_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  zoom_meeting_id VARCHAR(255),
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_zoom_meetings_zoom_id ON zoom_meetings(zoom_meeting_id);
CREATE INDEX IF NOT EXISTS idx_zoom_meetings_host_email ON zoom_meetings(host_email);
CREATE INDEX IF NOT EXISTS idx_zoom_meetings_start_time ON zoom_meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_email ON meeting_participants(participant_email);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON zoom_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_meeting_id ON zoom_webhook_events(zoom_meeting_id);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_zoom_meetings_updated_at ON zoom_meetings;
CREATE TRIGGER update_zoom_meetings_updated_at BEFORE UPDATE ON zoom_meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meeting_participants_updated_at ON meeting_participants;
CREATE TRIGGER update_meeting_participants_updated_at BEFORE UPDATE ON meeting_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
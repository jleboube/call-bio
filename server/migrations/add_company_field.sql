-- Migration: Add company field to bios table
-- Run this on existing databases to add the company field

ALTER TABLE bios ADD COLUMN IF NOT EXISTS company VARCHAR(200);

-- Add comment for documentation
COMMENT ON COLUMN bios.company IS 'Company or employer name of the bio owner';
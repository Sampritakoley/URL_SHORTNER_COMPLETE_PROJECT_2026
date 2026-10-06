-- Migration script V2 for OAuth 2.0 / OIDC support
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(32) DEFAULT 'LOCAL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_subject VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS picture VARCHAR(512);

-- Make password nullable for OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Set existing null auth_provider to LOCAL
UPDATE users SET auth_provider = 'LOCAL' WHERE auth_provider IS NULL;

-- Unique constraint on provider and provider_subject
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_users_provider_subject'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT uk_users_provider_subject UNIQUE (auth_provider, provider_subject);
    END IF;
END $$;

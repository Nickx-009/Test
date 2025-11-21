-- Enable extensions for UUIDs and case-insensitive text
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS citext;

-- Enumerated types
CREATE TYPE plan_tier AS ENUM ('FREE', 'TEAM', 'ENTERPRISE');
CREATE TYPE user_role AS ENUM ('ADMIN', 'RECRUITER', 'HIRING_MANAGER');
CREATE TYPE employment_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'TEMPORARY');
CREATE TYPE job_status AS ENUM ('OPEN', 'CLOSED', 'ON_HOLD');
CREATE TYPE application_stage AS ENUM ('APPLIED', 'SCREEN', 'HM_INTERVIEW', 'ONSITE', 'OFFER', 'HIRED', 'REJECTED');
CREATE TYPE interview_type AS ENUM ('RECRUITER_SCREEN', 'HM_INTERVIEW', 'PANEL', 'DEBRIEF');
CREATE TYPE interview_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW');
CREATE TYPE participant_role AS ENUM ('INTERVIEWER', 'OBSERVER', 'CANDIDATE');
CREATE TYPE schedule_template_type AS ENUM ('HM_INTERVIEW', 'PANEL');
CREATE TYPE message_direction AS ENUM ('OUTBOUND', 'INBOUND');
CREATE TYPE message_channel AS ENUM ('EMAIL', 'SMS', 'NOTE');

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subdomain CITEXT NOT NULL UNIQUE,
    plan_tier plan_tier NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email CITEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, email)
);
CREATE INDEX idx_users_org ON users(organization_id);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT,
    department TEXT,
    employment_type employment_type,
    salary_range TEXT,
    status job_status NOT NULL DEFAULT 'OPEN',
    description TEXT,
    hiring_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        hiring_manager_id IS NULL
        OR EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = hiring_manager_id AND u.organization_id = jobs.organization_id
        )
    )
);
CREATE INDEX idx_jobs_org ON jobs(organization_id);
CREATE INDEX idx_jobs_org_status ON jobs(organization_id, status);

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email CITEXT,
    phone TEXT,
    source TEXT,
    resume_url TEXT,
    resume_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, email)
);
CREATE INDEX idx_candidates_org ON candidates(organization_id);

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    current_stage application_stage NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    rejected_reason TEXT,
    UNIQUE (candidate_id, job_id)
);
CREATE INDEX idx_applications_org ON applications(organization_id);
CREATE INDEX idx_applications_job_stage ON applications(job_id, current_stage);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);

-- Interviews
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    interview_type interview_type NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status interview_status NOT NULL DEFAULT 'SCHEDULED',
    calendar_event_id TEXT,
    video_link TEXT,
    location TEXT,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_interviews_org ON interviews(organization_id);
CREATE INDEX idx_interviews_application ON interviews(application_id);

-- Interview Participants
CREATE TABLE interview_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    external_email CITEXT,
    role participant_role NOT NULL,
    CHECK (user_id IS NOT NULL OR external_email IS NOT NULL)
);
CREATE INDEX idx_participants_interview ON interview_participants(interview_id);

-- Schedule Tokens (gatekeeper links)
CREATE TABLE schedule_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    interview_template_type schedule_template_type NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    max_uses INT NOT NULL DEFAULT 1 CHECK (max_uses > 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0 AND used_count <= max_uses),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_schedule_tokens_org ON schedule_tokens(organization_id);
CREATE INDEX idx_schedule_tokens_job_candidate ON schedule_tokens(job_id, candidate_id);

-- Messages (email/SMS/notes)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
    direction message_direction NOT NULL,
    channel message_channel NOT NULL,
    subject TEXT,
    body TEXT,
    sent_at TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_org ON messages(organization_id);
CREATE INDEX idx_messages_candidate ON messages(candidate_id);

-- Scorecards
CREATE TABLE scorecards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ratings_json JSONB,
    overall_recommendation TEXT,
    notes TEXT,
    submitted_at TIMESTAMPTZ
);
CREATE INDEX idx_scorecards_org ON scorecards(organization_id);
CREATE INDEX idx_scorecards_interview ON scorecards(interview_id);

-- Automation Rules (future use)
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trigger TEXT NOT NULL,
    conditions_json JSONB,
    action_json JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_automation_rules_org ON automation_rules(organization_id);

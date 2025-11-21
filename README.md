# ATS Schema

This repository contains the initial PostgreSQL schema for the applicant tracking MVP. Apply the migration in `migrations/0001_initial.sql` to provision the database.

## Entities
- Organizations with plan tiers and subdomains.
- Users with organization scoping and roles (admin, recruiter, hiring manager).
- Jobs with hiring managers, descriptions, and statuses.
- Candidates and their applications to jobs with pipeline stages.
- Interviews, participants, schedule tokens, and messages.
- Scorecards and automation rules for future workflows.

## Usage
Run the migration against a PostgreSQL database with the `pgcrypto` and `citext` extensions enabled:

```bash
psql "$DATABASE_URL" -f migrations/0001_initial.sql
```

# User Provider Contract

The mobile app calls `POST /auth/google` after Google OAuth succeeds. The backend must verify the Google bearer token with Google before creating or updating the local user.

## Request

```http
POST /auth/google
Authorization: Bearer <google-access-token>
Content-Type: application/json
```

```json
{
  "googleId": "google-sub-from-client-for-correlation-only",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://..."
}
```

The backend must treat the verified Google token as the source of truth. Do not trust `membershipType`, role, or admin status from the mobile request.

## Response

```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://...",
    "membershipType": "free",
    "membershipFeatures": {
      "quran": true,
      "hadis": true,
      "motivasi": true,
      "riyadhoh": false,
      "event": false,
      "lapak": false
    }
  }
}
```

`membershipType` must be exactly one of:

- `free`: default account with basic access;
- `membership`: paid or registered member access;
- `sahabat`: full NASUHA community access.

Any invalid or missing value is treated by the app as `free`, but the backend should reject invalid values when writing to the database.

## Suggested database table

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  google_subject text unique,
  email text not null unique,
  name text not null,
  avatar_url text,
  membership_type text not null default 'free'
    check (membership_type in ('free', 'membership', 'sahabat')),
  membership_features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Store the Google `sub` claim as `google_subject`; do not use the email address as the immutable identity. Membership changes must happen through protected backend/admin operations, never by trusting the client.

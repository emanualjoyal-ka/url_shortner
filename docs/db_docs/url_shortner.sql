CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "hashed_passwd" varchar NOT NULL,
  "is_verified" bool DEFAULT false,
  "is_active" bool DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "urls" (
  "id" uuid PRIMARY KEY,
  "original_url" varchar UNIQUE NOT NULL,
  "short_code" varchar UNIQUE NOT NULL,
  "clicks" integer NOT NULL DEFAULT 0,
  "expires_at" timestamp,
  "is_active" bool NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp,
  "user_id" uuid NOT NULL,
  "deleted_at" timestamp
);

CREATE TABLE "refresh_tokens" (
  "id" uuid PRIMARY KEY,
  "token_hash" varchar NOT NULL,
  "user_id" uuid NOT NULL,
  "expires_at" timestamp NOT NULL,
  "is_revoked" bool NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "url_click_events" (
  "id" uuid PRIMARY KEY,
  "url_id" uuid NOT NULL,
  "clicked_at" timestamp DEFAULT (now()),
  "ip_address" text,
  "country" text,
  "city" text,
  "browser" text,
  "operating_system" text,
  "device_type" text,
  "user_agent" text,
  "referrer" text
);

CREATE INDEX ON "urls" ("user_id");

CREATE INDEX ON "urls" ("short_code");

CREATE INDEX ON "refresh_tokens" ("user_id");

CREATE INDEX ON "url_click_events" ("url_id");

CREATE INDEX ON "url_click_events" ("clicked_at");

CREATE INDEX ON "url_click_events" ("ip_address");

ALTER TABLE "urls" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "refresh_tokens" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "url_click_events" ADD FOREIGN KEY ("url_id") REFERENCES "urls" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

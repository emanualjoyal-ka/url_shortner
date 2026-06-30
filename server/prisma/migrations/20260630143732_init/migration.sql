-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_code" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ref_tokens" (
    "id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ref_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_events" (
    "id" TEXT NOT NULL,
    "url_id" TEXT NOT NULL,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "browser" TEXT,
    "operating_system" TEXT,
    "device_type" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,

    CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "urls_short_code_key" ON "urls"("short_code");

-- CreateIndex
CREATE INDEX "urls_user_id_idx" ON "urls"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ref_tokens_token_id_key" ON "ref_tokens"("token_id");

-- CreateIndex
CREATE INDEX "ref_tokens_user_id_idx" ON "ref_tokens"("user_id");

-- CreateIndex
CREATE INDEX "click_events_url_id_clicked_at_idx" ON "click_events"("url_id", "clicked_at");

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref_tokens" ADD CONSTRAINT "ref_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

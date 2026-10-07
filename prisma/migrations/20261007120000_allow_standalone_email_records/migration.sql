CREATE TYPE "public"."EmailLogType" AS ENUM ('CAMPAIGN', 'CONSULTATION');

ALTER TABLE "public"."EmailQueue"
  ALTER COLUMN "campaignId" DROP NOT NULL,
  ALTER COLUMN "recipientId" DROP NOT NULL;

ALTER TABLE "public"."EmailLog"
  ALTER COLUMN "bulkEmailId" DROP NOT NULL,
  ALTER COLUMN "recipientId" DROP NOT NULL,
  ADD COLUMN "recipientEmail" TEXT,
  ADD COLUMN "subject" TEXT,
  ADD COLUMN "type" "public"."EmailLogType" NOT NULL DEFAULT 'CAMPAIGN';
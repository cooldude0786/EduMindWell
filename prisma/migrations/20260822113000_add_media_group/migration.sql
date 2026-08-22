-- CreateEnum
CREATE TYPE "MediaGroup" AS ENUM ('ASSESSMENT', 'WELLNESS', 'WORKSHOPS', 'HERO');

-- AddColumn
ALTER TABLE "MediaAsset" ADD COLUMN "mediaGroup" "MediaGroup";

-- Backfill existing media using the current section/path conventions.
UPDATE "MediaAsset"
SET "mediaGroup" = 'HERO'
WHERE "section" = 'GALLERY' AND "description" = 'HERO';

UPDATE "MediaAsset"
SET "mediaGroup" = 'ASSESSMENT'
WHERE "mediaGroup" IS NULL
  AND ("section" = 'GALLERY' OR "path" LIKE 'assessments/%');

UPDATE "MediaAsset"
SET "mediaGroup" = 'WELLNESS'
WHERE "mediaGroup" IS NULL AND "section" = 'WELLNESS';

UPDATE "MediaAsset"
SET "mediaGroup" = 'WORKSHOPS'
WHERE "mediaGroup" IS NULL AND "section" = 'WORKSHOPS';

-- Index the group used by the public and admin media queries.
CREATE INDEX "MediaAsset_mediaGroup_isPublished_sortOrder_idx"
ON "MediaAsset"("mediaGroup", "isPublished", "sortOrder");

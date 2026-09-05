-- Store whether a media asset's title should be displayed publicly.
ALTER TABLE "MediaAsset" ADD COLUMN "showTitle" BOOLEAN NOT NULL DEFAULT false;
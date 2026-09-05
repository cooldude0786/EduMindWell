-- Store display preferences that apply to an entire media group.
CREATE TABLE "MediaDisplaySetting" (
    "id" TEXT NOT NULL,
    "mediaGroup" "MediaGroup" NOT NULL,
    "showTitles" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MediaDisplaySetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaDisplaySetting_mediaGroup_key" ON "MediaDisplaySetting"("mediaGroup");
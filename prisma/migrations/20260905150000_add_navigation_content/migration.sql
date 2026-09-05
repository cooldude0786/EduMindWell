-- Store dynamic content for the hardcoded Nav submenu.
CREATE TYPE "NavigationKey" AS ENUM ('CAREER', 'MINDSET', 'WELLNESS');

CREATE TABLE "NavigationContent" (
    "id" TEXT NOT NULL,
    "key" "NavigationKey" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "bucket" TEXT,
    "showTitle" BOOLEAN NOT NULL DEFAULT true,
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NavigationContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NavigationContent_key_key" ON "NavigationContent"("key");
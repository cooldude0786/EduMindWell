ALTER TABLE "ContactDetails" RENAME COLUMN "whatsapp" TO "whatsappNumber";
ALTER TABLE "ContactDetails" ADD COLUMN "whatsappCountryCode" TEXT;
ALTER TABLE "FreeConsultationLead" ADD COLUMN "whatToDiscuss" TEXT NOT NULL DEFAULT '';
ALTER TABLE "FreeConsultationLead" ALTER COLUMN "whatToDiscuss" DROP DEFAULT;

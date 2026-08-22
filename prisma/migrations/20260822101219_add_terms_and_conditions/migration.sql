-- CreateTable
CREATE TABLE "TermsAndConditionsSection" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "status" "RefundPolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermsAndConditionsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermsAndConditionsParagraph" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermsAndConditionsParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TermsAndConditionsParagraph_sectionId_order_idx" ON "TermsAndConditionsParagraph"("sectionId", "order");

-- AddForeignKey
ALTER TABLE "TermsAndConditionsParagraph" ADD CONSTRAINT "TermsAndConditionsParagraph_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TermsAndConditionsSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

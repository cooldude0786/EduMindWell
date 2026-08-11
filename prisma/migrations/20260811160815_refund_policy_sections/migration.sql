-- CreateTable
CREATE TABLE "RefundPolicySection" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "status" "RefundPolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundPolicySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundPolicyParagraph" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundPolicyParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RefundPolicyParagraph_sectionId_order_idx" ON "RefundPolicyParagraph"("sectionId", "order");

-- AddForeignKey
ALTER TABLE "RefundPolicyParagraph" ADD CONSTRAINT "RefundPolicyParagraph_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "RefundPolicySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

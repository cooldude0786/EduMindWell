CREATE INDEX "EmailLog_createdAt_idx" ON "public"."EmailLog"("createdAt");
CREATE INDEX "EmailLog_status_createdAt_idx" ON "public"."EmailLog"("status", "createdAt");
CREATE INDEX "EmailLog_type_createdAt_idx" ON "public"."EmailLog"("type", "createdAt");
CREATE INDEX "EmailLog_bulkEmailId_idx" ON "public"."EmailLog"("bulkEmailId");
CREATE INDEX "EmailLog_recipientId_idx" ON "public"."EmailLog"("recipientId");

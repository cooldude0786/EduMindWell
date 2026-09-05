-- Allow one editable record for every submenu item within each Nav section.
ALTER TABLE "NavigationContent" RENAME COLUMN "key" TO "section";
ALTER TABLE "NavigationContent" ADD COLUMN "itemKey" TEXT NOT NULL DEFAULT 'overview';
DROP INDEX "NavigationContent_key_key";
CREATE UNIQUE INDEX "NavigationContent_section_itemKey_key" ON "NavigationContent"("section", "itemKey");
-- 1. Create enum
CREATE TYPE "InvoiceStatus" AS ENUM ('paid', 'pending', 'overdue');

-- 2. Add new enum column (nullable for now)
ALTER TABLE "Invoice"
ADD COLUMN "status_enum" "InvoiceStatus";

-- 3. Migrate existing data
UPDATE "Invoice"
SET "status_enum" =
  CASE
    WHEN status = 'paid' THEN 'paid'::"InvoiceStatus"
    WHEN status = 'pending' THEN 'pending'::"InvoiceStatus"
    WHEN status = 'overdue' THEN 'overdue'::"InvoiceStatus"
    ELSE 'pending'::"InvoiceStatus" -- fallback
  END;

-- 4. Make enum column required
ALTER TABLE "Invoice"
ALTER COLUMN "status_enum" SET NOT NULL;

-- 5. Drop old column
ALTER TABLE "Invoice" DROP COLUMN "status";

-- 6. Rename enum column
ALTER TABLE "Invoice"
RENAME COLUMN "status_enum" TO "status";

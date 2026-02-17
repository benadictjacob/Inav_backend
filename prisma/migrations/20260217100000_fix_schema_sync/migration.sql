-- AlterTable
ALTER TABLE "customers" ADD COLUMN "monthly_installment" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "total_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "next_due_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "last_interest_calc" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payments" ADD COLUMN "transaction_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- Update payments with random transaction IDs for existing rows (if any)
UPDATE "payments" SET "transaction_id" = gen_random_uuid()::text WHERE "transaction_id" IS NULL;

-- Make transaction_id NOT NULL
ALTER TABLE "payments" ALTER COLUMN "transaction_id" SET NOT NULL;

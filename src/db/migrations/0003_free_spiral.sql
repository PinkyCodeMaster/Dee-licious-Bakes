ALTER TABLE "order_items" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_status_history" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "order_status_history_created_by_idx" ON "order_status_history" USING btree ("created_by");
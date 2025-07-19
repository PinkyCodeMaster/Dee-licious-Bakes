ALTER TABLE "product_allergens" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_allergens" ALTER COLUMN "allergen_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_tags" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_tags" ALTER COLUMN "tag_id" SET NOT NULL;
CREATE TABLE "product_recipes" (
	"product_id" text NOT NULL,
	"recipe_id" text NOT NULL,
	"is_main_recipe" boolean DEFAULT false,
	CONSTRAINT "product_recipes_product_id_recipe_id_pk" PRIMARY KEY("product_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_images" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text,
	"url" text NOT NULL,
	"alt_text" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb NOT NULL,
	"prep_time" integer,
	"cook_time" integer,
	"total_time" integer,
	"difficulty" text,
	"servings" integer,
	"notes" text,
	"is_private" boolean DEFAULT true,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "product_recipes" ADD CONSTRAINT "product_recipes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recipes" ADD CONSTRAINT "product_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_images" ADD CONSTRAINT "recipe_images_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_recipes_product_id_idx" ON "product_recipes" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_recipes_recipe_id_idx" ON "product_recipes" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "product_recipes_main_recipe_idx" ON "product_recipes" USING btree ("is_main_recipe");--> statement-breakpoint
CREATE INDEX "recipe_images_recipe_id_idx" ON "recipe_images" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_images_sort_order_idx" ON "recipe_images" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "recipes_title_idx" ON "recipes" USING btree ("title");--> statement-breakpoint
CREATE INDEX "recipes_created_by_idx" ON "recipes" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "recipes_difficulty_idx" ON "recipes" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "recipes_private_idx" ON "recipes" USING btree ("is_private");--> statement-breakpoint
CREATE INDEX "recipes_created_at_idx" ON "recipes" USING btree ("created_at");
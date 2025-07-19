CREATE TABLE "custom_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"request_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"specifications" jsonb,
	"reference_images" jsonb,
	"budget_range" text,
	"event_date" timestamp,
	"status" text DEFAULT 'pending',
	"admin_notes" text,
	"quoted_price" numeric(10, 2),
	"order_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"subject" text NOT NULL,
	"status" text DEFAULT 'open',
	"priority" text DEFAULT 'normal',
	"order_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"sender_id" text,
	"content" text NOT NULL,
	"is_from_customer" boolean NOT NULL,
	"is_read" boolean DEFAULT false,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_message_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."message_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_requests_user_id_idx" ON "custom_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "custom_requests_request_type_idx" ON "custom_requests" USING btree ("request_type");--> statement-breakpoint
CREATE INDEX "custom_requests_status_idx" ON "custom_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "custom_requests_event_date_idx" ON "custom_requests" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "custom_requests_order_id_idx" ON "custom_requests" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "custom_requests_created_at_idx" ON "custom_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "custom_requests_updated_at_idx" ON "custom_requests" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "message_threads_user_id_idx" ON "message_threads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_threads_status_idx" ON "message_threads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_threads_priority_idx" ON "message_threads" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "message_threads_order_id_idx" ON "message_threads" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "message_threads_created_at_idx" ON "message_threads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "message_threads_updated_at_idx" ON "message_threads" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "messages_thread_id_idx" ON "messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "messages_is_from_customer_idx" ON "messages" USING btree ("is_from_customer");--> statement-breakpoint
CREATE INDEX "messages_is_read_idx" ON "messages" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "payments" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hostel_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_hostel_id_hostels_hostel_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("hostel_id") ON DELETE cascade ON UPDATE no action;
CREATE TYPE "public"."roles" AS ENUM('tenant', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"role" "roles" DEFAULT 'admin',
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"room_id" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

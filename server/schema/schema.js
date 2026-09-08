import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  date,
  unique
} from 'drizzle-orm/pg-core';
 
// ENUMS 
export const roleEnum = pgEnum('role', ['admin', 'tenant', 'default']);
export const statusEnum = pgEnum('status', ['pending', 'resolved']);
 

 
// 1. USER
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: roleEnum('role').default('admin').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  roomId: uuid('room_id').references(() => rooms.roomId, {
    onDelete: 'set null',
  }),
});
 
// 2. HOSTEL
export const hostels = pgTable('hostels', {
  hostelId: uuid('hostel_id').defaultRandom().primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
});
 
// 3. ROOMS
export const rooms = pgTable('rooms', {
  roomId: uuid('room_id').defaultRandom().primaryKey().notNull(),
  hostelId: uuid('hostel_id')
    .notNull()
    .references(() => hostels.hostelId, { onDelete: 'cascade' }),
  capacity: integer('capacity').notNull(),
  rent: integer('rent').notNull(),
  roomName: varchar('room_name', { length: 255 }).notNull(),
});
 
// 4. COMPLAINTS
export const complaints = pgTable('complaints', {
  complaintId: uuid('complaint_id').defaultRandom().primaryKey().notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  hostelId: uuid('hostel_id')
    .notNull()
    .references(() => hostels.hostelId, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
 

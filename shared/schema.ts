import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hostels = pgTable("hostels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hostelId: integer("hostel_id").notNull(),
  roomNumber: text("room_number").notNull(),
  capacity: integer("capacity").notNull().default(2),
  floor: integer("floor").notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  currentRoomId: integer("current_room_id"),
  currentRoommateId: integer("current_roommate_id"),
  preferences: text("preferences"),
  isLookingToSwap: boolean("is_looking_to_swap").default(false),
});

export const swapRequests = pgTable("swap_requests", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull(),
  targetStudentId: integer("target_student_id"),
  targetRoomId: integer("target_room_id"),
  requestType: text("request_type").notNull(), // 'direct', 'chain'
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'declined', 'completed'
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const swapChains = pgTable("swap_chains", {
  id: serial("id").primaryKey(),
  chainData: text("chain_data").notNull(), // JSON string of swap chain
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertHostelSchema = createInsertSchema(hostels).omit({ id: true });
export const insertRoomSchema = createInsertSchema(rooms).omit({ id: true });
export const insertStudentSchema = createInsertSchema(students).omit({ 
  id: true, 
  currentRoomId: true, 
  currentRoommateId: true 
});
export const insertSwapRequestSchema = createInsertSchema(swapRequests).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true, 
  createdAt: true, 
  isRead: true 
});

// Types
export type Hostel = typeof hostels.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Student = typeof students.$inferSelect;
export type SwapRequest = typeof swapRequests.$inferSelect;
export type SwapChain = typeof swapChains.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type InsertHostel = z.infer<typeof insertHostelSchema>;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertSwapRequest = z.infer<typeof insertSwapRequestSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Auth schema
export const loginSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
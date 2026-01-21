import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 1. Users (already exists)
export const users = sqliteTable("users", {
  uid: text("uid").primaryKey(),
  email: text("email"),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  hobbies: text("hobbies"),
  handle: text("handle"),          // NEW
  handleLower: text("handle_lower"), // NEW
  lastSeen: integer("last_seen"),
  onlineStatus: text("online_status"),
  chatTheme: text("chat_theme"),
  appTheme: text("app_theme"),
  updatedAt: integer("updated_at"),
});


// 2. Chats (for group + private)
export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  type: text("type"), // 'private' | 'group'
  title: text("title"), // for groups
  avatarUrl: text("avatar_url"), // for groups
  lastMessageAt: integer("last_message_at"),
  updatedAt: integer("updated_at"),
});

// 3. Chat members (many-to-many)
export const chat_members = sqliteTable("chat_members", {
  chatId: text("chat_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role"), // 'admin' | 'member'
});

// 4. Messages
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content"),
  type: text("type"), // 'text' | 'image' | 'video' | 'audio' | 'sticker'
  mediaUrl: text("media_url"),
  createdAt: integer("created_at"),
  seenAt: integer("seen_at"),
});

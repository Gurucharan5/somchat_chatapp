CREATE TABLE `chat_members` (
	`chat_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text,
	`title` text,
	`avatar_url` text,
	`last_message_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`content` text,
	`type` text,
	`media_url` text,
	`created_at` integer,
	`seen_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`uid` text PRIMARY KEY NOT NULL,
	`email` text,
	`username` text,
	`avatar_url` text,
	`bio` text,
	`hobbies` text,
	`last_seen` integer,
	`online_status` text,
	`chat_theme` text,
	`app_theme` text,
	`updated_at` integer
);

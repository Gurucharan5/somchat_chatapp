import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

// raw client
export const sqlite = openDatabaseSync("somchat.db");

// drizzle wrapper
export const db = drizzle(sqlite);

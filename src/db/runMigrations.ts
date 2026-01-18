// import { Asset } from "expo-asset";
// import { openDatabaseSync } from "expo-sqlite";

// const MIGRATION_FILES: Record<string, any> = {
//   "0000_certain_firedrake.sql": require("../../drizzle/0000_certain_firedrake.sql"),
//   "0001_early_rachel_grey.sql": require("../../drizzle/0001_early_rachel_grey.sql"),
// };

// export async function runMigrations() {
//   console.log("Running SQL migrations...");

//   const sqlite = openDatabaseSync("somchat.db");

//   for (const file of Object.keys(MIGRATION_FILES)) {
//     const module = MIGRATION_FILES[file];
//     const asset = Asset.fromModule(module);

//     await asset.downloadAsync();

//     // Read file text via fetch:
//     const response = await fetch(asset.localUri!);
//     const sql = await response.text();

//     sqlite.execSync(sql);
//   }

//   console.log("Migrations applied.");
//   const result = sqlite.getAllSync(`SELECT name FROM sqlite_master WHERE type='table'`);
//   console.log("Tables in DB:", result);

//   return sqlite;
// }
// import { migrate } from "drizzle-orm/expo-sqlite/migrator";
// import * as migrations from "../../drizzle/migrations";
// import { db } from "./drizzle";

// export async function runMigrations() {
//   console.log("Running migrations...");
//   await migrate(db, { migrations });
//   console.log("Migrations complete.");
// }
import { Asset } from "expo-asset";
import { openDatabaseSync } from "expo-sqlite";

const MIGRATION_FILES: Record<string, any> = {
  "0000_unique_ego.sql": require("../../drizzle/0000_unique_ego.sql"),
};

export async function runMigrations() {
  console.log("Running SQL migrations...");

  const sqlite = openDatabaseSync("somchat.db");

  // 1. Create migrations tracking table if it doesn't exist
  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      migration_name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    );
  `);

  // 2. Get list of already applied migrations
  const appliedMigrations = sqlite.getAllSync<{ migration_name: string }>(
    `SELECT migration_name FROM __drizzle_migrations`
  );
  const appliedSet = new Set(appliedMigrations.map(m => m.migration_name));

  // 3. Run only NEW migrations
  for (const file of Object.keys(MIGRATION_FILES)) {
    if (appliedSet.has(file)) {
      console.log(`⏭️  Skipping already applied: ${file}`);
      continue;
    }

    console.log(`🔄 Applying migration: ${file}`);
    
    const module = MIGRATION_FILES[file];
    const asset = Asset.fromModule(module);
    await asset.downloadAsync();

    const response = await fetch(asset.localUri!);
    const sql = await response.text();

    // Run migration
    sqlite.execSync(sql);

    // Record that this migration was applied
    sqlite.runSync(
      `INSERT INTO __drizzle_migrations (migration_name, applied_at) VALUES (?, ?)`,
      [file, Date.now()]
    );

    console.log(`✅ Applied: ${file}`);
  }

  console.log("Migrations completed.");
  const result = sqlite.getAllSync(`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log("Tables in DB:", result);

  return sqlite;
}
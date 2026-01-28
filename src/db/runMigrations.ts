import { Asset } from "expo-asset";
import { SQLiteDatabase } from "expo-sqlite";

const MIGRATION_FILES: Record<string, any> = {
  "0000_unique_ego.sql": require("../../drizzle/0000_unique_ego.sql"),
  "0001_tearful_scarlet_witch.sql": require("../../drizzle/0001_tearful_scarlet_witch.sql"),
};

export async function runMigrations(sqlite: SQLiteDatabase) {
  console.log("Running SQL migrations...");

  // const sqlite = openDatabaseSync("somchat.db");

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

import { Asset } from "expo-asset";
import { openDatabaseSync } from "expo-sqlite";

const MIGRATION_FILES: Record<string, any> = {
  "0000_certain_firedrake.sql": require("../../drizzle/0000_certain_firedrake.sql"),
};

export async function runMigrations() {
  console.log("Running SQL migrations...");

  const sqlite = openDatabaseSync("somchat.db");

  for (const file of Object.keys(MIGRATION_FILES)) {
    const module = MIGRATION_FILES[file];
    const asset = Asset.fromModule(module);

    await asset.downloadAsync();

    // Read file text via fetch:
    const response = await fetch(asset.localUri!);
    const sql = await response.text();

    sqlite.execSync(sql);
  }

  console.log("Migrations applied.");
  const result = sqlite.getAllSync(`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log("Tables in DB:", result);

  return sqlite;
}

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const sqliteDb = openDatabaseSync('myapp.db'); // change name if needed

export const db = drizzle(sqliteDb, { schema });
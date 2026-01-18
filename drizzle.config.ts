// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./src/db/schema.ts",
//   out: "./drizzle/migrations",
//   dialect: "sqlite",
  
// });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema.ts',
  out: './drizzle',
});

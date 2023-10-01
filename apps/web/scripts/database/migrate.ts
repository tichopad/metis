import fs from 'fs/promises';
import { FileMigrationProvider, Kysely, Migrator } from 'kysely';
import * as path from 'path';
import readline from 'readline/promises';
import { z } from 'zod';
import { createDialect } from '../../src/lib/server/database/dialect';

// Get env variables
const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
});
const env = envSchema.parse(process.env);
console.log(`Migrating database at ${env.DATABASE_URL}`);
console.log(`Auth token is ${env.DATABASE_AUTH_TOKEN ? 'set' : 'not set'}`);

// Get migration direction ('up' or 'down')
// Down migrates 1 step back, up migrates to the latest
const directionSchema = z.enum(['up', 'down']).default('up');
const direction = directionSchema.parse(process.argv[2]);
console.log(`Migrating ${direction}`);

// Get current directory path
const dirUrl = new URL('.', import.meta.url);
const migrationsDirUrl = new URL('./migrations', dirUrl);
console.log(`Migrations directory is ${migrationsDirUrl.pathname}`);

// Get confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const isConfirmed = await rl.question('Do you want to continue? (Y/n)');
if (isConfirmed === 'n') {
  console.log('Aborting...');
  process.exit(1);
}

// Create DB client
const db = new Kysely<any>({
  dialect: await createDialect(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN),
});

// Create migrator
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    // This needs to be an absolute path or file URL.
    migrationFolder: migrationsDirUrl.pathname,
  }),
});

// Migrate
const migrate = () => {
  if (direction === 'down') return migrator.migrateDown();
  return migrator.migrateToLatest();
};
const { results, error } = await migrate();

results?.forEach((it) => {
  if (it.status === 'Success') {
    if (direction === 'up') {
      console.log(`Migration "${it.migrationName}" was executed successfully`);
    } else {
      console.log(`Migration "${it.migrationName}" was rolled back successfully`);
    }
  } else if (it.status === 'Error') {
    console.error(`Failed to execute migration "${it.migrationName}"`);
  }
});

if (error) {
  console.error('failed to migrate');
  console.error(error);
  process.exit(1);
}

await db.destroy();
process.exit(0);

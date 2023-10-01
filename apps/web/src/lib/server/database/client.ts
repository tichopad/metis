import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$env/static/private';
import { Kysely } from 'kysely';
import { createDialect } from './dialect';
import type { DB } from './schema';

/**
 * A database client instance.
 */
const db = new Kysely<DB>({
  dialect: await createDialect(DATABASE_URL, DATABASE_AUTH_TOKEN),
});

export default db;

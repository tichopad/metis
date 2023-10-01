import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$env/static/private';
import { Kysely } from 'kysely';
import type { DB } from 'kysely-codegen';
import { createDialect } from './dialect';

/**
 * A database client instance.
 */
const db = new Kysely<DB>({
  dialect: await createDialect(DATABASE_URL, DATABASE_AUTH_TOKEN),
});

export default db;

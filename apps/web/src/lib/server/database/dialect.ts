import type { Dialect } from 'kysely';

/**
 * Creates a database dialect based on the given URL.
 */
export async function createDialect(dbUrl: string, authToken?: string): Promise<Dialect> {
  // For local development, you might want to use a local database,
  // but @libsql/kysely-libsql only supports libSQL server URLs.
  // So I only switch to libsql dialect if the URL starts with "libsql://".
  if (dbUrl.startsWith('libsql://')) {
    // Remote database connection requires an auth token
    if (!authToken) {
      throw new Error('Auth token needs to be provided when connecting to a remote DB');
    }
    const { LibsqlDialect } = await import('@libsql/kysely-libsql');
    return new LibsqlDialect({
      url: dbUrl,
      authToken,
    });
  }

  // import.meta.env is only available in Vite
  if (import.meta.env?.DEV === false) {
    throw new Error('Local file database is only supported in development mode');
  }

  const { default: LocalDatabase } = await import('better-sqlite3');
  const { SqliteDialect } = await import('kysely');
  return new SqliteDialect({
    database: new LocalDatabase(dbUrl),
  });
}

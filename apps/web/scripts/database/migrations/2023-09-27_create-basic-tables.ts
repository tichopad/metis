import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const isoNow = sql`(strftime('%Y-%m-%dT%H:%M:%f', 'now'))`;

  await db.schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('openai_api_key', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .addColumn('updated_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .execute();

  await db.schema
    .createTable('conversation')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id'))
    .addColumn('group_id', 'text', (col) => col.references('group.id'))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('system_prompt', 'text')
    .addColumn('created_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .addColumn('updated_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .execute();

  await db.schema
    .createTable('group')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id'))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('system_prompt', 'text')
    .addColumn('created_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .addColumn('updated_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .execute();

  await db.schema
    .createTable('message')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('conversation_id', 'text', (col) => col.notNull().references('conversation.id'))
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('author', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .addColumn('updated_at', 'text', (col) => col.defaultTo(isoNow).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('conversation').execute();
  await db.schema.dropTable('group').execute();
  await db.schema.dropTable('message').execute();
}

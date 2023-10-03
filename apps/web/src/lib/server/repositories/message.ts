import db from '$lib/server/database/client';
import type { MessageTable } from '$lib/server/database/schema';
import type { Insertable } from 'kysely';

type ID = string;

export async function listMessages(conversationId: ID) {
  const messages = await db
    .selectFrom('message')
    .selectAll()
    .where('conversation_id', '=', conversationId)
    .orderBy('created_at', 'asc')
    .execute();

  return messages;
}

export async function createMessage(data: Insertable<MessageTable>) {
  const insertedMessage = await db
    .insertInto('message')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();

  return insertedMessage;
}

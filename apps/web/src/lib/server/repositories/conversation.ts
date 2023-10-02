import db from '$lib/server/database/client';
import type { Conversation } from '$lib/server/database/schema';
import type { Insertable, Updateable } from 'kysely';
import type { MarkRequired } from 'ts-essentials';

type ID = string;

export async function getConversationDetails(id: ID) {
  const conversationDetails = await db
    .selectFrom('conversation')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  return conversationDetails;
}

export async function createConversation(data: Insertable<Conversation>) {
  const insertedConversation = await db
    .insertInto('conversation')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();

  return insertedConversation;
}

type UpdateableConversationWithId = MarkRequired<Updateable<Conversation>, 'id'>;
export async function updateConversation(data: UpdateableConversationWithId) {
  const updatedConversation = await db
    .updateTable('conversation')
    .set(data)
    .where('id', '=', data.id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return updatedConversation;
}

export async function deleteConversation(id: ID) {
  const deletedConversation = await db
    .deleteFrom('conversation')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return deletedConversation;
}

export async function listConversationsWithGroups(userId: ID) {
  const conversationsWithGroups = await db
    .selectFrom('conversation')
    .fullJoin('group', 'group.id', 'conversation.group_id')
    .select([
      'conversation.created_at as conversation_created_at',
      'conversation.id as conversation_id',
      'conversation.name as conversation_name',
      'group.created_at as group_created_at',
      'group.id as group_id',
      'group.name as group_name',
    ])
    .execute();
  console.log('conversationsWithGroups', conversationsWithGroups);

  // Group rows by group id, if row's group id is null, it goes into a "groupless" group
  const groupedConversations = conversationsWithGroups.reduce((acc, row) => {
    const groupId = row.group_id ?? 'groupless';
    const group = acc[groupId] ?? [];
    return {
      ...acc,
      [groupId]: [...group, row],
    };
  }, {} as Record<string, typeof conversationsWithGroups>);

  return groupedConversations;
}

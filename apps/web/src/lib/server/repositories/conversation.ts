import db from '$lib/server/database/client';
import type { ConversationUpdate, NewConversation } from '$lib/server/database/schema';
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

export async function createConversation(data: NewConversation) {
  const insertedConversation = await db
    .insertInto('conversation')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();

  return insertedConversation;
}

export async function updateConversation(data: MarkRequired<ConversationUpdate, 'id'>) {
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
  const groupsWithConversations = await db
    .selectFrom('group')
    .leftJoin('conversation', 'group.id', 'conversation.group_id')
    .select([
      'conversation.created_at as conversation_created_at',
      'conversation.id as conversation_id',
      'conversation.name as conversation_name',
      'group.created_at as group_created_at',
      'group.id as group_id',
      'group.name as group_name',
    ])
    .where('group.user_id', '=', userId)
    .execute();

  const withoutGroup = await db
    .selectFrom('conversation')
    .select(['id', 'name', 'created_at'])
    .where('group_id', 'is', null)
    .execute();

  const withGroupMap = new Map<ID, typeof groupsWithConversations>();

  for (const row of groupsWithConversations) {
    const groupConversations = withGroupMap.get(row.group_id) ?? [];
    groupConversations.push(row);
    withGroupMap.set(row.group_id, groupConversations);
  }

  return {
    withoutGroup,
    withGroup: Array.from(withGroupMap),
  };
}

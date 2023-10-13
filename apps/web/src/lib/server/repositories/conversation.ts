import {
  isPropNotNull,
  isPropNull,
  type RemoveNullFromProps,
  type SetPropsToNull,
} from '$lib/helpers/types';
import db from '$lib/server/database/client';
import type { ConversationUpdate, NewConversation } from '$lib/server/database/schema';
import type { ElementOf, MarkRequired } from 'ts-essentials';

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
  const allGroups = await db
    .selectFrom('group')
    .select(['id', 'name', 'created_at'])
    .where('user_id', '=', userId)
    .execute();

  const allConversations = await db
    .selectFrom('conversation')
    .select(['id', 'name', 'created_at', 'group_id'])
    .where('user_id', '=', userId)
    .execute();

  type ConversationRow = ElementOf<typeof allConversations>;
  type GroupRow = ElementOf<typeof allGroups>;
  type WithoutGroup = SetPropsToNull<ConversationRow, 'group_id'>;
  type WithGroup = RemoveNullFromProps<ConversationRow, 'group_id'>;
  type GroupWithConversations = GroupRow & { conversations: WithGroup[] };

  const withoutGroup: WithoutGroup[] = [];
  const withGroup = new Map<ID, GroupWithConversations>();

  for (const group of allGroups) {
    withGroup.set(group.id, { ...group, conversations: [] });
  }

  for (const conversation of allConversations) {
    if (isPropNull(conversation, 'group_id')) {
      withoutGroup.push(conversation);
      continue;
    }
    if (isPropNotNull(conversation, 'group_id')) {
      const group = withGroup.get(conversation.group_id);
      if (group) group.conversations.push(conversation);
      continue;
    }
  }

  return {
    withoutGroup,
    withGroup,
  };
}

import db from '$lib/server/database/client';
import type {
  Conversation,
  ConversationUpdate,
  Group,
  NewConversation,
} from '$lib/server/database/schema';
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

type ListConversationGroupRow = {
  conversation_created_at: Conversation['created_at'] | null;
  conversation_id: Conversation['id'] | null;
  conversation_name: Conversation['name'] | null;
  group_created_at: Group['created_at'] | null;
  group_id: Group['id'] | null;
  group_name: Group['name'] | null;
};
type GroupedConversations = {
  withoutGroup: ListConversationGroupRow[];
  withGroup: Array<[ID, ListConversationGroupRow[]]>;
};
export async function listConversationsWithGroups(userId: ID): Promise<GroupedConversations> {
  // TODO: fix query, it won't select groups without conversations
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
    .where('conversation.user_id', '=', userId)
    .execute();
  console.log(JSON.stringify({ conversationsWithGroups }, null, 2));

  const withGroupMap = new Map<ID, ListConversationGroupRow[]>();
  const withoutGroup: ListConversationGroupRow[] = [];

  for (const row of conversationsWithGroups) {
    if (row.group_id === null) {
      withoutGroup.push(row);
    } else {
      const groupConversations = withGroupMap.get(row.group_id) ?? [];
      groupConversations.push(row);
      withGroupMap.set(row.group_id, groupConversations);
    }
  }

  return {
    withoutGroup,
    withGroup: Array.from(withGroupMap),
  };
}

import db from '$lib/server/database/client';
import type {
  Conversation as DBConversation,
  Group as DBGroup,
  Message as DBMessage,
} from '$lib/server/database/schema';
import logger from '$lib/server/logger';
import { error } from '@sveltejs/kit';
import type { Insertable, Updateable } from 'kysely';
import { performance } from 'perf_hooks';

// TODO: remove this
const user = await db.selectFrom('user').select('id').where('id', '=', '1-abc').execute();
if (user.length === 0) {
  await db
    .insertInto('user')
    .values({
      email: 'example@example.com',
      name: 'Example User',
      openai_api_key: 'test',
      id: '1-abc',
    })
    .execute();
}

type ID = string;

export class GroupRepository {
  async get(id: ID) {
    logger.debug(`Getting group ${id}`);
    const dbStart = performance.now();

    const group = await db.selectFrom('group').selectAll().where('id', '=', id).executeTakeFirst();

    const dbEnd = performance.now();
    logger.debug('Get group result (took %dms): %O', Math.floor(dbEnd - dbStart), group);

    if (group === undefined) {
      throw error(404, `Group ${id} not found`);
    }

    return group;
  }

  async list() {
    logger.debug(`Listing groups`);
    const dbStart = performance.now();

    const result = await db
      .selectFrom('group')
      .leftJoin('conversation', 'conversation.group_id', 'group.id')
      .select([
        'group.id as group_id',
        'group.name as group_name',
        'group.created_at as group_created_at',
        'conversation.id as conversation_id',
        'conversation.name as conversation_name',
        'conversation.created_at as conversation_created_at',
      ])
      .where('group.user_id', '=', '1-abc')
      .orderBy('conversation_name', 'asc')
      .execute();

    const dbEnd = performance.now();
    logger.debug('List result (took %dms): %o', Math.floor(dbEnd - dbStart), result);

    type MappedGroupWithConversations = {
      id: ID;
      name: string;
      created_at: string;
      conversations: {
        id: ID;
        name: string;
        created_at: string;
      }[];
    };

    const mapStart = performance.now();
    const groupsWithConversations = result
      .reduce((acc, row) => {
        const group = acc.find((g) => g.id === row.group_id);
        if (group === undefined) {
          acc.push({
            id: row.group_id,
            name: row.group_name,
            created_at: row.group_created_at,
            conversations:
              row.conversation_id && row.conversation_name && row.conversation_created_at
                ? [
                    {
                      id: row.conversation_id,
                      name: row.conversation_name,
                      created_at: row.conversation_created_at,
                    },
                  ]
                : [],
          });
        } else if (row.conversation_id && row.conversation_name && row.conversation_created_at) {
          group.conversations.push({
            id: row.conversation_id,
            name: row.conversation_name,
            created_at: row.conversation_created_at,
          });
        }
        return acc;
      }, [] as MappedGroupWithConversations[])
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    const mapEnd = performance.now();
    logger.debug(
      'Mapped groups with conversations (took %dms): %o',
      Math.floor(mapEnd - mapStart),
      groupsWithConversations,
    );

    return groupsWithConversations;
  }

  async update(id: ID, group: Updateable<DBGroup>) {
    logger.debug(`Updating group ${id}`);
    const insertStart = performance.now();

    const result = await db
      .updateTable('group')
      .set(group)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    const insertEnd = performance.now();
    logger.debug('Update result (took %dms): %O', Math.floor(insertEnd - insertStart), result);

    return result;
  }

  async put(data: Insertable<Omit<DBGroup, 'id'>>) {
    const id = Math.random().toString(36).substring(7);

    logger.debug(`Putting group ${id}`);
    const insertStart = performance.now();

    const group = await db
      .insertInto('group')
      .values({
        id,
        ...data,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const insertEnd = performance.now();
    logger.debug('Insert result (took %dms) %O', Math.floor(insertEnd - insertStart), group);

    return group;
  }

  async getConversation(conversationId: ID) {
    logger.debug(`Getting conversation ${conversationId}`);
    const dbStart = performance.now();

    const conversation = await db
      .selectFrom('conversation')
      .selectAll()
      .where('id', '=', conversationId)
      .executeTakeFirst();

    const dbEnd = performance.now();
    logger.debug(
      'Get conversation result (took %dms): %O',
      Math.floor(dbEnd - dbStart),
      conversation,
    );

    if (conversation === undefined) {
      throw error(404, `Conversation ${conversationId} not found`);
    }

    return conversation;
  }

  async listMessages(conversationId: ID) {
    logger.debug(`Listing messages for conversation ${conversationId}`);
    const dbStart = performance.now();

    const messages = await db
      .selectFrom('message')
      .selectAll()
      .where('conversation_id', '=', conversationId)
      .orderBy('created_at', 'asc')
      .execute();

    const dbEnd = performance.now();
    logger.debug('List messages result (took %dms): %O', Math.floor(dbEnd - dbStart), messages);

    return messages;
  }

  async putMessage(data: Insertable<Omit<DBMessage, 'id'>>) {
    const id = Math.random().toString(36).substring(7);

    logger.debug(`Putting new message to conversation ${data.conversation_id}`);
    const insertStart = performance.now();

    const insertedMessage = await db
      .insertInto('message')
      .values({ id, ...data })
      .returningAll()
      .executeTakeFirstOrThrow();

    const insertEnd = performance.now();
    logger.debug(
      'Insert message result (took %dms): %O',
      Math.floor(insertEnd - insertStart),
      insertedMessage,
    );

    return insertedMessage;
  }

  async putConversation(data: Omit<Insertable<DBConversation>, 'id'>) {
    const id = Math.random().toString(36).substring(7);

    logger.debug(`Putting conversation ${id}`);
    const insertStart = performance.now();

    const insertedConversation = await db
      .insertInto('conversation')
      .values({ id, ...data })
      .returningAll()
      .executeTakeFirstOrThrow();

    const insertEnd = performance.now();
    logger.debug(
      'Insert conversation result (took %dms): %O',
      Math.floor(insertEnd - insertStart),
      insertedConversation,
    );

    return insertedConversation;
  }
}

const groupRepository = new GroupRepository();

export default groupRepository;

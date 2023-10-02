import db from '$lib/server/database/client';
import type { Group } from '$lib/server/database/schema';
import logger from '$lib/server/logger';
import type { Insertable, Updateable } from 'kysely';
import { performance } from 'perf_hooks';
import type { MarkRequired } from 'ts-essentials';

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

export async function getGroupDetails(id: ID) {
  const groupDetails = await db
    .selectFrom('group')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  return groupDetails;
}

export async function createGroup(data: Insertable<Group>) {
  const insertedGroup = await db
    .insertInto('group')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();

  return insertedGroup;
}

type UpdateableGroupWithId = MarkRequired<Updateable<Group>, 'id'>;
export async function updateGroup(data: UpdateableGroupWithId) {
  const updatedGroup = await db
    .updateTable('group')
    .set(data)
    .where('id', '=', data.id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return updatedGroup;
}

export async function deleteGroup(id: ID) {
  const deletedGroup = await db
    .deleteFrom('group')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

  return deletedGroup;
}

export class GroupRepository {
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
}

const groupRepository = new GroupRepository();

export default groupRepository;

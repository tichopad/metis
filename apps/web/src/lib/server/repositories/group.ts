import db from '$lib/server/database/client';
import type { GroupUpdate, NewGroup } from '$lib/server/database/schema';
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

export async function createGroup(data: NewGroup) {
  const insertedGroup = await db
    .insertInto('group')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();

  return insertedGroup;
}

export async function updateGroup(data: MarkRequired<GroupUpdate, 'id'>) {
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

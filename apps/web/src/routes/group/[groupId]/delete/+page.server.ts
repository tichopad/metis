import { deleteGroupWithConversations, getGroupDetails } from '$lib/server/repositories/group';
import { error, type Actions, type Load, redirect } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const groupId = params.groupId;

  if (!groupId) throw error(404, 'Group not found');

  const group = await getGroupDetails(groupId);

  if (!group) throw error(404, 'Group not found');

  return { group };
};

export const actions: Actions = {
  default: async ({ params }) => {
    const groupId = params.groupId;

    if (!groupId) throw error(404, 'Group not found');

    await deleteGroupWithConversations(groupId);

    throw redirect(303, '/');
  },
};

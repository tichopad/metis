import { error, type Load } from '@sveltejs/kit';
import { getGroupDetails } from '$lib/server/repositories/group';

export const load: Load = async ({ params }) => {
  if (!params.groupId) {
    throw error(400, 'Group ID is required');
  }

  const group = await getGroupDetails(params.groupId);

  if (!group) {
    throw error(404, 'Group not found');
  }

  return {
    group,
  };
};

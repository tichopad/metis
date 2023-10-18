import { error, type Actions, type Load, redirect } from '@sveltejs/kit';
import { getGroupDetails, updateGroup } from '$lib/server/repositories/group';

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

export const actions: Actions = {
  default: async ({ params, request }) => {
    if (!params.groupId) {
      throw error(400, 'Group ID is required');
    }

    // TODO: maybe check if group exists before updating?
    // const group = await getGroupDetails(params.groupId);

    // if (!group) {
    //   throw error(404, 'Group not found');
    // }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const systemPrompt = formData.get('system_prompt') as string;

    if (!name) {
      throw error(400, 'Name is required');
    }

    const updatedGroup = await updateGroup({
      id: params.groupId,
      name,
      system_prompt: systemPrompt,
    });

    throw redirect(303, `/group/${updatedGroup.id}`);
  },
};

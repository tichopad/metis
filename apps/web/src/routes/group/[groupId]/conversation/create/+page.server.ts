import logger from '$lib/server/logger';
import type { Actions } from './$types';
import groupRepository from '$lib/server/repositories/group';
import { error, type Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  logger.debug(`Loading group ${params.groupId}`);
  if (params.groupId === undefined) {
    throw error(404, `Group ID is undefined`);
  }
  const group = await groupRepository.get(params.groupId);

  return { group };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    logger.debug(`Creating conversation in group ${params.groupId}`);

    const formValues = await request.formData();
    const name = formValues.get('name') as string;
    const description = formValues.get('description') as string;

    logger.debug('Form values: %O', { name, description });

    const conversation = await groupRepository.putConversation({
      group_id: params.groupId,
      name,
      description,
      user_id: '1-abc',
    });

    return { conversation };
  },
};

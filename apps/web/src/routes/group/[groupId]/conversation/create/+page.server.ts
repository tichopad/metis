import { createId } from '$lib/helpers/id';
import logger from '$lib/server/logger';
import { createConversation } from '$lib/server/repositories/conversation';
import { getGroupDetails } from '$lib/server/repositories/group';
import { error, type Load } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Group } from '$lib/server/database/schema';

export const load: Load = async ({ params }) => {
  logger.debug(`Loading group ${params.groupId}`);

  if (params.groupId === undefined) {
    throw error(404, `Group ID is undefined`);
  }

  // TODO: this is clunky, use an Option type instead
  let group: Group | undefined | null;

  if (params.groupId === '-') {
    group = null;
  } else {
    group = await getGroupDetails(params.groupId);
  }

  if (group === undefined) {
    throw error(404, `Group ${params.groupId} not found`);
  }

  return { group };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    logger.debug(`Creating conversation in group ${params.groupId}`);

    const formValues = await request.formData();
    const name = formValues.get('name') as string;
    const description = formValues.get('description') as string;
    const systemPrompt = (formValues.get('system_prompt') as string) || null;

    logger.debug('Form values: %O', { name, description, systemPrompt });

    const conversation = await createConversation({
      id: createId(),
      group_id: params.groupId,
      name,
      description,
      user_id: '1-abc',
      system_prompt: systemPrompt,
    });

    return { conversation };
  },
};

import { createId } from '$lib/helpers/id';
import logger from '$lib/server/logger';
import { createGroup } from '$lib/server/repositories/group';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    logger.debug(`Creating group`);

    const formValues = await event.request.formData();
    const name = formValues.get('name') as string;
    const systemPrompt = formValues.get('system-prompt') as string;

    logger.debug('Form values: %O', { name, systemPrompt });

    const group = await createGroup({
      id: createId(),
      name,
      user_id: '1-abc',
      system_prompt: systemPrompt,
    });

    logger.info(`Created group ${group.id}`);

    return {
      group,
    };
  },
};

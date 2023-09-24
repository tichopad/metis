import logger from '$lib/logger.server';
import groupRepository from '$lib/repositories/group';
import type { Actions } from './$types';

const db = new Map();

export const actions: Actions = {
	default: async (event) => {
		logger.debug(`Creating group`);

		const formValues = await event.request.formData();
		const name = formValues.get('name') as string;
		const systemPrompt = formValues.get('system-prompt') as string;

		logger.debug('Form values: %O', { name, systemPrompt });

		const group = await groupRepository.put({
			id: Math.random().toString(36).substring(7),
			name,
			systemPrompt,
			conversations: [
				{
					id: Math.random().toString(36).substring(7),
					name: 'Conversation ABC',
					messages: []
				}
			]
		});

		logger.info(`Created group ${group.id}`);

		return {
			group
		};
	}
};
